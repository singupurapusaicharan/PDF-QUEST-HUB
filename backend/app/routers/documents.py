"""
Document router for the PDF Quest API.
This file defines the endpoints for uploading and managing PDF documents.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services import document_service
from app.config import MAX_UPLOAD_SIZE

# Create router
router = APIRouter(
    prefix="/documents",
    tags=["documents"],
    responses={404: {"description": "Not found"}},
)

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_pdf(
    file: UploadFile = File(...),
    user_id: str = Form(None),
    db: Session = Depends(get_db)
):
    """
    Upload a PDF file.
    
    Args:
        file: The PDF file to upload
        user_id: The ID of the user uploading the file (optional)
        db: Database session
        
    Returns:
        dict: Information about the uploaded document
        
    Raises:
        HTTPException: If the file is not a PDF or if there's an error
    """
    # Check if the file is a PDF
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )
    
    # Check file size
    file_size = 0
    file_content = await file.read()
    file_size = len(file_content)
    await file.seek(0)  # Reset file pointer
    
    if file_size > MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds the maximum allowed size of {MAX_UPLOAD_SIZE / (1024 * 1024)} MB"
        )
    
    try:
        # Save the file and create a document
        document = document_service.save_uploaded_file(file, db, user_id)
        
        # Return document information
        return {
            "message": "File uploaded successfully",
            "document": document.to_dict()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )


@router.get("/", response_model=List[dict])
async def get_all_documents(
    skip: int = 0,
    limit: int = 100,
    user_id: str = None,
    db: Session = Depends(get_db)
):
    """
    Get all documents, optionally filtered by user.
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        user_id: Optional user ID to filter documents
        db: Database session
        
    Returns:
        list: List of documents
    """
    documents = document_service.get_all_documents(db, skip, limit, user_id)
    return [doc.to_dict() for doc in documents]


@router.get("/{document_id}")
async def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a document by ID.
    
    Args:
        document_id: The ID of the document
        db: Database session
        
    Returns:
        dict: Information about the document
        
    Raises:
        HTTPException: If the document is not found
    """
    document = document_service.get_document_by_id(document_id, db)
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID {document_id} not found"
        )
    
    return document.to_dict()


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a document.
    
    Args:
        document_id: The ID of the document to delete
        db: Database session
        
    Returns:
        dict: Success message
        
    Raises:
        HTTPException: If the document is not found
    """
    result = document_service.delete_document(document_id, db)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID {document_id} not found"
        )
    
    return {"message": f"Document with ID {document_id} deleted successfully"}
