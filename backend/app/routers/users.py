"""
User router for the PDF Quest API.
This file defines the endpoints for user profile management and feedback.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db, UserProfile, Feedback

# Create router
router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


# Pydantic models for request/response
class ProfileUpdate(BaseModel):
    user_id: str
    name: Optional[str] = None
    email: str


class FeedbackSubmission(BaseModel):
    user_id: str
    user_email: str
    feedback_text: str


@router.post("/profile", status_code=status.HTTP_200_OK)
async def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db)
):
    """
    Update or create user profile.
    
    Args:
        profile_data: Profile information
        db: Database session
        
    Returns:
        dict: Updated profile information
    """
    try:
        # Check if profile exists
        profile = db.query(UserProfile).filter(UserProfile.user_id == profile_data.user_id).first()
        
        if profile:
            # Update existing profile
            if profile_data.name is not None:
                profile.name = profile_data.name
            profile.email = profile_data.email
        else:
            # Create new profile
            profile = UserProfile(
                user_id=profile_data.user_id,
                name=profile_data.name,
                email=profile_data.email
            )
            db.add(profile)
        
        db.commit()
        db.refresh(profile)
        
        return {
            "message": "Profile updated successfully",
            "profile": profile.to_dict()
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating profile: {str(e)}"
        )


@router.get("/profile/{user_id}")
async def get_profile(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Get user profile by user ID.
    
    Args:
        user_id: The Firebase user ID
        db: Database session
        
    Returns:
        dict: User profile information
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Profile not found for user {user_id}"
        )
    
    return profile.to_dict()


@router.post("/feedback", status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    feedback_data: FeedbackSubmission,
    db: Session = Depends(get_db)
):
    """
    Submit user feedback.
    
    Args:
        feedback_data: Feedback information
        db: Database session
        
    Returns:
        dict: Success message
    """
    try:
        # Create new feedback entry
        feedback = Feedback(
            user_id=feedback_data.user_id,
            user_email=feedback_data.user_email,
            feedback_text=feedback_data.feedback_text
        )
        
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        
        return {
            "message": "Feedback submitted successfully",
            "feedback": feedback.to_dict()
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting feedback: {str(e)}"
        )


@router.get("/feedback")
async def get_all_feedback(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all feedback (admin endpoint).
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session
        
    Returns:
        list: List of feedback entries
    """
    feedback_list = db.query(Feedback).order_by(Feedback.created_at.desc()).offset(skip).limit(limit).all()
    return [feedback.to_dict() for feedback in feedback_list]
