import uuid
from sqlalchemy import UUID, Column, String
from database import Base
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey


class Profile(Base):
    __tablename__ = "profiles"

    # references auth.user table (supabase)
    id = Column(UUID(as_uuid=True), primary_key=True, index=True)


class Chunk(Base):
    __tablename__ = "chunks"

    chunk_id = Column(
        UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
    )
    note_id = Column(UUID(as_uuid=True), index=True)
    user_id = Column(UUID, ForeignKey("profiles.id"))
    embedding = mapped_column(Vector(1536))
    text = Column(String)
