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
    pdf_agent_addr = "agent1qgzcsqmx5e5jghfjklzzdwfg55ztexpq2336d7u04cwvwhmh5et0y6u3wrc"      

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

# Chat protocol for interactive verification
chat_proto = Protocol(spec=chat_protocol_spec)

@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages for interactive verification"""
    ctx.storage.set(str(ctx.session), sender)
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.now(timezone.utc), acknowledged_msg_id=msg.msg_id),
    )

    for item in msg.content:
        if isinstance(item, StartSessionContent):
            ctx.logger.info(f"Got a start session message from {sender}")
            welcome_msg = """
**Document Verification Agent**

Hello! I can help you verify medical registration certificates. 

To use this service:
1. Send me a base64-encoded PDF of a medical certificate
2. I will analyze the document for authenticity
3. Verify the registration with Indian medical councils
4. Provide a verification result with confidence score

Please send your base64-encoded PDF document.
            """
            await ctx.send(sender, create_text_chat(welcome_msg))
            continue
            
        elif isinstance(item, TextContent):
            user_input = item.text.strip()
            ctx.logger.info(f"Got verification request from {sender}")
            
            try:
                # Check if input looks like base64 PDF data
                if user_input.startswith("JVBERi"):  # PDF magic bytes in base64
                    # Process as PDF verification
                    result = await process_verification(user_input)
                    
                    status = "✅ VERIFIED" if result.verified else "❌ NOT VERIFIED"
                    confidence_pct = result.confidence * 100
                    
                    response_text = f"""
**Document Verification Result**

**Status:** {status}
**Confidence Score:** {confidence_pct:.1f}%

**Analysis:**
- Document authenticity assessed using AI forensic analysis
- Registration verified against Indian medical council databases
- Confidence score based on document quality and verification results

{'✅ This appears to be a legitimate medical certificate.' if result.verified else '⚠️ This document could not be verified or appears suspicious.'}
                    """
                    
                    await ctx.send(sender, create_text_chat(response_text))
                    
                else:
                    await ctx.send(sender, create_text_chat(
                        "Please send a valid base64-encoded PDF document for verification. "
                        "The input should start with PDF magic bytes (JVBERi in base64)."
                    ))
                    
            except Exception as e:
                ctx.logger.error(f"Error processing verification: {e}")
                await ctx.send(
                    sender, 
                    create_text_chat("I apologize, but I encountered an error processing your document. Please try again with a valid base64-encoded PDF.")
                )
        else:
            ctx.logger.info(f"Got unexpected content from {sender}")

@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle chat acknowledgements"""
    ctx.logger.info(f"Got an acknowledgement from {sender} for {msg.acknowledged_msg_id}")

# Register the chat protocol
agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print("Starting Document Verification Agent...")
    print(f"Agent name: {agent.name}")
    print(f"Agent address: {agent.address}")
    print("Mailbox enabled - agent will be discoverable")
    
    agent.run()