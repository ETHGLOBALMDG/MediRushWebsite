# this file is also deployed on agentverse

import requests
import json
from typing import List, Dict, Any
import urllib3
import os
from dotenv import load_dotenv

load_dotenv()

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning) # iska workaround -> use ngrok to get https

def search_doctor_by_regno(registration_no: str) -> List[Dict[str, Any]]:
    url = os.getenv("IMRURL")
    
    payload = {
        "registrationNo": registration_no
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
    
    try:
        response = requests.post(
            url, 
            json=payload, 
            headers=headers, 
            timeout=30,
            verify=False # this can be removed when using ngrok
        )
        response.raise_for_status()
        
        result = response.json()
        
        if isinstance(result, list):
            return result
        elif isinstance(result, dict):
            if 'data' in result:
                return result['data'] if isinstance(result['data'], list) else [result['data']]
            else:
                return [result]
        else:
            print(f"Unexpected response format: {type(result)}")
            return []
    
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print(f"Response content: {response.text[:500]}...")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

def normalize_name(name: str) -> str:

    if not name:
        return ""
    return name.lower().strip()

def filter_by_name_part(doctors: List[Dict[str, Any]], name_part: str) -> List[Dict[str, Any]]:

    if not name_part:
        return doctors
    
    normalized_part = normalize_name(name_part)
    filtered_doctors = []
    
    for doctor in doctors:
        first_name = normalize_name(doctor.get('firstName', ''))
        middle_name = normalize_name(doctor.get('middleName', ''))
        last_name = normalize_name(doctor.get('lastName', ''))
        
        if (normalized_part in first_name or 
            normalized_part in middle_name or 
            normalized_part in last_name):
            filtered_doctors.append(doctor)
    
    return filtered_doctors

def find_intersection(lists: List[List[Dict[str, Any]]]) -> List[Dict[str, Any]]:

    if not lists:
        return []
    
    if len(lists) == 1:
        return lists[0]
    
    result = lists[0]

    
    for doctor_list in lists[1:]:

        current_ids = {doctor.get('doctorId') for doctor in doctor_list}
        
        result = [doctor for doctor in result if doctor.get('doctorId') in current_ids]
    
    return result


def verify(registration_no, full_name):

    
    if not registration_no:
        return
    
    if not full_name:
        return
    
    name_parts = [part.strip() for part in full_name.split() if part.strip()]
    
    doctors = search_doctor_by_regno(registration_no)
    
    if not doctors:
        return
    

    
    filtered_lists = []
    
    for name_part in name_parts:
        filtered_doctors = filter_by_name_part(doctors, name_part)
        filtered_lists.append(filtered_doctors)
    

    final_results = find_intersection(filtered_lists)
    
    return final_results

