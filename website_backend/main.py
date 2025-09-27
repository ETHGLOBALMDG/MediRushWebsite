from flask import Flask, request, jsonify
import os
from walrus import WalrusClient
from uagents import  Model
from web3 import Web3
import json
from flask_cors import CORS
import base64
import tempfile 
import asyncio
from uagents.communication import send_message
from dotenv import load_dotenv

load_dotenv() # This loads variables from your .env file

# Now you can safely access your environment variables
PRIVATE_KEY = os.getenv("PRIVATE_KEY")


app = Flask(__name__)
CORS(app)

class VerRequest(Model):
    pdf64: str

class VerResponse(Model):
    verified: bool
    confidence: float

async def vercall(pdf_path):
    """
    Async function to send PDF to agent and get verification response
    """
    medcall_addr = "agent1qf076x9q8cxwup6vackjmhk7jwpfv2jexn2xmu5quf9gw23n837hyh0qmm8"

    try:
        # Read and encode the PDF file
        with open(pdf_path, 'rb') as f:
            pdfbytes = f.read()
            pdf64bytes = base64.b64encode(pdfbytes)
            pdf64 = pdf64bytes.decode("utf-8")

        # Send message to the agent
        response = await send_message(
            destination=medcall_addr, 
            message=VerRequest(pdf64=pdf64), 
            sync=True  # Changed to True to wait for response
        )
        
        return response
    
    except Exception as e:
        print(f"Error in vercall: {str(e)}")
        return None

def run_async_verification(pdf_path):
    """
    Wrapper to run async function from sync context
    """
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(vercall(pdf_path))
        loop.close()
        return result
    except Exception as e:
        print(f"Error running async verification: {str(e)}")
        return None
    


AGENT_ADDRESS = "agent1qf076x9q8cxwup6vackjmhk7jwpfv2jexn2xmu5quf9gw23n837hyh0qmm8"
# AGENT_SEED = os.environ.get("AGENT_SEED", "my_flask_app_query_agent_seed")

publisher_url = "https://publisher.walrus-testnet.walrus.space"
aggregator_url = "https://aggregator.walrus-testnet.walrus.space"

client = WalrusClient(publisher_base_url=publisher_url, aggregator_base_url=aggregator_url)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

CONTRACT_ADDRESS = "0x7b52C2a7075fc8F7DF4AEAd4f8d8277A8e35838F"  
with open("DoctorContractABI.json") as f:  
    CONTRACT_ABI = json.load(f)

WEB3_PROVIDER = "https://testnet.hashio.io/api"  
PRIVATE_KEY = os.environ.get("PRIVATE_KEY")      

w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER))
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
OWNER_ADDRESS = w3.eth.account.from_key(PRIVATE_KEY).address

@app.route('/api/doctors/uploadCertificate', methods=['POST'])
def upload_certificate():
    if 'certificate' not in request.files:
        return jsonify({"error": "No certificate file provided"}), 400
    file = request.files['certificate']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(file_path)
    response = client.put_blob_from_file(file_path)
    os.remove(file_path)  # Clean up the saved file after upload
    # if 'error' in response:
    #     return jsonify({"error": response['error']}), 500
    # Return the local path or a URL if you serve files statically
    return jsonify({"url": response['url']}), 200




