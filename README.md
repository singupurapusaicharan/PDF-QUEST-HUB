<div align="center">

# 📄 PDF Quest Hub

### AI-Powered Document Intelligence Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776ab?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Transform your PDFs into interactive knowledge bases with AI-powered question answering and intelligent document management.*

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

PDF Quest Hub is a production-ready, full-stack application that leverages advanced AI to enable natural language interactions with PDF documents. Built with modern technologies and best practices, it provides enterprise-grade document intelligence capabilities.

### Key Capabilities

- **🤖 AI-Powered Q&A**: Natural language question answering using LangChain and Sentence Transformers
- **📊 Document Management**: Upload, organize, pin, and delete PDFs with an intuitive interface
- **🔍 Semantic Search**: FAISS-powered vector similarity search for accurate context retrieval
- **📝 Smart Summarization**: Automatic document summarization using advanced NLP
- **👤 User Authentication**: Secure Firebase-based authentication with Google OAuth
- **🎨 Modern UI/UX**: Responsive design with dark mode, animations, and accessibility features
- **📈 History Tracking**: Complete conversation history and document interaction logs

---

## ✨ Features

### Core Functionality

| Feature | Description | Status |
|---------|-------------|--------|
| **PDF Upload** | Multi-file upload with drag-and-drop support | ✅ |
| **AI Question Answering** | Context-aware responses using local embeddings | ✅ |
| **Document Summarization** | Automatic extraction of key insights | ✅ |
| **Pin Documents** | Quick access to frequently used files | ✅ |
| **Delete Documents** | Remove documents from database and storage | ✅ |
| **User Profiles** | Personalized user accounts with Firebase | ✅ |
| **Dark Mode** | System-aware theme switching | ✅ |
| **Responsive Design** | Mobile-first, works on all devices | ✅ |

### Technical Highlights

- **Zero OpenAI Dependency**: Uses local Sentence Transformers for embeddings
- **Efficient Vector Search**: FAISS for fast similarity search
- **Real-time Updates**: Hot module replacement in development
- **Type Safety**: Full TypeScript coverage on frontend
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Database Flexibility**: Supports both SQLite (dev) and PostgreSQL (prod)

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  React 18 + TypeScript + Vite + Tailwind CSS + Shadcn UI   │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API
                     │ (JSON)
┌────────────────────▼────────────────────────────────────────┐
│                     API Gateway Layer                        │
│              FastAPI + Uvicorn + CORS                        │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼──────┐ ┌──▼──────────┐
│   Document   │ │   Q&A   │ │    User     │
│   Service    │ │ Service │ │   Service   │
└───────┬──────┘ └──┬──────┘ └──┬──────────┘
        │           │            │
        │      ┌────▼────┐       │
        │      │LangChain│       │
        │      │ + FAISS │       │
        │      └────┬────┘       │
        │           │            │
┌───────▼───────────▼────────────▼──────────┐
│         Database Layer (SQLAlchemy)        │
│      SQLite (Dev) / PostgreSQL (Prod)     │
└────────────────────────────────────────────┘
```

### Tech Stack

#### Frontend
- **Framework**: React 18.3 with TypeScript 5.5
- **Build Tool**: Vite 5.4 (Fast HMR, optimized builds)
- **Styling**: Tailwind CSS 3.4 + Shadcn UI components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router 7.12
- **Authentication**: Firebase 12.7 (Google OAuth)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

#### Backend
- **Framework**: FastAPI 0.95 (High-performance async)
- **Server**: Uvicorn 0.23 (ASGI server)
- **ORM**: SQLAlchemy 2.0 (Type-safe database operations)
- **AI/ML**: 
  - LangChain 0.1 (LLM orchestration)
  - Sentence Transformers 2.2 (Local embeddings)
  - FAISS 1.7 (Vector similarity search)
  - PyMuPDF 1.23 (PDF text extraction)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Validation**: Pydantic 1.10

---

## � Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://www.python.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pdf-quest-hub.git
cd pdf-quest-hub
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# The app uses SQLite by default (no database setup needed)
# Database will be created automatically on first run
```

#### 3. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install
```

#### 4. Environment Configuration

Create a `.env` file in the project root:

```env
# Database (SQLite is default, no configuration needed)
DB_TYPE=sqlite

# API Configuration
VITE_API_URL=http://localhost:8000

# File Upload
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=20971520

