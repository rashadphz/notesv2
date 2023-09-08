from abc import abstractmethod
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
import models
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.schema import BaseRetriever
from typing import List
from langchain.docstore.document import Document
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI


class OffloadRetriever(BaseRetriever):
    def __init__(self, db: Session):
        self.db = db

    def get_relevant_documents(self, query: str) -> List[Document]:
        embeddings_model = OpenAIEmbeddings(client=None)
        embeddings = embeddings_model.embed_query(query)
        neighbors = self.db.scalars(
            select(models.Chunk)
            .order_by(models.Chunk.embedding.cosine_distance(embeddings))
            .limit(4)
        ).all()

        return [
            Document(
                page_content=str(chunk.text),
                metadata={
                    "source": chunk.note_id,
                },
            )
            for chunk in neighbors
        ]

    async def aget_relevant_documents(self, query: str) -> List[Document]:
        return self.get_relevant_documents(query)


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
        .limit(4)
    ).all()

    ids = set(str(n.note_id) for n in neighbors)
    return list(ids)


def get_similar_chunks(db: Session, query: str) -> list[models.Chunk]:
    from langchain.embeddings import OpenAIEmbeddings

    retriever = OffloadRetriever(db=db)
    rel = retriever.get_relevant_documents(query)
    print(rel)
    return []

def ask_llm(
    db: Session,
    query: str,
):
    llm = ChatOpenAI(client=None, model_name="gpt-3.5-turbo", temperature=0)
    chain = RetrievalQAWithSourcesChain.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=OffloadRetriever(db=db),
    )
    ans = chain({"question": query})
    return ans

