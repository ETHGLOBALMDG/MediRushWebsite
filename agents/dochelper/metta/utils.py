import json
from openai import OpenAI
from .medicalrag import MedicalRAG


class LLM:
    def __init__(self, api_key):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.asi1.ai/v1"
        )
        # self.client.verify_ssl

    def create_completion(self, prompt, max_tokens=2000):
        completion = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}], # need to add some example chats here
            model="asi1-mini",
            temperature=0.2,
            max_tokens=max_tokens
        )
        print(completion)
        return completion.choices[0].message.content

def summarize_query(history, symptoms, diagnosis, solution, side_effects, llm):
    """Use ASI:One API to classify intent and extract a keyword."""
    prompt = f"""
    I will give you five pieces of text: previous medical history, symptoms, doctor's diagnosis, prescribed solution, possible side effects of prescription. These are as follows:
    {{
    previous_medical_history: {history}
    symptoms: {symptoms}
    diagnosis: {diagnosis}
    solution: {solution}
    side_effects: {side_effects}
    }}
    Now after analysing all of the texts,
    <symptoms> : Identify the most important and major symptoms from the given symptom text, which in combination, may lead to a diagnosis as given, keeping in mind the past medical history of chronic devices. Report the symptoms in the form- 'fever,headache,ear pain' without any space after the commas
    <combined_diagnosis> : You need to combine the major previous chronic diseases i.e long lasting diseases and the current major diagnosed disease (only include the previous diseases which are chronic i.e long lasting and might have a possibility of influence/ interference with the current major disease). The combination should be of the form- for eg if there have been 2 identified influencial previous diseases and 1 current disease- 'diabetes+lung cancer+covid-19' without any spacing in between the + signs
    <solution> : Parse the solutions, and identify the major and important solutions (these may include but not limited to- name of some medicine, rest, physiotherapy, therapy etc.). The final form of the solution should be a string of comma seperated major and important solutions, for example- 'paracetamol,rest,herbal tea' - without any space after the commas
    <side_effects> : Identify the major and important side effects of the prescribed medication from the given text, and represent them in the form of comma seperated values, for example - 'dizziness,stomach ache'
    If in any of the four cases, there is no item major enough to be added to the final output, use an empty string- '' for that case.
    In any of the reported symptom/disease/solution/side effect, try to minimize the phrase size, DO NOT include any adjective or helping/describing word unless it is actually a part of the scientific name. eg. "frequent pain in chest" is WRONG, whereas "chest pain" is CORRECT.
    Return *only* the result in JSON format like this as the *content*, with no additional text:
    {{
    "symptoms": "<symptoms>",
    "disease": "<combined_diagnosis>",
    "solution": "<solution>",
    "side_effects": "<side_effects>"
    }}  
"""    
    response = llm.create_completion(prompt)
    try:
        result = json.loads(response)
        return result["symptoms"], result["disease"], result["solution"], result["side_effects"]
    except json.JSONDecodeError:
        print(f"Error parsing ASI:One response: {response}")
        return None, None, None, None

def process_query(history, symptoms, diagnosis, solution, side_effects, rag: MedicalRAG, llm: LLM):
    symptoms_new, disease, solutions, sides = summarize_query(history, symptoms, diagnosis, solution, side_effects, llm)

    if (symptoms_new is None or disease is None or solutions is None or sides is None):
        return None


    print(f"Symptom: {symptoms_new}, Disease: {disease}, Solution: {solutions}, Sides: {sides}")

    if symptoms_new != "":
        print(symptoms_new)
        existing_diseases_for_symptom = rag.query_symptom(symptoms_new)
        print(existing_diseases_for_symptom)
        print(disease)
        if (len(existing_diseases_for_symptom) == 0 or disease not in existing_diseases_for_symptom) and disease != "":
            rag.add_symptom(symptoms_new, disease)
            print(f"Knowledge graph updated - Added symptom: '{symptoms_new}' → '{disease}'")
    
    elif disease != "":
        existing_treatment_for_disease = rag.get_treatment(disease)
        if (len(existing_treatment_for_disease)==0 or solutions not in existing_treatment_for_disease) and solutions != "":
            rag.add_treatment(disease, solutions)

    elif solutions != "":
        existing_side_effects  = rag.get_side_effects(solutions)
        if (len(existing_side_effects) == 0 or sides not in existing_side_effects) and sides != "":
            rag.add_side_effect(solutions, sides)
