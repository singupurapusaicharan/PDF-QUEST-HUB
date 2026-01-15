"""
Question-answering router for the PDF Quest API.
This file defines the endpoints for asking questions about documents and generating summaries.
"""
import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.services import document_service

# Use lightweight service for Render free tier
USE_LIGHT_MODE = os.getenv("USE_LIGHT_MODE", "false").lower() == "true"

if USE_LIGHT_MODE:
    from app.services import qa_service_light as qa_service
else:
    from app.services import qa_service

# Create router
router = APIRouter(
    prefix="/qa",
    tags=["question-answering"],
    responses={404: {"description": "Not found"}},
)

# Define request models
class QuestionRequest(BaseModel):
    """Request model for asking a question."""
    document_id: int
    question: str

# Define endpoints
@router.post("/ask")
async def ask_question(
    request: QuestionRequest,
    db: Session = Depends(get_db)
):
    """
    Ask a question about a document.
    
    Args:
        request: The question request
        db: Database session
        
    Returns:
        dict: The answer and related information
        
    Raises:
        HTTPException: If the document is not found or if there's an error
    """
    try:
        # Check if the document exists
        document = document_service.get_document_by_id(request.document_id, db)
        
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document with ID {request.document_id} not found"
            )
        
        # Get the answer using appropriate service
        if USE_LIGHT_MODE:
            result = qa_service.simple_answer_question(
                document_id=request.document_id,
                question=request.question,
                db=db
            )
        else:
            result = qa_service.answer_question(
                document_id=request.document_id,
                question=request.question,
                db=db
            )
        
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error answering question: {str(e)}"
        )


@router.get("/history/{document_id}")
async def get_qa_history(
    document_id: int,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get the question-answer history for a document.
    
    Args:
        document_id: The ID of the document
        limit: Maximum number of records to return
        db: Database session
        
    Returns:
        list: List of question-answer pairs
        
    Raises:
        HTTPException: If the document is not found or if there's an error
    """
    try:
        # Get the QA history
        history = qa_service.get_qa_history(
            document_id=document_id,
            db=db,
            limit=limit
        )
        
        return history
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting QA history: {str(e)}"
        )


@router.post("/summarize/{document_id}")
async def summarize_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Generate a summary of a document (disabled in light mode).
    
    Args:
        document_id: The ID of the document
        db: Database session
        
    Returns:
        dict: The summary of the document
        
    Raises:
        HTTPException: If the document is not found or if there's an error
    """
    if USE_LIGHT_MODE:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Document summarization is not available in lightweight mode. Upgrade to full version for this feature."
        )
    
    try:
        # Check if the document exists
        document = document_service.get_document_by_id(document_id, db)
        
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document with ID {document_id} not found"
            )
        
        # Generate the summary
        summary = qa_service.summarize_document(
            document_id=document_id,
            db=db
        )
        
        return {
            "document_id": document_id,
            "document_name": document.filename,
            "summary": summary
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating summary: {str(e)}"
        )
