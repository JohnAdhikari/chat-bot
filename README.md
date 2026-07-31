# 🤖 Zone AI — Chat Assistant

A modern AI chat interface where you can pick your model (Gemini 2.0 Flash or GPT-4o Mini), bring your own API key, and start chatting. Built with a React frontend and a FastAPI proxy backend.

## ✨ Features

- 🔀 **Model picker** — switch between Gemini 2.0 Flash and GPT-4o Mini
- 🔑 **Bring your own key** — paste your API key; it stays in your browser's `localStorage`
- ⚡ **FastAPI proxy** — a thin backend relays chat requests so keys stay out of the client bundle
- 🌗 **Light / dark theme**
- 📱 **Responsive** chat UI

## 🧰 Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite 7 |
| AI APIs | Google Gemini 2.0 Flash, OpenAI (GPT-4o Mini) |
| Backend | FastAPI (`backend/app.py`) |
| Hosting | GitHub Pages + GitHub Actions |

## 🚀 Getting Started

### Backend (proxy)

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

The proxy exposes `/api/chat` and `/health`.

### Frontend

```bash
npm install
npm run dev
```

Open the app, choose a model, paste your API key, and start chatting.

## 🌍 Live

**https://JohnAdhikari.github.io/chat-bot/**
