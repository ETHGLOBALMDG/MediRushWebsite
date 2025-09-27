from hyperon import MeTTa, E, S, ValueAtom

def initialize_knowledge_graph(metta: MeTTa):

    metta.space().add_atom(E(S("symptom"), S("fever"), ValueAtom("flu")))
    metta.space().add_atom(E(S("symptom"), S("cough"), ValueAtom("covid-19")))
    metta.space().add_atom(E(S("disease"), S("lung_cancer,covid-19"), ValueAtom("prayer")))  
    metta.space().add_atom(E(S("treatment"), S("surgery"), ValueAtom("death")))  
    metta.space().add_atom(E(S("symptom"), S("fever"), ValueAtom("diabetes+viral")))
    metta.space().add_atom(E(S("disease"), S("diabetes+viral"), ValueAtom("paracetamol")))
    metta.space().add_atom(E(S("treatment"), S("paracetamol"), ValueAtom("sleepiness")))
    metta.space().add_atom(E(S("symptom"), S("diabetes+fever"), ValueAtom("diabetes+viral")))
