"""
Document service for the PDF Quest API.
This file provides functions for processing and storing PDF documents.
"""
import os
import uuid
from datetime import datetime
from sqlalchemy.orm import Session

from app.database import Document
from app.utils.pdf_utils import extract_text_from_pdf, get_pdf_metadata
from app.config import UPLOAD_DIR

def save_uploaded_file(file, db: Session, user_id: str = None):
    """
    Save an uploaded PDF file and store its metadata in the database.
    
    Args:
        file: The uploaded file object
        db: Database session
        user_id: The ID of the user uploading the file (optional)
        
    Returns:
        Document: The created document object
    """
    # Create a unique filename to prevent collisions
    original_filename = file.filename
    file_extension = os.path.splitext(original_filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Create the file path
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    # Create a new document in the database
    db_document = Document(
        filename=original_filename,
        file_path=file_path,
        upload_time=datetime.utcnow(),
        user_id=user_id
    )
    
    # Add and commit to the database
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document


def get_document_by_id(document_id: int, db: Session):
    """
    Get a document by its ID.
    
    Args:
        document_id: The ID of the document
        db: Database session
        
    Returns:
        Document: The document object if found, None otherwise
    """
    return db.query(Document).filter(Document.id == document_id).first()


def get_all_documents(db: Session, skip: int = 0, limit: int = 100, user_id: str = None):
    """
    Get all documents with pagination, optionally filtered by user.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        user_id: Optional user ID to filter documents
        
    Returns:
        list: List of document objects
    """
    query = db.query(Document)
    
    # Filter by user_id if provided
    if user_id:
        query = query.filter(Document.user_id == user_id)
    
    return query.order_by(Document.upload_time.desc()).offset(skip).limit(limit).all()


def delete_document(document_id: int, db: Session):
    """
    Delete a document and its file.
    
    Args:
        document_id: The ID of the document to delete
        db: Database session
        
    Returns:
        bool: True if the document was deleted, False otherwise
    """
    # Get the document
    document = get_document_by_id(document_id, db)
    
    if not document:
        return False
    
    # Delete the file if it exists
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    # Delete the document from the database
    db.delete(document)
    db.commit()
    
    return True


def get_document_text(document_id: int, db: Session):
    """
    Get the text content of a document.
    
    Args:
        document_id: The ID of the document
        db: Database session
        
    Returns:
        str: The text content of the document
    
    Raises:
        ValueError: If the document is not found
    """
    # Get the document
    document = get_document_by_id(document_id, db)
    
    if not document:
        raise ValueError(f"Document with ID {document_id} not found")
    
    # Extract text from the PDF
    text = extract_text_from_pdf(document.file_path)
    
    return text
