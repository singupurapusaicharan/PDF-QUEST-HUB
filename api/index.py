# Vercel Serverless Function for FastAPI
from fastapi import FastAPI
from mangum import Mangum
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.main import app

# Wrap FastAPI app for Vercel
handler = Mangum(app)
