import aiofiles
import json
from fastapi import FastAPI, UploadFile, File, Form, Query
from pathlib import Path
from web3 import Web3
import ollama

# --- AI Model Imports ---
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# --- Load the AI model and define class names ---
try:
    model = tf.keras.models.load_model('herb_classifier.h5')
    print("AI model 'herb_classifier.h5' loaded successfully! ")
    
    class_names = [
        'Aloevera', 'Amla', 'Amruta_Balli', 'Arali', 'Ashoka', 'Ashwagandha', 'Avacado', 'Bamboo', 'Basale', 'Betel', 
        'Betel_Nut', 'Brahmi', 'Castor', 'Curry_Leaf', 'Doddapatre', 'Ekka', 'Ganike', 'Gauva', 'Geranium', 'Henna', 
        'Hibiscus', 'Honge', 'Insulin', 'Jasmine', 'Lemon', 'Lemon_grass', 'Mango', 'Mint', 'Nagadali', 'Neem', 'Nithyapushpa', 
        'Nooni', 'Pappaya', 'Pepper', 'Pomegranate', 'Raktachandini', 'Rose', 'Sapota', 'Tulasi', 'Wood_sorel'
    ]

except (IOError, ImportError) as e:
    print(f"Error loading AI model: {e}. The /submit_herb endpoint will not work correctly.")
    model = None

# --- Function to preprocess the image ---
def preprocess_image(file_content: bytes, target_size=(224, 224)):
    """
    Loads image from bytes, resizes it, and prepares it for the model.
    """
    image = Image.open(io.BytesIO(file_content)).convert('RGB')
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0)

# --- Blockchain Setup ---
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

try:
    with open("contract_details.json", "r") as f:
        contract_details = json.load(f)
    contract_address = contract_details["address"]
    contract_abi = contract_details["abi"]
    AyurTraceContract = web3.eth.contract(address=contract_address, abi=contract_abi)
    print("Smart contract loaded successfully! ")
except FileNotFoundError:
    print("Contract details not found. Please run blockchain_utils.py first.")
    AyurTraceContract = None

# --- FastAPI Application ---
app = FastAPI()

# --- Endpoint 1: Herb Traceability Submission (Farmer) ---
@app.post("/submit_herb/")
async def submit_herb(
    herb_name: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image_file: UploadFile = File(...)
):
    if not model:
        return {"status": "error", "message": "AI model is not loaded. Cannot process request."}
    
    try:
        image_content = await image_file.read()
        processed_image = preprocess_image(image_content)
        prediction = model.predict(processed_image)
        
        confidence_score = float(np.max(prediction) * 100)
        predicted_index = np.argmax(prediction)
        ai_verified_species = class_names[predicted_index]

        print(f"AI Prediction: {ai_verified_species} with {confidence_score:.2f}% confidence.")
        
        if AyurTraceContract:
            account = web3.eth.accounts[0] # Farmer's account
            tx_hash = AyurTraceContract.functions.addHerb(
                herb_name,
                ai_verified_species,
                int(confidence_score),
                int(latitude * 1e6),
                int(longitude * 1e6)
            ).transact({'from': account})
            
            web3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                "status": "success",
                "message": "Herb data and AI verification committed to blockchain.",
                "ai_result": {
                    "verified_species": ai_verified_species,
                    "confidence": f"{confidence_score:.2f}%"
                }
            }
        else:
            return {"status": "error", "message": "Smart contract not deployed."}
            
    except Exception as e:
        return {"status": "error", "message": f"An error occurred: {e}"}

# --- Endpoint 2: Processor Updates ---
@app.post("/process_herb/{herb_id}")
async def process_herb(
    herb_id: int,
    action: str = Form(...),
    batch_number: str = Form(...)
):
    """
    Allows a processor to add a processing step to an existing herb entry.
    """
    if not AyurTraceContract:
        return {"status": "error", "message": "Smart contract not deployed."}

    try:
        processor_account = web3.eth.accounts[1]

        PROCESSOR_ROLE = Web3.keccak(text="PROCESSOR_ROLE")
        has_role = AyurTraceContract.functions.hasRole(PROCESSOR_ROLE, processor_account).call()
        if not has_role:
            admin_account = web3.eth.accounts[0]
            tx_hash_grant = AyurTraceContract.functions.addProcessor(processor_account).transact({'from': admin_account})
            web3.eth.wait_for_transaction_receipt(tx_hash_grant)
            print(f"Granted PROCESSOR_ROLE to {processor_account}")

        tx_hash = AyurTraceContract.functions.addProcessingStep(
            herb_id,
            action,
            batch_number
        ).transact({'from': processor_account})

        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        return {
            "status": "success",
            "message": "Processing step added to blockchain.",
            "herb_id": herb_id,
            "transaction_hash": receipt.transactionHash.hex()
        }
    except Exception as e:
        return {"status": "error", "message": f"An error occurred: {e}"}

