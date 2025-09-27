# medicalrag.py
from hyperon import MeTTa, E, S, ValueAtom

class MedicalRAG:
    def __init__(self, metta_instance: MeTTa):
        self.metta = metta_instance

    def save_statement(statement):
        with open("metta/db.py", "a") as f:
            f.write('    '+statement+'\n')


    def query_symptom(self, symptom):
        """Find diseases linked to a symptom."""
        symptom = symptom.strip('"')
        query_str = f'!(match &self (symptom {symptom} $disease) $disease)'
        results = self.metta.run(query_str)
        print(results,query_str)

        unique_diseases = list(set(str(r[0]) for r in results if r and len(r) > 0)) if results else []
        return unique_diseases

    def query_disease(self, disease):
        """Find treatments for a disease."""
        disease = disease.strip('"')
        query_str = f'!(match &self (disease {disease} $treatment) $treatment)'
        results = self.metta.run(query_str)
        print(results,query_str)
        return [r[0].get_object().value for r in results if r and len(r) > 0] if results else []

    def query_treatment(self, treatment):   
        """Find side effects of a treatment."""
        treatment = treatment.strip('"')
        query_str = f'!(match &self (treatment {treatment} $effect) $effect)'
        results = self.metta.run(query_str)
        print(results,query_str)

        return [r[0].get_object().value for r in results if r and len(r) > 0] if results else []

    
    def add_symptom(self, symptom, disease):
        self.metta.space().add_atom(E(S("symptom"), S(symptom), S(disease)))
        MedicalRAG.save_statement(f"metta.space().add_atom(E(S(\"symptom\"), S(\"{symptom}\"), ValueAtom(\"{disease}\")))")
        print("excueted save")
        
    def add_disease(self, disease, treatment):
        self.metta.space().add_atom(E(S("disease"), S(disease), ValueAtom(treatment)))
        MedicalRAG.save_statement(f"metta.space().add_atom(E(S(\"disease\"), S(\"{disease}\"), ValueAtom(\"{treatment}\")))")
        print("excueted save")

    def add_treatment(self, medicine, side_effect):
        self.metta.space().add_atom(E(S("treatment"), S(medicine), ValueAtom(side_effect)))
        MedicalRAG.save_statement(f"metta.space().add_atom(E(S(\"treatment\"), S(\"{medicine}\"), ValueAtom(\"{side_effect}\")))")
        print("excueted save")
