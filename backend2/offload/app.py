from dotenv import load_dotenv
from fastapi.routing import APIRoute

load_dotenv()

from fastapi import Depends, FastAPI
from pydantic import BaseModel
from uuid import UUID
import openai

import os
from supabase import create_client, Client  # type: ignore
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import MarkdownTextSplitter
from langchain.embeddings import OpenAIEmbeddings

from sqlalchemy.orm import Session
from database import SessionLocal
from query import (
    create_chunk,
    delete_embeddings,
    query_notes,
    get_similar_chunks,
    ask_llm,
)
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware


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
    data = supabase.auth.sign_in_with_oauth(
        {"provider": "google", "options": {}},
    )


class EmbeddingsRequest(BaseModel):
    note_id: UUID
    content: str


@app.post("/create_embeddings/", tags=["embeddings"])
def create_embeddings(request: EmbeddingsRequest, db: Session = Depends(get_db)):
    splitter = MarkdownTextSplitter(
        chunk_size=400,
        chunk_overlap=30,
    )
    chunks = splitter.split_text(request.content)

    embeddings_model = OpenAIEmbeddings(client=None)
    embeddings = embeddings_model.embed_documents(chunks)

    user_id = "6abb95b4-0a41-47ed-8579-c7777aab5673"
    note_id = str(request.note_id)
    delete_embeddings(db, note_id)
    for text, embedding in zip(chunks, embeddings):
        create_chunk(db, note_id, user_id, text, embedding)


class SearchNotesResponse(BaseModel):
    note_ids: list[str]


@app.get("/search_notes/", tags=["search"], response_model=SearchNotesResponse)
def search_notes(
    query: str = Query(..., min_length=3, max_length=200),
    db: Session = Depends(get_db),
):
    note_ids = query_notes(db, query)
    return SearchNotesResponse(note_ids=note_ids)


@app.get("/ask/", tags=["ask"])
def ask(
    query: str = Query(..., min_length=3, max_length=200),
    db: Session = Depends(get_db),
):
    ans = ask_llm(db, query)
    return {"answer": ans}
