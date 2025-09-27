from google import genai
from google.genai import types
from uagents import Agent, Context, Model, Protocol
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
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GEMINI_KEY = os.environ.get("GEMINI_KEY")

# Initialize local mailbox agent
agent = Agent(
    name="PDF Processing Agent",
    port=8007,
    mailbox=True,
    publish_agent_details=True
)

class PDFRequest(Model):
    pdf64: str
    prompt: str

class PDFResponse(Model):
    text: str

class ChatPDFRequest(Model):
    pdf64: str
    question: str

# Initialize Gemini client
client = genai.Client(api_key=GEMINI_KEY)



async def process_pdf_with_gemini(pdf_bytes: bytes, prompt: str) -> str:
    """Process PDF with Gemini and return response text"""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=[
                types.Part.from_bytes(
                    data=pdf_bytes,
                    mime_type='application/pdf',
                ),
                prompt
            ]
        )
        return response.text
    except Exception as e:
        return f"Error processing PDF: {str(e)}"

@agent.on_query(model=PDFRequest, replies={PDFResponse})
async def query_handler(ctx: Context, sender: str, qry: PDFRequest):
    """Handle PDF processing query requests"""
    try:
        pdf64 = qry.pdf64
        pdfbytes = base64.b64decode(pdf64)
        prompt = qry.prompt
        
        ctx.logger.info(f"Received PDF processing request from {sender}")
        
        response_text = await process_pdf_with_gemini(pdfbytes, prompt)
        
        await ctx.send(sender, PDFResponse(text=response_text))
        
    except Exception as e:
        ctx.logger.error(f"Error in query handler: {e}")
        await ctx.send(sender, PDFResponse(text=f"Error processing request: {str(e)}"))




if __name__ == "__main__":
    print("Starting PDF Processing Agent...")
    print(f"Agent name: {agent.name}")
    print(f"Agent address: {agent.address}")
    print("Mailbox enabled - agent will be discoverable")
    print("\nCapabilities:")
    print("- PDF document analysis with Gemini AI")
    print("- Interactive chat interface")
    print("- Document verification and validation")
    print("- Text extraction and summarization")
    
    agent.run()