@app.route('/api/doctors/register', methods=['POST'])
def register_doctor():
    if 'certificate' not in request.files:
        return jsonify({"error": "No certificate file provided"}), 400
    file = request.files['certificate']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(file_path)
    response = client.put_blob_from_file(file_path)
    os.remove(file_path)

    # Collect other doctor details from form-data
    name = request.form.get("name", "")
    speciality = request.form.get("specialty", "")
    nationality = request.form.get("nationality", "IND")
    certificate_blob = response.get('url', "")
    doctor_address = request.form.get("doctorAddress", "")  # Doctor's wallet address

    doc_details = {
        "name": name,
        "speciality": speciality,
        "isRegistered": True,
        "slashes": 0,
        "isLegit": True,
        "reputation": 800,
        "nationality": nationality,
        "certificateBlob": certificate_blob
    }

    # --- Hedera Smart Contract Transaction ---
    try:
        txn = contract.functions.addDoctor(
            name,
            speciality,
            doctor_address,
            nationality,
            certificate_blob
        ).build_transaction({
            'from': OWNER_ADDRESS,
            'nonce': w3.eth.get_transaction_count(OWNER_ADDRESS),
            'gas': 300000,
            'gasPrice': w3.to_wei('5', 'gwei')
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)

        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        logs = contract.events.DoctorAdded().process_receipt(receipt)
        if logs:
            return jsonify({
                "success": True,
                "message": "Doctor registered successfully!",
                "doctor": doc_details,
                "txHash": tx_hash.hex()
            }), 200
        else:
            return jsonify({"error": "DoctorAdded event not found, but transaction sent.", "txHash": tx_hash.hex()}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/verifyDocCertificate',methods=['POST'])
def verify_doc():
    try:
        # Check if file is provided
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Validate file type (optional - you can add more validation)
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are allowed"}), 400
        
        # Create a temporary file to store the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name
        
        try:
            # Run the verification process
            result = run_async_verification(temp_file_path)
            
            if result is None:
                return jsonify({"error": "Failed to process document"}), 500
            
            # Parse the response if it's a VerResponse object
            if hasattr(result, 'verified') and hasattr(result, 'confidence'):
                return jsonify({
                    "verified": result.verified,
                    "confidence": result.confidence,
                    "status": "success"
                }), 200
            else:
                # Handle case where response format is different
                return jsonify({
                    "result": str(result),
                    "status": "success"
                }), 200
                
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except OSError:
                pass  # File might already be deleted
    
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route('/api/doctors/addReputation', methods=['POST'])
def add_reputation():
    try:
        data = request.get_json()
        doctor_address = data.get('doctorAddress')
        amount = data.get('amount')
        if not doctor_address or amount is None:
            return jsonify({"error": "doctorAddress and amount are required"}), 400

        txn = contract.functions.addReputation(
            doctor_address,
            int(amount)
        ).build_transaction({
            'from': OWNER_ADDRESS,
            'nonce': w3.eth.get_transaction_count(OWNER_ADDRESS),
            'gas': 200000,
            'gasPrice': w3.to_wei('5', 'gwei')
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        logs = contract.events.ReputationUpdated().process_receipt(receipt)
        if logs:
            return jsonify({
                "success": True,
                "message": "Reputation added successfully.",
                "txHash": tx_hash.hex(),
                "newReputation": logs[0]['args']['reputation']
            }), 200
        else:
            return jsonify({
                "success": True,
                "message": "Transaction sent, but event not found.",
                "txHash": tx_hash.hex()
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/doctors/subtractReputation', methods=['POST'])
def subtract_reputation():
    try:
        data = request.get_json()
        doctor_address = data.get('doctorAddress')
        amount = data.get('amount')
        if not doctor_address or amount is None:
            return jsonify({"error": "doctorAddress and amount are required"}), 400

        txn = contract.functions.subtractReputation(
            doctor_address,
            int(amount)
        ).build_transaction({
            'from': OWNER_ADDRESS,
            'nonce': w3.eth.get_transaction_count(OWNER_ADDRESS),
            'gas': 200000,
            'gasPrice': w3.to_wei('5', 'gwei')
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        logs = contract.events.ReputationUpdated().process_receipt(receipt)
        if logs:
            return jsonify({
                "success": True,
                "message": "Reputation subtracted successfully.",
                "txHash": tx_hash.hex(),
                "newReputation": logs[0]['args']['reputation']
            }), 200
        else:
            return jsonify({
                "success": True,
                "message": "Transaction sent, but event not found.",
                "txHash": tx_hash.hex()
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


