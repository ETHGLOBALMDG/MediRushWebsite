from uagents import Agent, Context, Model
import json
import math
import dotenv
import os

dotenv.load_dotenv()

class GeolocationRequest(Model):
    address: str

class GeolocationResponse(Model):
    latitude: float
    longitude: float

class SortInput(Model):
    jsonstr: str
    userloc: str  # address

class DoctorRanking(Model):
    doctor_id: int
    name: str
    rating: int
    distance_km: float
    final_score: float

class SortResponse(Model):
    ranked_doctors: list[DoctorRanking]


agent = Agent(
    name="Search agent",
    seed=os.environ.get("SEED"),
    port = 8010,
    mailbox=True,  # Replace with your actual mailbox key
    publish_agent_details=True
)
AI_AGENT_ADDRESS = "agent1qvnpu46exfw4jazkhwxdqpq48kcdg0u0ak3mz36yg93ej06xntklsxcwplc"

async def get_user_location(ctx: Context, address):
    resp = await ctx.send(AI_AGENT_ADDRESS, GeolocationRequest(address=address), response_type=GeolocationResponse, sync=True)
    return (resp.latitude, resp.longitude) 

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) using Haversine formula
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    
    return c * r

def calculate_distance_score(distance_km, max_distance=50):
    """
    Calculate distance score (higher score for shorter distance)
    Score ranges from 0 to 100, with 100 being the closest
    """
    if distance_km >= max_distance:
        return 0
    return 100 * (1 - distance_km / max_distance)

def calculate_final_score(rating, distance_score):
    """
    Calculate final score combining rating and distance
    rating: 1-5 scale 
    distance_score: 0-100 scale
    """
    return rating + distance_score

@agent.on_message(model=SortInput, replies=SortResponse)
async def sort_doctors_by_score(ctx: Context, sender: str, msg: SortInput):
    try:
        # Parse the JSON string containing doctor data
        doctors_data = json.loads(msg.jsonstr)
        
        # Get user location coordinates
        user_lat, user_lon = await get_user_location(ctx, msg.userloc)
        
        ranked_doctors = []
        
        for i, doctor in enumerate(doctors_data):
            # Extract doctor information
            doc_lat = doctor.get('latitude')
            doc_lon = doctor.get('longitude')
            doc_rating = doctor.get('rating')
            doc_name = doctor.get('name', f'Doctor {i+1}') # fallback
            
            # Calculate distance
            distance = calculate_distance(user_lat, user_lon, doc_lat, doc_lon)
            
            # Calculate distance score
            dist_score = calculate_distance_score(distance)
            
            # Calculate final score
            final_score = calculate_final_score(doc_rating, dist_score)
            
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
        ctx.logger.info(f"User location: ({user_lat}, {user_lon})")
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