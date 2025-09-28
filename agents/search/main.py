from uagents import Agent, Context, Model
import json
from langchain_google_genai import ChatGoogleGenerativeAI
import dotenv
import os

dotenv.load_dotenv()

class SortInput(Model):
    jsonstr: str
    userloc: str  # address

class DoctorRanking(Model):
    doctor_id: int
    name: str
    rating: int
    final_score: float

class SortResponse(Model):
    ranked_doctors: list[DoctorRanking]

GEMINI_KEY = os.environ.get("GEMINI_KEY")


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    google_api_key=GEMINI_KEY,
    temperature=0.7
)



agent = Agent(
    name="Search agent",
    seed=os.environ.get("SEED"),
    port = 8010,
    mailbox=True,  # Replace with your actual mailbox key
    publish_agent_details=True
)

async def calculate_distance(addr1, addr2):
    prompt = f"""Approximate the distance between the two addresses - addr1: {addr1} and addr2: {addr2}. Measure the straight line distance between the median points of both addresses. Based on this distance, return a value (score) from 0 to 50, for 0 being the farthest (100km) and 50 for being the closest. After 100km, give everyone 0 points.
    Retun only the numerical score between 0 and 50, nothing else"""
    
    try:
        return int(llm.invoke(prompt).content)
    except:
        return 25


@agent.on_message(model=SortInput, replies=SortResponse)
async def sort_doctors_by_score(ctx: Context, sender: str, msg: SortInput):
    try:
        doctors_data = json.loads(msg.jsonstr)
        user_addr = msg.userloc
        
        # Get user location coordinates
        
        ranked_doctors = []
        
        for i, doctor in enumerate(doctors_data):
            # Extract doctor information
            doc_addr = doctor.get('address')
            doc_rating = doctor.get('rating')
            doc_name = doctor.get('name', f'Doctor {i+1}') # fallback
            
            # Calculate distance
            distance = calculate_distance(doctors_data["address"], user_addr)
            
            # Calculate distance score
            
            # Calculate final score
            final_score = doc_rating + distance - 25
            
            # Create ranking object
            doctor_ranking = DoctorRanking(
                doctor_id=i + 1,
                name=doc_name,
                rating=doc_rating,
                distance_km=round(distance, 2),
                final_score=round(final_score, 2)
            )
            
            ranked_doctors.append(doctor_ranking)
        
        # Sort doctors by final score (descending order)
        ranked_doctors.sort(key=lambda x: x.final_score, reverse=True)
        
        # Log the results
        ctx.logger.info("Ranked doctors:")
        for i, doctor in enumerate(ranked_doctors[:5]):  # Show top 5
            ctx.logger.info(f"{i+1}. {doctor.name} - Score: {doctor.final_score} "
                          f"(Rating: {doctor.rating}, Distance: {doctor.distance_km}km)")
        
        # Send response back to sender
        await ctx.send(sender, SortResponse(ranked_doctors=ranked_doctors))
        
    except Exception as e:
        ctx.logger.error(f"Error in sort_doctors_by_score: {str(e)}")
        await ctx.send(sender, SortResponse(ranked_doctors=[]))


if __name__ == "__main__":
    agent.run()