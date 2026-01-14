"""
Database connection and models for the PDF Quest API.
This file defines the SQLAlchemy models and database connection.
"""
import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

from app.config import DATABASE_URL, IS_SQLITE

# Create SQLAlchemy engine and session
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if IS_SQLITE else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define SQLAlchemy models
class Document(Base):
    """
    Document model for storing uploaded PDF metadata.
    """
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    upload_time = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(String(255), nullable=True, index=True)  # Firebase user ID
    
    # Relationship with QAPair
    qa_pairs = relationship("QAPair", back_populates="document", cascade="all, delete-orphan")

    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            "id": self.id,
            "filename": self.filename,
            "file_path": self.file_path,
            "upload_time": self.upload_time.isoformat(),
            "user_id": self.user_id,
        }


class QAPair(Base):
    """
    QAPair model for storing question-answer pairs related to documents.
    """
    __tablename__ = "qa_pairs"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationship with Document
    document = relationship("Document", back_populates="qa_pairs")

    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            "id": self.id,
            "document_id": self.document_id,
            "question": self.question,
            "answer": self.answer,
            "timestamp": self.timestamp.isoformat(),
        }


class UserProfile(Base):
    """
    UserProfile model for storing user profile information.
    """
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class Feedback(Base):
    """
    Feedback model for storing user feedback.
    """
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=False, index=True)
    user_email = Column(String(255), nullable=False)
    feedback_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_email": self.user_email,
            "feedback_text": self.feedback_text,
            "created_at": self.created_at.isoformat(),
        }


def get_db():
    """
    Get a database session.
    This function creates a new database session and closes it when done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """
    Create all tables in the database if they don't exist.
    This function is called on application startup.
    """
    Base.metadata.create_all(bind=engine)
