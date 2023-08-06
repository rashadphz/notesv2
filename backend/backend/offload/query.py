from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
import models


def create_chunk(
    db: Session, note_id: str, user_id: str, text: str, embedding: list[float]
):
    db_chunk = models.Chunk(
        note_id=note_id,
        user_id=user_id,
        text=text,
        embedding=embedding,
    )
    db.add(db_chunk)
    db.commit()
    db.refresh(db_chunk)
    return db_chunk


def delete_embeddings(db: Session, note_id: str):
    db.query(models.Chunk).filter(models.Chunk.note_id == note_id).delete()
    db.commit()


def query_notes(db: Session, query: str) -> list[str]:
    from langchain.embeddings import OpenAIEmbeddings

    embeddings_model = OpenAIEmbeddings(client=None)
    embeddings = embeddings_model.embed_query(query)

    neighbors = db.scalars(
        select(models.Chunk)
        .order_by(models.Chunk.embedding.cosine_distance(embeddings))
        .limit(5)
    ).all()

    ids = set(str(n.note_id) for n in neighbors)
    return list(ids)