# --- Endpoint 3: General Dashboard ---
@app.get("/dashboard/")
async def get_dashboard_data():
    if not AyurTraceContract:
        return {"status": "error", "message": "Smart contract not deployed."}

    try:
        herb_count = AyurTraceContract.functions.herbCount().call()
        records = []
        for i in range(herb_count):
            record = AyurTraceContract.functions.herbEntries(i).call()
            records.append({
                "id": i,
                "name": record[0],
                "verified_species": record[1],
                "confidence_score": record[2],
                "latitude": record[3] / 1e6,
                "longitude": record[4] / 1e6,
                "timestamp": record[5],
                "farmer": record[6]
            })
        return {"status": "success", "data": records}
    except Exception as e:
        return {"status": "error", "message": f"An error occurred: {e}"}

# --- Endpoint 4: Consumer Traceability ---
@app.get("/trace_herb/{herb_id}")
async def trace_herb(herb_id: int):
    """
    Fetches the full history of an herb, including origin and processing steps.
    """
    if not AyurTraceContract:
        return {"status": "error", "message": "Smart contract not deployed."}

    try:
        herb_data = AyurTraceContract.functions.herbEntries(herb_id).call()
        if not herb_data[0]:
            return {"status": "error", "message": "Herb ID not found."}

        origin_details = {
            "name": herb_data[0],
            "verifiedSpecies": herb_data[1],
            "confidenceScore": herb_data[2],
            "latitude": herb_data[3] / 1e6,
            "longitude": herb_data[4] / 1e6,
            "timestamp": herb_data[5],
            "farmer": herb_data[6]
        }

        history_data = AyurTraceContract.functions.getProcessingHistory(herb_id).call()
        processing_history = []
        for step in history_data:
            processing_history.append({
                "action": step[0],
                "batchNumber": step[1],
                "timestamp": step[2],
                "processor": step[3]
            })

        return {
            "status": "success",
            "data": {
                "origin": origin_details,
                "processingHistory": processing_history
            }
        }
    except Exception as e:
        return {"status": "error", "message": f"An error occurred while tracing herb: {e}"}

# --- Endpoint 5: Farmer Advice (Farmer LLM) ---
@app.post("/farmer_advice/")
async def farmer_advice(
    query: str = Form(..., description="The farmer's specific question."),
    herb_name: str = Form(None),
    location_name: str = Form(None)
):
    """
    Provides contextual advice to farmers based on their specific questions and location.
    """
    try:
        prompt = f"""
        Role: You are a seasoned Ayurvedic herbalist and a local farmer from the region of India, specifically {location_name}. Your knowledge is based on generations of traditional wisdom and is practical for the local environment.
        Task: Provide a detailed answer to the following question: '{query}'. Focus on practical advice for cultivation, pest control, and harvesting for the herb '{herb_name}'.

        Example farmer query: "I have some pest problem with my tulsi plant in Delhi. What should I do?"
        Your ideal response: "For pest problems with Tulsi in Delhi, a common issue is mealybugs. You can make a natural pesticide by mixing neem oil with water and a small amount of liquid soap. Spray this solution on the affected areas. You should also ensure the plant has good air circulation and avoid over-watering, as pests are often attracted to damp conditions."
        """
        response = ollama.chat(
            model='gemma3:4b',
            messages=[{'role': 'user', 'content': prompt}]
        )

        return {"status": "success", "response": response['message']['content']}
    
    except Exception as e:
        return {"status": "error", "message": f"An error occurred: {e}"}

# --- Endpoint 6: Merged Consumer LLM ---
@app.post("/consumer_chat/")
async def consumer_chat(
    query: str = Form(..., description="The user's specific question about the herb."),
    herb_name: str = Form(None)
):
    """
    Provides information to consumers about a herb's benefits, usage, and other general details.
    This endpoint merges the functionality of `consumer_info` and `herb_suitability`.
    """
    try:
        prompt = f"""
        Role: You are a helpful and knowledgeable Ayurvedic expert. Your goal is to provide a concise and easy-to-understand response to consumers.
        Task: For the herb '{herb_name}', answer the following question: '{query}'. Focus on health benefits, traditional uses, general information, and cultivation advice relevant to a consumer.

        Example query: "What are the health benefits of Amla and how is it used?"
        Your ideal response: "Amla, also known as Indian Gooseberry, is a potent source of Vitamin C. It boosts immunity, promotes healthy hair growth, and helps with digestion. It's often consumed as juice, powder, or pickles."
        
        Example query: "Tell me about growing conditions for Aloe Vera."
        Your ideal response: "Aloe Vera is a succulent that thrives in warm climates. It needs well-drained soil and plenty of sunlight. It's an indoor-friendly plant but can also be grown outdoors in pots. It's drought-tolerant and requires watering only when the soil is completely dry."
        """
        response = ollama.chat(
            model='gemma3:4b',
            messages=[{'role': 'user', 'content': prompt}]
        )

        return {"status": "success", "response": response['message']['content']}
    
    except Exception as e:
        return {"status": "error", "message": f"An error occurred: {e}"}

