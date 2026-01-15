"""
Lightweight Question-answering service for Render free tier.
Uses improved keyword matching and context extraction.
"""
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from app.database import QAPair
from app.services.document_service import get_document_by_id, get_document_text

# Download required NLTK data (only once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)


def extract_keywords(text):
    """Extract important keywords from text."""
    try:
        stop_words = set(stopwords.words('english'))
        words = word_tokenize(text.lower())
        keywords = [w for w in words if w.isalnum() and w not in stop_words and len(w) > 2]
        return keywords
    except:
        # Fallback if NLTK fails
        return text.lower().split()


def split_into_chunks(text, chunk_size=500, overlap=100):
    """Split text into overlapping chunks for better context."""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if len(chunk.strip()) > 50:  # Only add substantial chunks
            chunks.append(chunk)
    
    return chunks


def simple_answer_question(document_id: int, question: str, db: Session):
    """
    Answer a question using improved keyword matching and context extraction.
    This is a lightweight alternative that works on Render free tier.
    """
    try:
        # Get the document
        document = get_document_by_id(document_id, db)
        if not document:
            raise ValueError(f"Document with ID {document_id} not found")
        
        # Get the document text
        document_text = get_document_text(document_id, db)
        
        # Clean the text
        document_text = re.sub(r'\s+', ' ', document_text).strip()
        
        if len(document_text) < 50:
            answer = "The document doesn't contain enough text to answer questions."
        else:
            # Split into chunks for better context
            chunks = split_into_chunks(document_text, chunk_size=400, overlap=100)
            
            if not chunks:
                # Fallback to sentences if chunking fails
                chunks = [document_text[:1000]]
            
            try:
                # Extract keywords from question
                question_keywords = extract_keywords(question)
                
                # Use TF-IDF with better parameters
                vectorizer = TfidfVectorizer(
                    stop_words='english',
                    max_features=200,
                    ngram_range=(1, 2),  # Include bigrams for better matching
                    min_df=1,
                    max_df=0.95
                )
                
                # Create vectors for chunks and question
                all_text = chunks + [question]
                tfidf_matrix = vectorizer.fit_transform(all_text)
                
                # Calculate similarity between question and each chunk
                question_vector = tfidf_matrix[-1]
                chunk_vectors = tfidf_matrix[:-1]
                similarities = cosine_similarity(question_vector, chunk_vectors)[0]
                
                # Get top 3 most relevant chunks (lowered threshold from 0.05 to 0.01)
                top_indices = similarities.argsort()[-3:][::-1]
                
                # Always return something if we have chunks
                if len(chunks) > 0:
                    # Get the best matching chunks (even if similarity is low)
                    relevant_chunks = [chunks[i] for i in top_indices[:2]]
                    
                    # Extract sentences from these chunks
                    all_sentences = []
                    for chunk in relevant_chunks:
                        sentences = re.split(r'[.!?]+', chunk)
                        all_sentences.extend([s.strip() for s in sentences if len(s.strip()) > 20])
                    
                    if all_sentences:
                        # Find sentences that contain question keywords
                        scored_sentences = []
                        for sentence in all_sentences:
                            sentence_lower = sentence.lower()
                            # Score based on keyword matches
                            score = sum(1 for keyword in question_keywords if keyword in sentence_lower)
                            scored_sentences.append((score, sentence))
                        
                        # Sort by score
                        scored_sentences.sort(reverse=True, key=lambda x: x[0])
                        
                        # If we have sentences with keywords, use them
                        if scored_sentences[0][0] > 0:
                            # Get top 3 sentences with keywords
                            answer_sentences = [s[1] for s in scored_sentences if s[0] > 0][:3]
                            answer = ". ".join(answer_sentences)
                            if not answer.endswith('.'):
                                answer += "."
                        else:
                            # No keyword matches, return most relevant chunk
                            answer = relevant_chunks[0][:600]
                            if not answer.endswith('.'):
                                answer += "..."
                    else:
                        # No sentences found, return chunk
                        answer = relevant_chunks[0][:600]
                        if not answer.endswith('.'):
                            answer += "..."
                else:
                    # No chunks, return beginning of document
                    answer = document_text[:600]
                    if not answer.endswith('.'):
                        answer += "..."
            
            except Exception as e:
                print(f"Error in TF-IDF processing: {str(e)}")
                # Fallback: simple keyword search
                question_lower = question.lower()
                question_words = [w for w in question_lower.split() if len(w) > 3]
                
                # Search for chunks containing question words
                best_chunks = []
                for chunk in chunks:
                    chunk_lower = chunk.lower()
                    score = sum(1 for word in question_words if word in chunk_lower)
                    if score > 0:
                        best_chunks.append((score, chunk))
                
                if best_chunks:
                    # Sort by score and get best chunk
                    best_chunks.sort(reverse=True, key=lambda x: x[0])
                    answer = best_chunks[0][1][:600]
                    if not answer.endswith('.'):
                        answer += "..."
                else:
                    # No matches, return first chunk
                    answer = chunks[0][:600] if chunks else document_text[:600]
                    if not answer.endswith('.'):
                        answer += "..."
        
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
