import json
from web3 import Web3
from solcx import compile_standard, install_solc
import os
import sys

# --- Step 0: Pre-flight Check ---
# Ensure the OpenZeppelin contracts are installed. This is the most common reason for the error.
openzeppelin_path = os.path.join(os.path.dirname(__file__), "..", "blockchain", "node_modules", "@openzeppelin")
if not os.path.isdir(openzeppelin_path):
    print("Error: The OpenZeppelin contracts directory was not found.")
    print("This means the required libraries are not installed.")
    print("Please navigate to the 'blockchain' directory in your terminal and run the following command:")
    print("\n    npm install @openzeppelin/contracts\n")
    print("Then, run this Python script again from the 'backend' directory.")
    print("The required path is:", openzeppelin_path)
    sys.exit(1)

# --- Step 1: Connect to Ganache ---
# We assume Ganache is running on the default port.
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))
assert web3.is_connected()
print("Connected to Ganache!")

# --- Step 2: Install and Compile the Smart Contract ---
# Install the Solidity compiler version 0.8.20 if it's not already present.
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
            # Explicitly set the EVM version for better compatibility with Ganache.
            "evmVersion": "london",
            # This tells the compiler how to find the OpenZeppelin files.
            # The path is relative to where the script is run (the `backend` directory).
            "remappings": [
                "@openzeppelin=../blockchain/node_modules/@openzeppelin"
            ],
            "outputSelection": {
                "*": {
                    "*": ["abi", "evm.bytecode"]
                }
            }
        }
    },
    solc_version="0.8.20",
    # Allow the compiler to access the whole project directory structure.
    allow_paths=os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    )
    
    return compiled_sol

# --- Step 3: Deploy the contract ---
def deploy_contract(compiled_sol):
    """
    Deploys the compiled contract to the Ganache network.
    """
    bytecode = compiled_sol['contracts']['AyurTrace.sol']['AyurTrace']['evm']['bytecode']['object']
    abi = compiled_sol['contracts']['AyurTrace.sol']['AyurTrace']['abi']
    
    # The first account in Ganache will be the contract deployer and admin.
    account = web3.eth.accounts[0]
    
    AyurTraceContract = web3.eth.contract(abi=abi, bytecode=bytecode)
    
    # Send the transaction to deploy the contract
    tx_hash = AyurTraceContract.constructor().transact({
        'from': account,
        'gas': 2000000 
    })
    
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    contract_address = tx_receipt.contractAddress
    
    print(f"Contract deployed at: {contract_address}")
    return contract_address, abi

# --- Step 4: Grant Roles ---
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
    contract_file_path = os.path.join(os.path.dirname(__file__), "..", "blockchain", "contracts", "AyurTrace.sol")
    
    compiled_contract = compile_contract(contract_file_path)
    
    contract_address, contract_abi = deploy_contract(compiled_contract)

    # Call the function to set up roles
    setup_roles(contract_address, contract_abi)

    # Save details for the backend to use
    with open("contract_details.json", "w") as f:
        json.dump({"address": contract_address, "abi": contract_abi}, f)
    print("Contract details saved to contract_details.json")