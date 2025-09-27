import os
from dotenv import load_dotenv
from uagents import Context, Model, Agent
from hyperon import MeTTa

# Import components from separate files
from metta.medicalrag import MedicalRAG
from metta.db import initialize_knowledge_graph
from metta.utils import LLM, process_query


# Load environment variables
load_dotenv()
ASI_API_KEY=os.environ.get("ASI_ONE_API")
SEED_PHRASE=os.environ.get("SEED_PHRASE")

# Initialize agent
agent = Agent(
    name="Doctor sahab", 
    port=8002,
    seed=SEED_PHRASE,
    mailbox=True, 
    )

class MedicalQuery(Model):
    history: str
    symptoms: str
    diagnosis: str
    solution: str
    side_effects: str

# Initialize global components
metta = MeTTa()
initialize_knowledge_graph(metta)
rag = MedicalRAG(metta)
llm = LLM(api_key=ASI_API_KEY)


@agent.on_query(model=MedicalQuery)
async def query_handler(ctx: Context, sender: str, qry: MedicalQuery): # by default request goes to /submit        
    history = qry.history
    symptoms = qry.symptoms
    diagnosis = qry.diagnosis
    solution = qry.solution
    side_effects = qry.side_effects
    print("receveied req")

    try:
        # Process the query using the medical assistant logic
        response = process_query(history, symptoms, diagnosis, solution, side_effects, rag, llm)
    except:
        pass




if __name__ == "__main__":
    agent.run()