"""
Lightweight Question-answering service for Render free tier.
Uses simple keyword matching instead of heavy AI models.
"""
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

from app.database import QAPair
from app.services.document_service import get_document_by_id, get_document_text


def simple_answer_question(document_id: int, question: str, db: Session):
    """
    Answer a question using simple keyword matching and text extraction.
    This is a lightweight alternative that works on Render free tier.
    """
    try:
        # Get the document
        document = get_document_by_id(document_id, db)
        if not document:
            raise ValueError(f"Document with ID {document_id} not found")
        
        # Get the document text
        document_text = get_document_text(document_id, db)
        
        # Split into sentences
        sentences = re.split(r'[.!?]+', document_text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        
        if not sentences:
            answer = "I couldn't find enough content in the document to answer your question."
        else:
            # Use TF-IDF to find most relevant sentences
            vectorizer = TfidfVectorizer(stop_words='english', max_features=100)
            
            try:
                # Create vectors for sentences and question
                all_text = sentences + [question]
                tfidf_matrix = vectorizer.fit_transform(all_text)
                
                # Calculate similarity between question and each sentence
                question_vector = tfidf_matrix[-1]
                sentence_vectors = tfidf_matrix[:-1]
                similarities = cosine_similarity(question_vector, sentence_vectors)[0]
                
                # Get top 3 most relevant sentences
                top_indices = similarities.argsort()[-3:][::-1]
                relevant_sentences = [sentences[i] for i in top_indices if similarities[i] > 0.1]
                
                if relevant_sentences:
                    answer = " ".join(relevant_sentences)
                else:
                    answer = "I couldn't find a specific answer to your question in the document. Please try rephrasing your question or ask about different content."
            except:
                # Fallback: return first few sentences
                answer = " ".join(sentences[:3])
        
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
        print(f"Error in simple_answer_question: {str(e)}")
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
