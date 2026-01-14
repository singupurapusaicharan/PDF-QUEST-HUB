/**
 * API client for communicating with the backend
 */

// Get the API URL from environment variables or use a default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Upload a PDF file to the server
 * @param file The PDF file to upload
 * @param userId The ID of the user uploading the file (optional)
 * @returns The uploaded document data
 */
export async function uploadPdf(file: File, userId?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (userId) {
    formData.append('user_id', userId);
  }

  const response = await fetch(`${API_URL}/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to upload PDF');
  }

  return response.json();
}

/**
 * Get all uploaded documents
 * @param userId Optional user ID to filter documents
 * @returns List of documents
 */
export async function getDocuments(userId?: string) {
  const url = new URL(`${API_URL}/documents/`);
  if (userId) {
    url.searchParams.append('user_id', userId);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get documents');
  }

  return response.json();
}

/**
 * Delete a document
 * @param documentId The ID of the document to delete
 * @returns Success message
 */
export async function deleteDocument(documentId: number) {
  const response = await fetch(`${API_URL}/documents/${documentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete document');
  }

  return response.json();
}

/**
 * Ask a question about a document
 * @param documentId The ID of the document
 * @param question The question to ask
 * @returns The answer and related information
 */
export async function askQuestion(documentId: number, question: string) {
  const response = await fetch(`${API_URL}/qa/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document_id: documentId,
      question,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get answer');
  }

  return response.json();
}

/**
 * Get the question-answer history for a document
 * @param documentId The ID of the document
 * @returns List of question-answer pairs
 */
export async function getQaHistory(documentId: number) {
  const response = await fetch(`${API_URL}/qa/history/${documentId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get QA history');
  }

  return response.json();
}

/**
 * Generate a summary of a document
 * @param documentId The ID of the document
 * @returns The summary of the document
 */
export async function summarizeDocument(documentId: number) {
  const response = await fetch(`${API_URL}/qa/summarize/${documentId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to generate summary');
  }

  return response.json();
}

/**
 * Get user profile from database
 * @param userId The Firebase user ID
 * @returns The user profile
 */
export async function getProfile(userId: string) {
  const response = await fetch(`${API_URL}/users/profile/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Profile doesn't exist yet
    }
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get profile');
  }

  return response.json();
}

/**
 * Update user profile
 * @param userId The Firebase user ID
 * @param name The user's name
 * @param email The user's email
 * @returns The updated profile
 */
export async function updateProfile(userId: string, name: string, email: string) {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      name,
      email,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update profile');
  }

  return response.json();
}

/**
 * Submit user feedback
 * @param userId The Firebase user ID
 * @param userEmail The user's email
 * @param feedbackText The feedback text
 * @returns Success response
 */
export async function submitFeedback(userId: string, userEmail: string, feedbackText: string) {
  const response = await fetch(`${API_URL}/users/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      user_email: userEmail,
      feedback_text: feedbackText,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to submit feedback');
  }

  return response.json();
}


