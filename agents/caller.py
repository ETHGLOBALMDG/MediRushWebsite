from uagents.communication import send_message
from uagents import Model
import json
import asyncio
import base64

class ReportUpload(Model):
    history: str
    symptoms: str
    diagnosis: str
    solution: str
    side_effects: str

class PDFRequest(Model):
    pdf64: str
    prompt: str
    
class PDFResponse(Model):
    text: str

class VerRequest(Model):
    pdf64: str

class VerResponse(Model):
    verified: bool
    confidence: float

class RatingRequest(Model):
    text: str

class RatingResponse(Model):
    deltarating: float


async def readpdf():
    pdf_agent_addr = "agent1qgzcsqmx5e5jghfjklzzdwfg55ztexpq2336d7u04cwvwhmh5et0y6u3wrc"

    pdf64 = ""
    with open("./pdfreader/test.pdf", 'rb') as f:
        pdfbytes = f.read()
        pdf64bytes = base64.b64encode(pdfbytes)
        pdf64 = pdf64bytes.decode("utf-8")
        
        
    response = await send_message(destination=pdf_agent_addr, message=PDFRequest(pdf64=pdf64, prompt="read the text and tell me"), response_type=PDFResponse, sync=True)
    # data = json.loads(response)
    # status = data["verified"]
    print(response.text)
    
async def verifydoc():
    medcall_addr = "agent1qf076x9q8cxwup6vackjmhk7jwpfv2jexn2xmu5quf9gw23n837hyh0qmm8"

    pdf64 = ""
    with open("scan0010.pdf", 'rb') as f:
        pdfbytes = f.read()
        pdf64bytes = base64.b64encode(pdfbytes)
        pdf64 = pdf64bytes.decode("utf-8")

    response = await send_message(destination=medcall_addr, message=VerRequest(pdf64=pdf64), response_type=VerResponse, sync=True)
    
    print(response)

async def submitreport():
    medcall_addr = "agent1q2n5cnulcr0pa4vtan9ax2edvm7wt9x42xkmgx339h9277t7laj0q98z78x"

    response = await send_message(destination=medcall_addr, message=ReportUpload(history="Diabetes", symptoms="Fever", diagnosis="Viral", solution="Paracetamol", side_effects="Sleepiness"), sync=False)
    # try with none also
    # also try with existing
    
    print(response)

async def ratingcall():                       
    addr = "agent1qd4fvs285kyysaet3cr8c6pewvfcamd5mqx8fdd6smj58vwsht0ucyqjfys"
    response = await send_message(destination=addr, message=RatingRequest(text="I love this doctor so much"), response_type=RatingResponse,sync=True)
    print(response)



asyncio.run(submitreport())


