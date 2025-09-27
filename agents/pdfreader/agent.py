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

# Chat protocol setup
chat_proto = Protocol(spec=chat_protocol_spec)

# Session storage for maintaining context
session_data = {}

@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages for interactive PDF processing"""
    ctx.storage.set(str(ctx.session), sender)
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.now(timezone.utc), acknowledged_msg_id=msg.msg_id),
    )

    # Initialize session data if not exists
    session_key = str(ctx.session)
    if session_key not in session_data:
        session_data[session_key] = {
            "pdf_data": None,
            "awaiting_pdf": False,
            "awaiting_question": False
        }

    for item in msg.content:
        if isinstance(item, StartSessionContent):
            ctx.logger.info(f"Got a start session message from {sender}")
            welcome_msg = """
**PDF Processing Agent**

Hello! I can help you analyze and extract information from PDF documents using Google's Gemini AI.

**How to use:**
1. Send me a base64-encoded PDF document
2. Ask me questions about the PDF content
3. I'll analyze the document and provide detailed responses

**Capabilities:**
- Document analysis and summarization
- Text extraction and formatting
- Content verification and validation
- Medical certificate analysis
- Legal document review
- Academic paper analysis

Please send your base64-encoded PDF document to get started!
            """
            await ctx.send(sender, create_text_chat(welcome_msg))
            continue
            
        elif isinstance(item, TextContent):
            user_input = item.text.strip()
            session = session_data[session_key]
            
            ctx.logger.info(f"Got message from {sender}: {user_input[:50]}...")
            
            try:
                # Check if input looks like base64 PDF data
                if user_input.startswith("JVBERi") or (len(user_input) > 100 and user_input.replace('+', '').replace('/', '').replace('=', '').isalnum()):
                    # This looks like base64 data, treat as PDF
                    try:
                        # Validate base64 and PDF
                        pdf_bytes = base64.b64decode(user_input)
                        if pdf_bytes.startswith(b'%PDF'):
                            session["pdf_data"] = user_input
                            session["awaiting_pdf"] = False
                            session["awaiting_question"] = True
                            
                            await ctx.send(sender, create_text_chat(
                                "✅ PDF document received and validated!\n\n"
                                "Now you can ask me questions about the document. For example:\n"
                                "- 'Summarize this document'\n"
                                "- 'Extract the key information'\n"
                                "- 'What is this document about?'\n"
                                "- 'Verify the authenticity of this certificate'\n\n"
                                "What would you like to know about this PDF?"
                            ))
                        else:
                            await ctx.send(sender, create_text_chat(
                                "❌ The data doesn't appear to be a valid PDF. Please send a base64-encoded PDF document."
                            ))
                    except Exception as e:
                        await ctx.send(sender, create_text_chat(
                            f"❌ Error processing the document: {str(e)}\n\n"
                            "Please ensure you're sending a valid base64-encoded PDF."
                        ))
                
                elif session["pdf_data"] and not session["awaiting_pdf"]:
                    # User has uploaded PDF and is now asking a question
                    await ctx.send(sender, create_text_chat("🔄 Processing your request..."))
                    
                    try:
                        pdf_bytes = base64.b64decode(session["pdf_data"])
                        response_text = await process_pdf_with_gemini(pdf_bytes, user_input)
                        
                        formatted_response = f"""
**📄 PDF Analysis Result**

**Your Question:** {user_input}

**Response:**
{response_text}

---
*You can ask more questions about this document or upload a new PDF.*
                        """
                        
                        await ctx.send(sender, create_text_chat(formatted_response))
                        
                    except Exception as e:
                        await ctx.send(sender, create_text_chat(
                            f"❌ Error analyzing the PDF: {str(e)}\n\n"
                            "Please try asking your question again or upload a new PDF."
                        ))
                
                else:
                    # No PDF uploaded yet
                    if "help" in user_input.lower():
                        help_msg = """
**📖 Help - PDF Processing Agent**

**Supported formats:** PDF documents (base64-encoded)

**Example workflow:**
1. Upload PDF: Send base64-encoded PDF data
2. Ask questions: "What is this document about?"
3. Get analysis: Receive detailed AI-powered response

**Sample questions:**
- "Summarize this document"
- "Extract all names and dates"
- "Is this a legitimate medical certificate?"
- "What are the key points in this contract?"
- "Translate this document"

**Tips:**
- Ensure your PDF is properly base64-encoded
- Ask specific questions for better results
- You can ask multiple questions about the same PDF

Ready to analyze your PDF!
                        """
                        await ctx.send(sender, create_text_chat(help_msg))
                    else:
                        await ctx.send(sender, create_text_chat(
                            "📄 Please upload a PDF document first by sending the base64-encoded data.\n\n"
                            "The data should start with 'JVBERi' (PDF magic bytes in base64).\n\n"
                            "Type 'help' for more information."
                        ))
                    
            except Exception as e:
                ctx.logger.error(f"Error processing message: {e}")
                await ctx.send(
                    sender, 
                    create_text_chat("I apologize, but I encountered an error processing your request. Please try again.")
                )
        else:
            ctx.logger.info(f"Got unexpected content from {sender}")

@chat_proto.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle chat acknowledgements"""
    ctx.logger.info(f"Got an acknowledgement from {sender} for {msg.acknowledged_msg_id}")

# Register the chat protocol
agent.include(chat_proto, publish_manifest=True)

# Additional query handler for chat-based PDF requests
@agent.on_query(model=ChatPDFRequest)
async def chat_pdf_query_handler(ctx: Context, sender: str, req: ChatPDFRequest):
    """Handle chat-based PDF processing requests"""
    try:
        ctx.logger.info(f"Received chat PDF request from {sender}")
        
        pdf_bytes = base64.b64decode(req.pdf64)
        response_text = await process_pdf_with_gemini(pdf_bytes, req.question)
        
        # Send response back via chat
        formatted_response = f"""
**PDF Analysis Result**

**Question:** {req.question}

**Response:**
{response_text}
        """
        
        await ctx.send(sender, create_text_chat(formatted_response))
        
    except Exception as e:
        ctx.logger.error(f"Error in chat PDF query handler: {e}")
        await ctx.send(sender, create_text_chat(f"Error processing PDF request: {str(e)}"))

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