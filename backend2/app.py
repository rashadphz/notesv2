from dotenv import load_dotenv
from fastapi.routing import APIRoute

load_dotenv()

from fastapi import Depends, FastAPI
from pydantic import BaseModel
from uuid import UUID
import openai

import os
from supabase import create_client, Client  # type: ignore

from sqlalchemy.orm import Session
from database import SessionLocal
from query import (
    ask_llm,
)
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware

from service import EmbeddingService, SearchService, ChatService

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")
supabase: Client = create_client(url, key)
openai.api_key = os.environ.get("OPENAI_API_KEY", "")


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id,
    servers=[{"url": "http://127.0.0.1:8000", "description": "Local dev server"}],
)
origins = [
    "http://localhost:3000",
    "http://localhost:1420",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/auth/google", tags=["auth"])
async def google_auth():
    supabase.auth.sign_in_with_oauth(
        {"provider": "google", "options": {}},
    )


class EmbeddingsRequest(BaseModel):
    note_id: UUID
    content: str


@app.post("/create_embeddings/", tags=["embeddings"])
def create_embeddings(request: EmbeddingsRequest, db: Session = Depends(get_db)):
    EmbeddingService(db).create_embeddings_for_note(
        note_id=request.note_id,
        content=request.content,
    )


class SearchNotesResponse(BaseModel):
    note_ids: list[str]


@app.get("/search_notes/", tags=["search"], response_model=SearchNotesResponse)
def search_notes(
    query: str = Query(..., min_length=3, max_length=200),
    db: Session = Depends(get_db),
):
    note_ids = SearchService(db).smart_search_notes(query)
    return SearchNotesResponse(note_ids=note_ids)
    # note_ids = query_notes(db, query)
    # return SearchNotesResponse(note_ids=note_ids)


class AskNotesResponse(BaseModel):
    question: str
    answer: str
    sources: str | None


@app.get("/ask/", tags=["ask"], response_model=AskNotesResponse)
def ask(
    query: str = Query(..., min_length=3, max_length=200),
    db: Session = Depends(get_db),
):
    return ChatService(db).ask_notes(query)
    ans = ask_llm(db, query)
    return ans
