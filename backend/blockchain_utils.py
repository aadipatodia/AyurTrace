import json
from web3 import Web3
from solcx import compile_standard, install_solc
import os

# --- Step 1: Connect to Ganache ---
ganache_url = "http://127.0.0.1:7545"  # This is the default RPC URL for Ganache
web3 = Web3(Web3.HTTPProvider(ganache_url))
assert web3.is_connected()
print("Connected to Ganache!")

# --- Step 2: Install Solidity compiler and compile the smart contract ---
# Install the Solidity compiler if it's not already installed
# This only needs to be run once.
try:
    install_solc("0.8.0")
except Exception:
    print("Solidity compiler version 0.8.0 is already installed.")

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
            "outputSelection": {
                "*": {
                    "*": ["abi", "evm.bytecode", "evm.deployedBytecode"]
                }
            }
        }
    },
    solc_version="0.8.0")
    return compiled_sol

# --- Step 3: Deploy the contract and get the address ---
def deploy_contract(compiled_sol):
    """
    Deploys the compiled contract to the Ganache network.
    """
    # Get the contract's bytecode and ABI from the compiled output
    bytecode = compiled_sol['contracts']['AyurTrace.sol']['AyurTrace']['evm']['bytecode']['object']
    abi = compiled_sol['contracts']['AyurTrace.sol']['AyurTrace']['abi']
    
    # Get the default account to deploy from
    account = web3.eth.accounts[0]
    
    # Create the contract instance
    AyurTraceContract = web3.eth.contract(abi=abi, bytecode=bytecode)
    
    # Build and send the deployment transaction
    tx_hash = AyurTraceContract.constructor().transact({
        'from': account
    })
    
    # Wait for the transaction to be mined and get the contract address
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    contract_address = tx_receipt.contractAddress
    
    print(f"Contract deployed at: {contract_address}")
    return contract_address, abi

# --- Main execution block to compile and deploy ---
if __name__ == "__main__":
    # Correct file path
    contract_file_path = os.path.join("..", "blockchain", "contracts", "AyurTrace.sol")
    
    compiled_contract = compile_contract(contract_file_path)
    contract_address, contract_abi = deploy_contract(compiled_contract)

    # Save the address and ABI to a file for later use
    # Note: The file is saved in the 'backend' folder
    with open("contract_details.json", "w") as f:
        json.dump({"address": contract_address, "abi": contract_abi}, f)
    print("Contract details saved to contract_details.json")