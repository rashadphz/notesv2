import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

db_url = os.environ.get("DB_URL")
if db_url is not None:
    SQLALCHEMY_DATABASE_URL = db_url
else:
    raise ValueError("DB_URL environment variable not set")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
