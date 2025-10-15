from idlelib.autocomplete import TRY_A
from tkinter.constants import RAISED
import numpy as np
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from kokoro import KPipeline
import soundfile as sf
import uuid
import logging
import os
import time
from fastapi.middleware.cors import CORSMiddleware





##################logging##################
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S %p",
    handlers=[
        logging.FileHandler("logs/app.log"),  # log file
        logging.StreamHandler()  # console
    ])

logger = logging.getLogger("kokoro_api")

##################temporary output##################
#TODO: 1. les prompts dans une base MongoDB, 2. les audios dans un bucket s3

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

MAX_TEXT_LENGTH = 500  # control text duration/length
AUDIO_RATE = 24000

logger.info('Loading Kokoro...')

logger.info('Kokoro loaded successfully.')


##################API##################
app = FastAPI(
    title="Kokoro API",
    description="Text-to-Speech API powered by Kokoro v0.19",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
##################MODELS##################

class TTSRequest(BaseModel):
    text: str
    language: str = 'a'
    voice: str = "af_heart"

class TTSResponse(BaseModel):
    status: str
    audio_url: str | None = None
    message: str | None = None

##################ROUTES##################
@app.post("/tts", response_model=TTSResponse)
async def tts(rq: TTSRequest, request: Request):
    start_time = time.time()
    logger.info(f"Received text for synthesis (voice = {rq.voice}):{rq.text[:60]}...")

    if not rq.text.strip():
        raise HTTPException(status_code=400, detail="No text provided.")
    if len(rq.text) > MAX_TEXT_LENGTH:
        raise HTTPException(status_code=400, detail=f"Text too long. Max length is {MAX_TEXT_LENGTH} characters.")
    logger.info(f"Text successfully retrieved.")

    try:
        #Let's generate an audio
        filename = f"{uuid.uuid4().hex}.wav"
        filepath = os.path.join(OUTPUT_DIR, filename)
        pipeline = KPipeline(lang_code=f"{rq.language}")
        generator = pipeline(rq.text, voice=rq.voice)

        for _,_,audio in generator:
            sf.write(filepath, audio, AUDIO_RATE)

        #URL
        base_url= str(request.base_url).rstrip("/")
        audio_url = f"{base_url}/audio/{filename}"

        elapsed_time = time.time() - start_time
        logger.info(f"Audio URL successfully retrieve in {elapsed_time:.2f} seconds.")
        return TTSResponse(status="success", audio_url=audio_url)
    except Exception as e:
        logger.exception("Error occured during tts.")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

@app.get("/audio/{filename}", response_model=TTSResponse)
async def serve_audio(filename: str):
    filepath = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(filepath, media_type="audio/wav", filename=filename)

@app.get("/")
async def root():
    return {"message": "Kokoro TTS API is running!"}
