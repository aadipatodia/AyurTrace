import json
from web3 import Web3
from solcx import compile_standard, install_solc
import os

# --- Step 1: Connect to Ganache ---
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))
assert web3.is_connected()
print("Connected to Ganache!")

# --- Step 2: Install and Compile the Smart Contract ---
try:
    install_solc("0.8.20")
except Exception:
    print("Solidity compiler version 0.8.20 is already installed.")

def compile_contract(contract_path):
    """
    Compiles the Solidity smart contract.
    """
    with open(contract_path, "r") as file:
        contract_content = file.read()

    # The `compile_standard` function expects a specific input format
    compiled_sol = compile_standard({
        "language": "Solidity",
        "sources": {
            "AyurTrace.sol": {
                "content": contract_content
            }
        },
        "settings": {
             "optimizer": {
                "enabled": True,
                "runs": 200
            },
            "outputSelection": {
                "*": {
                    "*": ["abi", "evm.bytecode"]
                }
            }
        }
    },
    solc_version="0.8.20",
    # Allow import paths for OpenZeppelin
    allow_paths="../blockchain/node_modules")
    
    return compiled_sol

# --- Step 3: Deploy the contract ---
def deploy_contract(compiled_sol):
    """
    Deploys the compiled contract to the Ganache network.
    """
    bytecode = compiled_sol['contracts']['AyurTrace.sol']['AyurTrace']['evm']['bytecode']['object']
    abi = compiled_sol['contracts']['AyurTrace.sol']['AyurTrace']['abi']
    
    account = web3.eth.accounts[0] # This will be the admin
    
    AyurTraceContract = web3.eth.contract(abi=abi, bytecode=bytecode)
    
    tx_hash = AyurTraceContract.constructor().transact({
        'from': account,
        'gas': 2000000 
    })
    
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    contract_address = tx_receipt.contractAddress
    
    print(f"Contract deployed at: {contract_address}")
    return contract_address, abi

# --- NEW Step 4: Grant Roles ---
def setup_roles(contract_address, contract_abi):
    """
    Sets up the initial roles for the application after deployment.
    """
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)
    admin_account = web3.eth.accounts[0]
    processor_account = web3.eth.accounts[1]

    print(f"Admin Account: {admin_account}")
    print(f"Processor Account: {processor_account}")

    # Grant the PROCESSOR_ROLE to the second account
    try:
        print("Granting PROCESSOR_ROLE...")
        tx_hash = contract.functions.addProcessor(processor_account).transact({'from': admin_account})
        web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Successfully granted PROCESSOR_ROLE to {processor_account}")
    except Exception as e:
        print(f"An error occurred while granting roles: {e}")

# --- Main execution block ---
if __name__ == "__main__":
    # Correct file path, assuming this script is in the `backend` directory
    contract_file_path = os.path.join("..", "blockchain", "contracts", "AyurTrace.sol")
    
    # Make sure you have run `npm install` inside the `blockchain` directory first
    compiled_contract = compile_contract(contract_file_path)
    
    contract_address, contract_abi = deploy_contract(compiled_contract)

    # NEW: Call the function to set up roles
    setup_roles(contract_address, contract_abi)

    # Save details for the backend to use
    with open("contract_details.json", "w") as f:
        json.dump({"address": contract_address, "abi": contract_abi}, f)
    print("Contract details saved to contract_details.json")