"""
PDF utility functions for the PDF Quest API.
This file provides functions for extracting text from PDF files.
"""
import os
import fitz  # PyMuPDF

def extract_text_from_pdf(file_path):
    """
    Extract text from a PDF file.
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text from the PDF
    
    Raises:
        FileNotFoundError: If the file does not exist
        Exception: If there's an error extracting text
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found: {file_path}")
    
    try:
        # Open the PDF file
        doc = fitz.open(file_path)
        
        # Extract text from each page
        text = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
        
        # Close the document
        doc.close()
        
        return text
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")


def get_pdf_metadata(file_path):
    """
    Get metadata from a PDF file.
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        dict: Metadata from the PDF
    
    Raises:
        FileNotFoundError: If the file does not exist
        Exception: If there's an error extracting metadata
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found: {file_path}")
    
    try:
        # Open the PDF file
        doc = fitz.open(file_path)
        
        # Get metadata
        metadata = {
            "title": doc.metadata.get("title", ""),
            "author": doc.metadata.get("author", ""),
            "subject": doc.metadata.get("subject", ""),
            "keywords": doc.metadata.get("keywords", ""),
            "creator": doc.metadata.get("creator", ""),
            "producer": doc.metadata.get("producer", ""),
            "page_count": len(doc),
            "file_size": os.path.getsize(file_path)
        }
        
        # Close the document
        doc.close()
        
        return metadata
    except Exception as e:
        raise Exception(f"Error extracting metadata from PDF: {str(e)}")


def split_text_into_chunks(text, chunk_size=1000, overlap=100):
    """
    Split text into overlapping chunks for processing.
    
    Args:
        text (str): Text to split
        chunk_size (int): Size of each chunk
        overlap (int): Overlap between chunks
        
    Returns:
        list: List of text chunks
    """
    if not text:
        return []
    
    chunks = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        end = min(start + chunk_size, text_length)
        chunks.append(text[start:end])
        start = end - overlap
        
        # Break if we've reached the end
        if start >= text_length:
            break
    
    return chunks
