"""
Main application file for the PDF Question-Answering API.
This file initializes the FastAPI application and includes all routers.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import documents, qa, users
from app.database import create_tables

# Create the FastAPI application
app = FastAPI(
    title="PDF Quest API",
    description="API for uploading PDFs and asking questions about their content",
    version="1.0.0"
)

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)

# Mount the uploads directory to serve files
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include routers
app.include_router(documents.router)
app.include_router(qa.router)
app.include_router(users.router)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    """Create database tables on application startup if they don't exist."""
    create_tables()

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint that returns a welcome message."""
    return {"message": "Welcome to the PDF Quest API. Use /docs to see the API documentation."}
