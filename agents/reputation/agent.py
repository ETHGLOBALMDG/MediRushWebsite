from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.agents import initialize_agent, AgentType
from uagents import Model, Context, Agent, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    StartSessionContent,
    TextContent,
    chat_protocol_spec,
)
from datetime import datetime, timezone
from uuid import uuid4
# from typing import Any, Dict
# import json
import os
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

GEMINI_KEY = os.environ.get("GEMINI_KEY")

# Initialize agent
agent = Agent(name="Doctor Reputation Agent", port=8001, mailbox=True, publish_agent_details=True)

# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GEMINI_KEY,
    temperature=0.7
)

# Define request/response models
class RatingRequest(Model):
    text: str

class RatingResponse(Model):
    deltarating: float

def extract_rating_from_text(text: str) -> float:
    """
    Process text input and return a floating point rating.
    Uses Gemini LLM to analyze the text and extract/generate a numerical rating.
    """
    try:
        # Create a prompt for the LLM to analyze the text and return a rating
        rating_prompt = f"""
        Analyze the following text, which is a review for a doctor by a patient, and provide a numerical rating between 0.0 and 10.0 based on the content.
        Consider factors like sentiment, satisfaction, outcome, side effects, relevance, or any other appropriate metrics.
        
        Text to analyze: "{text}"
        
        Please respond with ONLY a single int point number between 0 and 50, nothing else.
        """
        
        # Get response from Gemini
        response = llm.invoke(rating_prompt)
        response_text = response.content.strip()
        
        # Extract floating point number from response
        # Look for patterns like 7.5, 8.0, 9.2, etc.
        rating_match = re.search(r'\b(\d+\.?\d*)\b', response_text)
        
        if rating_match:
            rating = float(rating_match.group(1))
            # Ensure rating is within bounds
            rating = max(0.0, min(50.0, rating))
            return rating
        else:
            # Fallback: analyze text length and basic sentiment
            return None
            
    except Exception as e:
        print(f"Error processing text with LLM: {e}")
        return None


# Protocol setup
chat_proto = Protocol(spec=chat_protocol_spec)

@agent.on_query(model=RatingRequest, replies={RatingResponse})
async def rating_query_handler(ctx: Context, sender: str, req: RatingRequest):
    """Handle rating requests - takes string input and returns float rating."""
    try:
        ctx.logger.info(f"Received rating request from {sender}: {req.text}")
        
        # Process the text and get rating
        rating = extract_rating_from_text(req.text)
        
        ctx.logger.info(f"Generated rating: {rating}")
        
        # Send back the rating
        # subtract 5 - so that rating can both increase and decrease.
        await ctx.send(sender, RatingResponse(deltarating=rating-25))
        
    except Exception as e:
        ctx.logger.error(f"Error processing rating request: {e}")
        # Send back a default neutral rating on error
        await ctx.send(sender, RatingResponse(rating=25))


# Standalone function for direct usage
def rate_text(text: str) -> float:
    """
    Standalone function to rate text and return a float.
    Can be used independently without the agent framework.
    """
    return extract_rating_from_text(text)

if __name__ == "__main__":
    # Example usage
    agent.run()