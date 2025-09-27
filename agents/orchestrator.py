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

class DoctorRanking(Model):
    doctor_id: int
    name: str
    rating: int
    distance_km: float
    final_score: float

class SortResponse(Model):
    ranked_doctors: list[DoctorRanking]

class SortInput(Model):
    jsonstr: str
    userloc: str  # address


async def rankDoctors(jsonstr, useraddr):
    addr = "agent1qvm3rdn6cj87tg3ad7xkgr7h8xayprpq5r25wha4w4406q5sdpa4w73pzvk"
    response = await send_message(destination=addr, message=SortInput(jsonstr=jsonstr, userloc=useraddr), response_type=SortResponse, sync=True)

    print(response)

async def readpdf(prompt, path):
    pdf_agent_addr = "agent1qfrcy30ygppepluky07c7g247jv9409zaul0kauex29qst8ldz0px3c4try"

    pdf64 = ""
    with open(path, 'rb') as f:
        pdfbytes = f.read()
        pdf64bytes = base64.b64encode(pdfbytes)
        pdf64 = pdf64bytes.decode("utf-8")
        
        
    response = await send_message(destination=pdf_agent_addr, message=PDFRequest(pdf64=pdf64, prompt=prompt), response_type=PDFResponse, sync=True)
    # data = json.loads(response)
    # status = data["verified"]
    print(response.text)
    
async def verifydoc():
    medcall_addr = "agent1q0hyanwj83yldyfm0y34dx78jms4t8pj25g4qs94g4gnzqxhejtwxplqdas"

    pdf64 = ""
    with open("scan0010.pdf", 'rb') as f:
        pdfbytes = f.read()
        pdf64bytes = base64.b64encode(pdfbytes)
        pdf64 = pdf64bytes.decode("utf-8")

    response = await send_message(destination=medcall_addr, message=VerRequest(pdf64=pdf64), response_type=VerResponse, sync=True)
    
    print(response)

async def submitreport(history, symptoms, diagnosis, solution, side_effects):
    medcall_addr = "agent1q2n5cnulcr0pa4vtan9ax2edvm7wt9x42xkmgx339h9277t7laj0q98z78x"

    response = await send_message(destination=medcall_addr, message=ReportUpload(history=history, symptoms=symptoms, diagnosis=diagnosis, solution=solution, side_effects=side_effects), sync=False)
    # try with none also
    # also try with existing
    
    print(response)

async def ratingcall(text):                       
    addr = "agent1qvm3rdn6cj87tg3ad7xkgr7h8xayprpq5r25wha4w4406q5sdpa4w73pzvk"
    response = await send_message(destination=addr, message=RatingRequest(text=text), response_type=RatingResponse,sync=True)
    print(response)



# asyncio.run(submitreport())


