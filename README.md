# 📄 PDF Quest Hub

### AI-Powered Document Intelligence Platform with Groq AI

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://pdf-quest-hub.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-orange)](https://groq.com/)

*Transform your PDFs into interactive knowledge bases with ChatGPT-quality AI answers - 100% FREE!*

---

## 🎯 Overview

PDF Quest Hub is a production-ready, full-stack application that uses **Groq AI** (FREE) to provide ChatGPT-quality answers about your PDF documents. Upload any PDF and ask questions in natural language - get accurate, relevant answers instantly!

### ✨ Key Features

- 🤖 **ChatGPT-Quality Answers** - Powered by Groq AI (Llama 3.3 70B)
- 📄 **PDF Upload & Management** - Upload, pin, delete documents
- 🔐 **User Authentication** - Firebase with Google OAuth
- 💬 **Chat Interface** - Beautiful, responsive chat UI
- 📱 **Mobile Friendly** - Works on all devices
- 🌙 **Dark Mode** - System-aware theme switching
- ⚡ **Fast & Free** - 1-2 second responses, $0/month

---

## 🚀 Live Demo

**Website:** https://pdf-quest-hub.vercel.app

**Try it:**
1. Sign up with Google or email
2. Upload a PDF document
3. Ask questions about it
4. Get accurate AI answers!

---

## 💰 Cost Breakdown

| Service | Purpose | Cost |
|---------|---------|------|
| **Groq AI** | AI Question Answering | **FREE** (unlimited) |
| **Vercel** | Frontend Hosting | **FREE** |
| **Render** | Backend Hosting | **FREE** |
| **Firebase** | Authentication | **FREE** |
| **UptimeRobot** | Keep Backend Awake | **FREE** (optional) |
| **TOTAL** | Everything | **$0/month** 🎉 |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Users                            │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│   VERCEL      │         │   RENDER     │
│  (Frontend)   │────────▶│  (Backend)   │
│               │  API    │              │
│ React + Vite  │  Calls  │   FastAPI    │
└───────────────┘         └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │   GROQ AI    │
                          │ (Free API)   │
                          └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Firebase** - Authentication

### Backend
- **FastAPI** - Python web framework
- **SQLite** - Database (free tier)
- **PyMuPDF** - PDF text extraction
- **Groq API** - AI question answering

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **UptimeRobot** - Keep backend awake (optional)

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/PDF-QUEST-HUB.git
cd PDF-QUEST-HUB
```

### 2. Setup Frontend
```bash
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

### 3. Setup Backend
```bash
cd backend
pip install -r requirements-light.txt
uvicorn app.main:app --reload
```
Backend runs on: http://localhost:8000

### 4. Configure Environment
Create `.env` in project root:
```env
VITE_API_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🔑 Get Groq API Key (FREE)

**Required for AI answers!**

1. Go to: https://console.groq.com
2. Sign up (FREE, no credit card)
3. Create API key
4. Copy key (starts with `gsk_...`)
5. Add to `.env` file

**Full guide:** See `GROQ_AI_SETUP.md`

---

## 🚀 Deployment

### Deploy to Production (FREE)

**Full guide:** See `DEPLOYMENT_GUIDE.md`

#### 1. Deploy Backend to Render
1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service from GitHub
4. Add environment variable: `GROQ_API_KEY`
5. Deploy!

#### 2. Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Import GitHub repository
3. Add environment variable: `VITE_API_URL`
4. Deploy!

#### 3. Setup UptimeRobot (Optional)
Keep backend awake 24/7:
1. Go to https://uptimerobot.com
2. Add monitor for your Render URL
3. Set interval to 5 minutes

**Full guide:** See `KEEP_ALIVE_SETUP.md`

---

## 📖 Documentation

- **GROQ_AI_SETUP.md** - Setup Groq AI for accurate answers
- **DEPLOYMENT_GUIDE.md** - Complete deployment instructions
- **KEEP_ALIVE_SETUP.md** - Keep backend awake 24/7
- **FIREBASE_VERCEL_SETUP.md** - Fix Google sign-in
- **VERCEL_ENV_FIX.md** - Environment variable setup

---

## 🎯 Features

### ✅ Implemented
- [x] PDF upload and storage
- [x] AI-powered question answering (Groq AI)
- [x] User authentication (Firebase + Google OAuth)
- [x] Document management (pin, delete)
- [x] Chat interface with history
- [x] User profiles
- [x] Dark mode
- [x] Responsive design
- [x] Settings with rotation animation

### 🚧 Roadmap
- [ ] Document summarization
- [ ] Multi-language support
- [ ] Export chat history
- [ ] Collaborative features
- [ ] Advanced search filters

---






