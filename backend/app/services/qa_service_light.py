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


def clean_text(text):
    """Clean and normalize text by removing excessive whitespace and formatting."""
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove bullet points and special characters at start of lines
    text = re.sub(r'^\s*[•\-\*]\s*', '', text, flags=re.MULTILINE)
    # Remove page numbers and headers/footers patterns
    text = re.sub(r'\b\d+\s*$', '', text, flags=re.MULTILINE)
    # Remove excessive newlines
    text = re.sub(r'\n\s*\n', '\n', text)
    return text.strip()


def is_meaningful_sentence(sentence):
    """Check if a sentence is meaningful (not just a heading or list item)."""
    sentence = sentence.strip()
    
    # Too short
    if len(sentence) < 30:
        return False
    
    # Just a heading or list item (ends with : or has no verb)
    if sentence.endswith(':') or sentence.endswith('...'):
        return False
    
    # Contains actual content (has common words)
    common_words = ['is', 'are', 'was', 'were', 'the', 'a', 'an', 'to', 'for', 'of', 'in', 'on', 'at']
    has_common_word = any(word in sentence.lower().split() for word in common_words)
    
    return has_common_word


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
    # Clean the text first
    text = clean_text(text)
    
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if len(chunk.strip()) > 100:  # Only add substantial chunks
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
        document_text = clean_text(document_text)
        
        if len(document_text) < 50:
            answer = "The document doesn't contain enough text to answer questions."
        else:
            # Split into chunks for better context
            chunks = split_into_chunks(document_text, chunk_size=500, overlap=100)
            
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
                    ngram_range=(1, 2),
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
                
                # Get top 3 most relevant chunks
                top_indices = similarities.argsort()[-3:][::-1]
                
                # Get the best matching chunks
                relevant_chunks = [chunks[i] for i in top_indices[:2]]
                
                # Extract meaningful sentences from these chunks
                all_sentences = []
                for chunk in relevant_chunks:
                    sentences = re.split(r'[.!?]+', chunk)
                    # Filter for meaningful sentences only
                    meaningful = [s.strip() for s in sentences if is_meaningful_sentence(s)]
                    all_sentences.extend(meaningful)
                
                if all_sentences:
                    # Find sentences that contain question keywords
                    scored_sentences = []
                    for sentence in all_sentences:
                        sentence_lower = sentence.lower()
                        # Score based on keyword matches
                        score = sum(1 for keyword in question_keywords if keyword in sentence_lower)
                        if score > 0:  # Only include sentences with keywords
                            scored_sentences.append((score, sentence))
                    
                    if scored_sentences:
                        # Sort by score and get top 3
                        scored_sentences.sort(reverse=True, key=lambda x: x[0])
                        answer_sentences = [s[1] for s in scored_sentences[:3]]
                        answer = ". ".join(answer_sentences)
                        if not answer.endswith('.'):
                            answer += "."
                    else:
                        # No keyword matches, return most relevant meaningful sentences
                        answer = ". ".join(all_sentences[:3])
                        if not answer.endswith('.'):
                            answer += "."
                else:
                    # No meaningful sentences, return cleaned chunk
                    answer = relevant_chunks[0][:500]
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
                    # Extract meaningful sentences from best chunk
                    sentences = re.split(r'[.!?]+', best_chunks[0][1])
                    meaningful = [s.strip() for s in sentences if is_meaningful_sentence(s)]
                    
                    if meaningful:
                        answer = ". ".join(meaningful[:3])
                        if not answer.endswith('.'):
                            answer += "."
                    else:
                        answer = best_chunks[0][1][:500]
                        if not answer.endswith('.'):
                            answer += "..."
                else:
                    # No matches, return first meaningful sentences from document
                    sentences = re.split(r'[.!?]+', document_text)
                    meaningful = [s.strip() for s in sentences if is_meaningful_sentence(s)]
                    
                    if meaningful:
                        answer = ". ".join(meaningful[:3])
                        if not answer.endswith('.'):
                            answer += "."
                    else:
                        answer = chunks[0][:500] if chunks else document_text[:500]
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
