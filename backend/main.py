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
    print("Smart contract loaded successfully! ⛓️")
except FileNotFoundError:
    print("Contract details not found. Please run blockchain_utils.py first.")
    AyurTraceContract = None

# --- FastAPI Application ---
app = FastAPI()

# --- Endpoint 1: Herb Suitability Mapping (Powered by Ollama) ---
@app.get("/herb_suitability/")
async def get_herb_suitability(herb_name: str = Query(..., description="The common name of the herb to check for suitable growing locations.")):
    """
    Uses Ollama to dynamically provide information on desirable locations to grow a specific herb.
    """
    prompt = f"""
    Act as a botanist and agricultural expert specializing in Indian Ayurvedic herbs.
    For the herb "{herb_name}", provide a concise description and a list of suitable growing locations in India.
    Respond ONLY with a valid JSON object in the following format:
    {{
      "description": "your_description_here",
      "suitable_locations": ["Location1", "Location2", "Location3"]
    }}
    Do not include any other text, explanations, or markdown formatting before or after the JSON object.
    """

    try:
        response = ollama.chat(
            model='gemma3:4b',
            messages=[{'role': 'user', 'content': prompt}]
        )
        response_content = response['message']['content']
        data = json.loads(response_content)
        return {
            "status": "success",
            "herb_name": herb_name.strip().title(),
            "data": data
        }
    except json.JSONDecodeError:
        return {"status": "error", "message": "The LLM returned a non-JSON response. Please try again."}
    except Exception as e:
        return {"status": "error", "message": f"An error occurred: {e}"}

# --- Endpoint 2: Herb Traceability Submission (Farmer) ---
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

# --- Endpoint 3: Processor Updates ---
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

# --- Endpoint 4: General Dashboard ---
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

# --- Endpoint 5: Consumer Traceability ---
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


# --- Endpoint 6: Contextual Advice for Collectors (LLM) ---
@app.post("/llm_query/")
async def llm_query(
    question: str = Query(...),
    herb_name: str = Query(None),
    latitude: float = Query(None),
    longitude: float = Query(None)
):
    # ... (previous code from the llm_query endpoint) ...
    try:
        prompt = f"""
        Role: You are a seasoned Ayurvedic herbalist and a local farmer from the region of India specified by the given latitude and longitude. Your knowledge is based on generations of traditional wisdom and is practical for the local environment.
        Task: Based on the herb name '{herb_name}' and the location (latitude: {latitude}, longitude: {longitude}), provide a detailed answer to the following question: '{question}'.
        """
        response = ollama.chat(
            model='gemma3:4b',
            messages=[{'role': 'user', 'content': prompt}]
        )

        return {"status": "success", "response": response['message']['content']}
    except Exception as e:
        return {"status": "error", "message": f"An error occurred: {e}"}