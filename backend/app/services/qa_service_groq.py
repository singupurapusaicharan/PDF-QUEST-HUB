"""
AI-powered Question-answering service using Groq API (FREE).
Provides accurate, relevant answers using real AI models.
"""
import os
import requests
from sqlalchemy.orm import Session

from app.database import QAPair
from app.services.document_service import get_document_by_id, get_document_text

# Groq API configuration (FREE)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def answer_question_with_ai(document_id: int, question: str, db: Session):
    """
    Answer a question using Groq AI (FREE, fast, accurate).
    """
    try:
        # Get the document
        document = get_document_by_id(document_id, db)
        if not document:
            raise ValueError(f"Document with ID {document_id} not found")
        
        # Get the document text
        document_text = get_document_text(document_id, db)
        
        # Limit context to 3000 characters to stay within API limits
        context = document_text[:3000] if len(document_text) > 3000 else document_text
        
        # Create prompt for AI
        prompt = f"""You are a helpful assistant that answers questions based on the provided document.

Document content:
{context}

Question: {question}

Instructions:
- Answer ONLY based on the document content
- Be concise and accurate
- If the answer is not in the document, say "I cannot find this information in the document"
- Do NOT include table of contents or lists
- Provide a clear, direct answer

Answer:"""

        # Call Groq API
        if not GROQ_API_KEY:
            # Fallback if no API key
            answer = "Please configure GROQ_API_KEY environment variable to use AI-powered answers."
        else:
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "llama-3.3-70b-versatile",  # Fast, accurate, FREE
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.3,  # Lower = more focused answers
                "max_tokens": 500,
                "top_p": 1
            }
            
            response = requests.post(GROQ_API_URL, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                answer = result['choices'][0]['message']['content'].strip()
            else:
                print(f"Groq API error: {response.status_code} - {response.text}")
                answer = "I encountered an error while processing your question. Please try again."
        
        # Store the QA pair
        qa_pair = QAPair(
            document_id=document_id,
            question=question,
            answer=answer
        )
        
        db.add(qa_pair)
        db.commit()
        db.refresh(qa_pair)
        
        return {
            "question": question,
            "answer": answer,
            "document_id": document_id,
            "document_name": document.filename,
            "qa_pair_id": qa_pair.id
        }
    except Exception as e:
        print(f"Error in answer_question_with_ai: {str(e)}")
        raise


def get_qa_history(document_id: int, db: Session, limit: int = 10):
    """Get QA history for a document."""
    document = get_document_by_id(document_id, db)
    if not document:
        raise ValueError(f"Document with ID {document_id} not found")
    
    qa_pairs = db.query(QAPair).filter(
        QAPair.document_id == document_id
    ).order_by(QAPair.timestamp.desc()).limit(limit).all()
    
    return [qa_pair.to_dict() for qa_pair in qa_pairs]
