"""FastAPI backend proxy for Zone AI Chatbot."""

from __future__ import annotations

import os
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

ROOT_DIR = BASE_DIR.parent.parent.parent.parent
load_dotenv(ROOT_DIR / ".env")

app = FastAPI(title="Zone AI Proxy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = "gemini-2.0-flash"
    custom_api_key: Optional[str] = None

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "Zone AI Proxy"}

@app.post("/api/chat")
async def chat_proxy(payload: ChatRequest) -> dict:
    api_key = payload.custom_api_key or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="No API Key configured on server and no key provided in request settings."
        )

    user_prompt = payload.messages[-1].content if payload.messages else ""

    try:
        if "gemini" in (payload.model or "").lower() or api_key.startswith("AIza"):
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    url,
                    json={"contents": [{"parts": [{"text": user_prompt}]}]}
                )
                resp.raise_for_status()
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {"reply": text}

        url = "https://api.openai.com/v1/chat/completions"
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                url,
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": m.role, "content": m.content} for m in payload.messages]
                },
                headers={"Authorization": f"Bearer {api_key}"}
            )
            resp.raise_for_status()
            data = resp.json()
            text = data["choices"][0]["message"]["content"]
            return {"reply": text}

    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=f"API Error: {exc.response.text}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(exc)}")