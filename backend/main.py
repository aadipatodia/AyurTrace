import aiofiles
import json
from fastapi import FastAPI, UploadFile, File, Form
from pathlib import Path
from web3 import Web3

# --- Blockchain and AI Integration Setup ---
# We will simulate the AI output and blockchain connection for Day 2.

# Connect to Ganache using the URL from your Ganache GUI.
# Ensure your Ganache testnet is running and the URL is correct.
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# Load the deployed contract details from the file created by blockchain_utils.py
try:
    with open("contract_details.json", "r") as f:
        contract_details = json.load(f)
    contract_address = contract_details["address"]
    contract_abi = contract_details["abi"]
    AyurTraceContract = web3.eth.contract(address=contract_address, abi=contract_abi)
    print("Smart contract loaded successfully!")
except FileNotFoundError:
    print("Contract details not found. Please run blockchain_utils.py first to deploy the contract.")
    AyurTraceContract = None

# --- FastAPI Application ---
app = FastAPI()
UPLOAD_DIRECTORY = Path("uploads")

@app.post("/submit_herb/")
async def submit_herb(
    herb_name: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image_file: UploadFile = File(...)
):
    UPLOAD_DIRECTORY.mkdir(exist_ok=True)
    file_location = UPLOAD_DIRECTORY / image_file.filename
    
    try:
        # Save the uploaded file asynchronously
        async with aiofiles.open(file_location, "wb") as f:
            while content := await image_file.read(1024):
                await f.write(content)
        
        # --- Day 2: Simulate AI output and commit to blockchain ---
        
        # In a real-world scenario, you would call the AI model here
        # For now, we simulate a hardcoded output from the AI developer
        ai_verified_species = "Withania somnifera"  # Example: Scientific name for Ashwagandha
        ai_confidence_score = 98  # Example: 98% confidence
        
        if AyurTraceContract:
            # Get the default account to send the transaction from
            account = web3.eth.accounts[0]
            
            # Send a transaction to the smart contract
            # Note: We convert float lat/lon to int to store on-chain, as Solidity doesn't handle floats well.
            tx_hash = AyurTraceContract.functions.addHerb(
                herb_name,
                ai_verified_species,
                ai_confidence_score,
                int(latitude * 1e6),
                int(longitude * 1e6)
            ).transact({'from': account})
            
            # Wait for the transaction to be mined
            tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
            
            print(f"Transaction successful! Hash: {tx_receipt.transactionHash.hex()}")
            return {"status": "success", "message": "Herb data and image saved. Transaction committed to blockchain."}
        else:
            return {"status": "error", "message": "Smart contract not deployed. Please run blockchain_utils.py first."}
            
    except Exception as e:
        return {"status": "error", "message": f"There was an error: {e}"}