# only chat model.
# when user asks a question, we ask the model to answer 

from uagents import Agent, Context, Protocol
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
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

from metta.rag import MedicalRAG
from hyperon import MeTTa

# Load environment variables
load_dotenv()

GEMINI_KEY = os.environ.get("GEMINI_KEY")

# Initialize agent for Agentverse deployment
agent = Agent(
    name="Doctor's assistant",
    seed=os.environ.get("SEED_PHRASE_2"), 
    mailbox=True,
    port=8009
)

# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GEMINI_KEY,
    temperature=0.2
)

chat_histories = {}
MAX_HISTORY_LENGTH = 20  # Maximum number of previous messages to keep

def create_text_chat(text: str, end_session: bool = False) -> ChatMessage:
    """Create a text chat message."""
    content = [TextContent(type="text", text=text)]
    if end_session:
        content.append(EndSessionContent(type="end-session"))
    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=content,
    )

def get_chat_history(session_id: str) -> list:
    """Get chat history for a session."""
    if session_id not in chat_histories:
        chat_histories[session_id] = []
    return chat_histories[session_id]

def add_to_chat_history(session_id: str, user_message: str, bot_response: str):
    """Add a conversation turn to chat history."""
    history = get_chat_history(session_id)
    
    history.append({
        "timestamp": datetime.now().isoformat(),
        "user": user_message,
        "bot": bot_response
    })
    
    # Keep only the last MAX_HISTORY_LENGTH messages
    if len(history) > MAX_HISTORY_LENGTH:
        history = history[-MAX_HISTORY_LENGTH:]
    
    chat_histories[session_id] = history

def format_chat_history(history: list) -> str:
    """Format chat history for LLM context."""
    if not history:
        return "No previous conversation history."
    
    formatted = "Previous conversation:\n"
    for item in history[-5:]:  # Use last 5 exchanges for context(''
        print('hi1')
        formatted += f"User: {item['user']}\n"
        print('hi2')
        formatted += f"Assistant: {item['bot']}\n\n"
    
    return formatted

def classify_query(query: str, history: list) -> dict:
    """Use Gemini LLM to classify query as technical (medical) or non-technical."""
    print(history)
    history_context = format_chat_history(history)
    
    classification_prompt = f"""
You are a query classification expert. Analyze the following user query and classify it as either "technical" (medical/health-related) or "non_technical" (general conversation, non-medical topics).

Context from previous conversation:
{history_context}

Current user query: "{query}"

Classification criteria:
- **technical (medical)**: Questions about health, medical conditions, symptoms, treatments, medications, diagnoses, medical procedures, anatomy, diseases, mental health, nutrition related to health conditions, medical advice, etc.
- **non_technical**: General conversation, greetings, personal questions (non-health), technology, entertainment, education, weather, current events, hobbies, etc.

Important: Be precise in your classification. Health and medical topics should ALWAYS be classified as "technical".

Respond with ONLY ONE WORD - either "TECHNICAL" or "NON-TECHNICAL"
"""

    response = llm.invoke(classification_prompt)
    return response.content.strip()
        
        
def generate_non_technical_response(query: str, history: list) -> str:
    """Generate response for non-technical queries using Gemini."""
    
    history_context = format_chat_history(history)
    
    chat_prompt = f"""
You are a helpful, friendly, and knowledgeable AI assistant. Respond to the user's query in a conversational and helpful manner.

Context from previous conversation:
{history_context}

Current user query: "{query}"

Instructions:
- Be conversational, helpful, and engaging
- Use the conversation history to maintain context
- Don't try to provide any extra information from yourself that is not explicitly mentioned in the context
- Keep responses concise but informative
- Be friendly and approachable in tone
- If you don't know something, admit it honestly

Generate a helpful response to the user's query:
"""

    try:
        response = llm.invoke(chat_prompt)
        return response.content.strip()
    except Exception as e:
        return "I apologize, but I'm having trouble processing your request right now. Could you please try again?"

def generate_technical_response(query: str, history: list) -> str:
    """Generate response for technical (medical) queries using custom logic."""
        
    metta = MeTTa()
    rag = MedicalRAG(metta)

    # first need to identify intention

    prompt = f"""
You are a medical intent classifier and keyword extractor. Analyze the user's medical query to identify their primary intent and extract relevant keywords.

User Query: "{query}"

Classification Options:
- **symptoms**: Patient describes symptoms and seeks diagnosis or understanding of what condition they might have
- **treatment**: Patient knows their condition/disease and wants treatment options, medications, or therapeutic approaches  
- **side_effects**: Patient knows about a specific treatment/medication and wants to understand its adverse effects or complications

Intent Classification Rules:
- Focus on the PRIMARY intent, not secondary concerns
- If symptoms are described without known diagnosis → "symptoms"
- If condition is known and seeking remedies/therapy → "treatment"  
- If medication/treatment is mentioned and asking about risks/reactions → "side_effects"

Keyword Extraction Rules:
- **For symptoms intent**: Extract symptom names (fever, cough, headache, pain, nausea, etc.)
- **For treatment intent**: Extract condition/disease names and treatment types (diabetes, hypertension, surgery, therapy, etc.)
- **For side_effects intent**: Extract medication/treatment names (aspirin, chemotherapy, ibuprofen, etc.)
- Use medical terminology when possible
- Connect multiple keywords with "+"
- Use underscore "_" for multi-word terms (chest_pain, high_blood_pressure)

Response Format: 
[INTENT]|[KEYWORDS]

Example: symptoms|fever+cough+chest_pain
"""

    resp = llm.invoke(prompt)
    return resp.content.strip() # yahi pe pura response return krdio

# Chat protocol setup
chat_proto = Protocol(spec=chat_protocol_spec)

user_history_context = {} # map of user id against string

@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages with query classification."""
    ctx.storage.set(str(ctx.session), sender)
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.now(timezone.utc), acknowledged_msg_id=msg.msg_id),
    )

    session_id = str(ctx.session)
    
    for item in msg.content:
        if isinstance(item, StartSessionContent):
            print(f"Got a start session message from {sender}")
            print(msg.content)
            await ctx.send(sender, create_text_chat("welcome_msg"))
            continue
            
        elif isinstance(item, TextContent):
            user_query = item.text.strip()
            ctx.logger.info(f"Processing query from {sender}")
            
            try:
                classification = classify_query(user_query, history)
                print(classification)              
                if classification["classification"] == "technical":
                    bot_response = generate_technical_response(user_query, ["context"])

                else:
                    # Use LLM for non-technical queries
                    bot_response = generate_non_technical_response(user_query, ["context"])
                
                # Add to chat history
                add_to_chat_history(session_id, user_query, bot_response)
                
                await ctx.send(sender, create_text_chat(bot_response))
                
            except Exception as e:
                ctx.logger.error(f"Error processing message: {e}")
                error_response = """I apologize, but I encountered an error processing your query. """
                await ctx.send(sender, create_text_chat(error_response))
        else:
            ctx.logger.info(f"Got unexpected content from {sender}")

@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle chat acknowledgements."""
    ctx.logger.info(f"Got an acknowledgement from {sender} for {msg.acknowledged_msg_id}")

# Register the chat protocol
agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":    
    agent.run()