# Local mailbox agent for document verification

from uagents import Agent, Context, Model, Protocol
from uagents.communication import send_message
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    StartSessionContent,
    TextContent,
    chat_protocol_spec,
)
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, AgentType
from indian import verify
from datetime import datetime, timezone
from uuid import uuid4
import os
import json
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GEMINI_KEY = os.environ.get("GEMINI_KEY")

# Initialize local mailbox agent
agent = Agent(
    name="Document Verification Agent", 
    port=8006, 
    mailbox=True, 
    publish_agent_details=True
)

class VerRequest(Model):
    pdf64: str

class VerResponse(Model):
    verified: bool
    confidence: float
    
class PDFRequest(Model):
    pdf64: str
    prompt: str
    
class PDFResponse(Model):
    text: str

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

async def callPDFagentLeg(pdf64):
    """Call PDF processing agent for document analysis"""
    pdf_agent_addr = "agent1qfrcy30ygppepluky07c7g247jv9409zaul0kauex29qst8ldz0px3c4try"      

    prompt = """
You are a document authenticity expert analyzing a medical registration certificate. Conduct a comprehensive forensic analysis to assess document legitimacy using the following criteria: 

Visual Authentication Elements:
- Official seals: Quality, alignment, clarity, and consistency with known standards
- Signatures: Authenticity markers, consistency, pressure variations, ink flow
- Watermarks or security features: Presence and quality of anti-forgery elements
- Official letterheads and logos: Resolution, positioning, color accuracy

Document Integrity Analysis:
- Text formatting consistency: Font types, sizes, spacing, alignment throughout
- Image quality and resolution uniformity across all elements
- Color consistency and printing quality
- Evidence of digital manipulation, overwriting, or alterations
- Layer analysis for potential composite elements

Content Verification:
- Formatting consistency with standard medical certificates from the issuing authority
- Proper use of official terminology and language
- Logical sequence of information and dates
- Consistency of registration numbers, dates, and personal details
- Adherence to regional regulatory document standards

Technical Assessment:
- PDF metadata analysis for creation/modification timestamps
- Compression artifacts that might indicate image manipulation
- Text rendering quality (OCR vs. native text)
- Document structure and layer composition

Scoring Guidelines:
0.90-1.00: Highly authentic with all security features intact  
0.70-0.89: Likely authentic with minor quality issues  
0.45-0.69: Questionable authenticity with notable concerns  
0.30-0.45: Likely fraudulent with significant red flags  
0.00-0.29: Highly suspicious or clearly fraudulent  

Based on your comprehensive analysis, extract the doctor's name, the doctor's registration number with the medical council (string; if not found, return "NULL"), and calculate a legitimacy score from 0.00 to 1.00 (two decimal places).  

Return the result strictly in the following JSON format only, with no additional text or commentary:  

{
  "name": "<doctor_name>",
  "registration_number": "<medical_council_registration_number or NULL>",
  "legitimacy_score": "<score>"
}
"""

    try:
        response = await send_message(
            destination=pdf_agent_addr, 
            message=PDFRequest(pdf64=pdf64, prompt=prompt), 
            response_type=PDFResponse, 
            sync=True
        )
        reply = json.loads(response.text)
        return reply
        
    except Exception as e:
        print(f"Error calling PDF agent: {e}")
        return {
            "name": "Unknown",
            "registration_number": "NULL", 
            "legitimacy_score": "0.00"
        }
    
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    google_api_key=GEMINI_KEY,
    temperature=0.7
)

async def process_verification(pdf64: str) -> VerResponse:
    """Process document verification and return response"""
    try:
        # Get document legitimacy analysis
        reply = await callPDFagentLeg(pdf64)
        
        # Check if registration number was found
        if reply["registration_number"] == "NULL":
            return VerResponse(verified=False, confidence=0.0)

        # Verify registration with Indian medical council
        res = verify(reply["registration_number"], reply["name"])
        if len(res) == 0:
            return VerResponse(verified=False, confidence=0.0)
        else:
            legitimacy_score = float(reply["legitimacy_score"])
            if legitimacy_score <= 0.5:
                return VerResponse(verified=False, confidence=legitimacy_score)
            else:
                return VerResponse(verified=True, confidence=legitimacy_score)
            
    except Exception as e:
        print(f"Error in verification process: {e}")
        return VerResponse(verified=False, confidence=0.0)
    
@agent.on_query(model=VerRequest, replies={VerResponse})
async def query_handler(ctx: Context, sender: str, msg: VerRequest):
    """Handle verification query requests"""
    try:
        ctx.logger.info(f"Received verification request from {sender}")
        
        pdf64 = msg.pdf64
        result = await process_verification(pdf64)
        
        ctx.logger.info(f"Verification result: verified={result.verified}, confidence={result.confidence}")
        
        await ctx.send(sender, result)
        
    except Exception as e:
        ctx.logger.error(f"Error processing verification request: {e}")
        await ctx.send(sender, VerResponse(verified=False, confidence=0.0))


if __name__ == "__main__":
   
    agent.run()