from sqlalchemy import UUID, Column
from .database import Base
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

from pydantic import BaseModel


class ChunkBase(BaseModel):
    note_id: UUID
    user_id: UUID
    text: str
    embedding: Vector


class Chunk(ChunkBase):
    class Config:
        orm_mode = True
