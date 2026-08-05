from sqlalchemy import create_engine, Engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import settings
from sqlalchemy import create_engine

engine=create_engine(settings.db_url)

def get_session():
    session = sessionmaker(bind=engine,expire_on_commit=False)()
    try:
        yield session
    finally:
        session.close()
