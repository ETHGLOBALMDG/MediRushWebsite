import flask from Flask, request, jsonify
import json 

app = Flask(__name__)

@app.route('/register_user', methods=['POST'])
def register_user_on_contract():
    # patient_details = request.get_json() 
    name = patient_details.json['name']
    dob = patient_details.json['dob'] # to be removed if we get details from zk proof
    contact_number = patient_details.json['contact_number']
    inm = patient_details['enm'] # to be sent as a dictionary with known allergies + diseases + blood grp
    
    