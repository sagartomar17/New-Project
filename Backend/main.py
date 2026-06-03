from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from pydantic import BaseModel
from datetime import datetime
import uuid
from fastapi import UploadFile, File
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running"}

@app.get("/requests")
def get_requests():
    with open("requests.json", "r") as f:
        data = json.load(f)

    return data

class ExtractionRequest(BaseModel):
    requestId: str
    manifestFile: str
    requestedBy: str


@app.get("/api/extractions")
def get_extractions():

    with open("requests.json", "r") as f:
        data = json.load(f)

    return data


@app.get("/api/request-id")
def generate_request_id():

    request_id = f"MAE-2026-{str(uuid.uuid4().int)[:4]}"

    return {
        "requestId": request_id
    }


@app.post("/api/extractions")
def create_extraction(payload: ExtractionRequest):

    with open("requests.json", "r") as f:
        data = json.load(f)

    new_record = {
        "requestId": payload.requestId,
        "manifestFile": payload.manifestFile,
        "requestedBy": payload.requestedBy,
        "status": "Pending",
        "createdDate": datetime.now().isoformat()
    }

    data.insert(0, new_record)

    with open("requests.json", "w") as f:
        json.dump(data, f, indent=2)

    return {
        "success": True,
        "data": new_record
    }


@app.post("/api/upload/{request_id}")
async def upload_pdf(
    request_id: str,
    file: UploadFile = File(...)
):

    # uploads folder create kar dega agar exist nahi karta
    os.makedirs("uploads", exist_ok=True)

    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return {
        "success": True,
        "message": "PDF uploaded successfully",
        "requestId": request_id,
        "fileName": file.filename
    }