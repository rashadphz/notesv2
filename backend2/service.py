from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from langchain.text_splitter import MarkdownTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.schema import BaseRetriever
from langchain.docstore.document import Document
from langchain.chains import RetrievalQAWithSourcesChain

import models


class DBSessionMixin:
    def __init__(self, db: Session):
        self.db = db


class AppService(DBSessionMixin):
    pass


class AppRepo(DBSessionMixin):
    pass


class EmbeddingService(DBSessionMixin):
    def embed_query(self, query: str) -> list[float]:
        pass

    def create_embeddings_for_note(self, note_id: str, content: str) -> None:
        user_id = "6abb95b4-0a41-47ed-8579-c7777aab5673"

        splitter = MarkdownTextSplitter(
            chunk_size=512,
            chunk_overlap=32,
        )
        texts = splitter.split_text(content)

        embeddings_model = OpenAIEmbeddings(client=None)
        embeddings = embeddings_model.embed_documents(texts)

        EmbeddingRepo(self.db).delete_note_embeddings(note_id)
        EmbeddingRepo(self.db).create_chunks(note_id, user_id, texts, embeddings)


class SearchService(DBSessionMixin):
    def smart_search_notes(self, query: str) -> list[UUID]:
        from langchain.embeddings import OpenAIEmbeddings

        embeddings_model = OpenAIEmbeddings(client=None)
        embeddings = embeddings_model.embed_query(query)
        neighbors = EmbeddingRepo(self.db).find_neighbors(embeddings)
        neighbor_ids = list(set([neighbor.id for neighbor in neighbors]))
        return neighbor_ids


class ChatService(DBSessionMixin):
    class Retriever(DBSessionMixin, BaseRetriever):
        def get_relevant_documents(self, query: str) -> list[Document]:
            vector = OpenAIEmbeddings(client=None).embed_query(query)
            chunks = EmbeddingRepo(self.db).find_neighbors(vector)
            return [
                Document(
                    page_content=str(chunk.text),
                    metadata={
                        "source": chunk.note_id,
                    },
                )
                for chunk in chunks
            ]

        async def aget_relevant_documents(self, query: str) -> list[Document]:
            return self.get_relevant_documents(query)

    def ask_notes(self, question: str):
        llm = ChatOpenAI(client=None, model_name="gpt-3.5-turbo", temperature=0)
        chain = RetrievalQAWithSourcesChain.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.Retriever(self.db),
        )
        ans = chain({"question": question})
        return ans


class EmbeddingRepo(DBSessionMixin):
    def find_neighbors(self, vector: list[float]) -> list[models.Chunk]:
        neighbors = self.db.scalars(
            select(models.Chunk)
            .order_by(models.Chunk.embedding.cosine_distance(vector))
            .limit(4)
        ).all()
        return neighbors

    def create_chunks(
        self,
        note_id: str,
        user_id: str,
        texts: list[str],
        embeddings: list[list[float]],
    ):
        assert len(texts) == len(embeddings)
        db_chunks = [
            models.Chunk(
                note_id=note_id,
                user_id=user_id,
                text=text,
                embedding=embedding,
            )
            for text, embedding in zip(texts, embeddings)
        ]

        self.db.add_all(db_chunks)
        self.db.commit()

    def create_chunk(
        self, note_id: str, user_id: str, text: str, embedding: list[float]
    ) -> models.Chunk:
        db_chunk = models.Chunk(
            note_id=note_id,
            user_id=user_id,
            text=text,
            embedding=embedding,
        )
        self.db.add(db_chunk)
        self.db.commit()
        self.db.refresh(db_chunk)

        return db_chunk

    def delete_note_embeddings(self, note_id: str):
        self.db.query(models.Chunk).filter(models.Chunk.note_id == note_id).delete()
        self.db.commit()