# Optional: PostgreSQL (for production)
# DB_TYPE=postgres
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=pdf_quest
```

#### 5. Firebase Setup (Optional - for Authentication)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Authentication
3. Update `src/lib/firebase.ts` with your Firebase config

#### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### 7. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

---

## 📁 Project Structure

```
pdf-quest-hub/
├── backend/                      # Python FastAPI backend
│   ├── app/
│   │   ├── routers/             # API route handlers
│   │   │   ├── documents.py     # Document management endpoints
│   │   │   ├── qa.py            # Q&A and summarization endpoints
│   │   │   └── users.py         # User management endpoints
│   │   ├── services/            # Business logic layer
│   │   │   ├── document_service.py
│   │   │   └── qa_service.py
│   │   ├── utils/               # Utility functions
│   │   ├── config.py            # Configuration management
│   │   ├── database.py          # Database models and connection
│   │   └── main.py              # Application entry point
│   ├── uploads/                 # PDF file storage
│   ├── venv/                    # Python virtual environment
│   ├── pdf_quest.db             # SQLite database (auto-created)
│   └── requirements.txt         # Python dependencies
│
├── src/                         # React TypeScript frontend
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Shadcn UI components
│   │   ├── ChatInterface.tsx   # Main chat component
│   │   ├── MessageBubble.tsx   # Message display
│   │   ├── UserAvatar.tsx      # User avatar with initials
│   │   └── ...
│   ├── pages/                   # Application pages
│   │   ├── Dashboard.tsx       # Main application interface
│   │   ├── Landing.tsx         # Landing page
│   │   ├── Profile.tsx         # User profile
│   │   ├── SignIn.tsx          # Authentication
│   │   └── ...
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx     # Authentication state
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and API client
│   │   ├── api.ts              # API client functions
│   │   ├── firebase.ts         # Firebase configuration
│   │   └── utils.ts            # Helper functions
│   └── index.css                # Global styles and animations
│
├── public/                      # Static assets
├── .env                         # Environment variables
├── package.json                 # Node.js dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── vite.config.ts               # Vite build configuration
└── README.md                    # This file
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication
Currently uses Firebase authentication. Include the Firebase ID token in requests for protected endpoints.

### Endpoints

#### Documents

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/documents/upload` | Upload a PDF file | ✅ |
| `GET` | `/documents/` | List all documents | ✅ |
| `GET` | `/documents/{id}` | Get document by ID | ✅ |
| `DELETE` | `/documents/{id}` | Delete a document | ✅ |

#### Question & Answer

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/qa/ask` | Ask a question about a document | ✅ |
| `GET` | `/qa/history/{document_id}` | Get Q&A history | ✅ |
| `POST` | `/qa/summarize/{document_id}` | Generate document summary | ✅ |

#### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/users/profile` | Create/update user profile | ✅ |
| `GET` | `/users/profile/{user_id}` | Get user profile | ✅ |
| `POST` | `/users/feedback` | Submit feedback | ✅ |

### Example Request

```bash
# Upload a PDF
curl -X POST "http://localhost:8000/documents/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "user_id=user123"

# Ask a question
curl -X POST "http://localhost:8000/qa/ask" \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": 1,
    "question": "What is the main topic of this document?"
  }'
```

### Interactive API Documentation

Visit http://localhost:8000/docs for the full interactive Swagger UI documentation.

---

## 🧪 Development

### Available Scripts

#### Frontend

```bash
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend

```bash
# Start development server with auto-reload
python -m uvicorn app.main:app --reload

# Start on specific host/port
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Check database tables
python check_tables.py
```

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (recommended)
- **Type Checking**: Run `tsc --noEmit` to check types

### Testing

```bash
# Frontend tests (if configured)
npm test

# Backend tests (if configured)
pytest
```

---

## 🎨 UI/UX Features

### Design System

- **Color Palette**: Teal and Emerald gradients with dark mode support
- **Typography**: System fonts with optimized readability
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG 2.1 AA compliant

### Key UI Components

- **Dashboard**: Sidebar navigation with pinned documents
- **Chat Interface**: Real-time message streaming with markdown support
- **Document Cards**: Hover effects with pin/delete actions
- **User Avatars**: Dynamic initials with gradient backgrounds
- **Settings Icon**: Smooth 180° rotation animation
- **Toast Notifications**: Non-intrusive feedback system
- **Loading States**: Skeleton screens and spinners

---

## 🔒 Security

### Best Practices Implemented

- ✅ Environment variables for sensitive data
- ✅ CORS configuration for API security
- ✅ Firebase authentication with secure tokens
- ✅ SQL injection prevention via SQLAlchemy ORM
- ✅ File upload validation and size limits
- ✅ XSS protection in React
- ✅ HTTPS recommended for production

### Production Recommendations

1. **Use PostgreSQL** instead of SQLite
2. **Enable HTTPS** with SSL certificates
3. **Configure CORS** to allow only your domain
4. **Set up rate limiting** on API endpoints
5. **Implement request validation** with Pydantic
6. **Use environment-specific configs**
7. **Enable logging and monitoring**

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod
```

### Backend (Railway/Render/AWS)

```bash
# Ensure requirements.txt is up to date
pip freeze > requirements.txt

# Set environment variables on your platform
# Deploy using platform-specific CLI or Git integration
```






---




