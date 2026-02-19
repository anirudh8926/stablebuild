Merged repository: frontend + FastAPI model

This repository contains the Next.js frontend (under `frontend/`) and the FastAPI model backend (under `backend/`).

Run with Docker (recommended, cross-platform):

1. Build and start both services:

   docker compose up --build

2. Frontend: http://localhost:3000
   Backend: http://localhost:8000

Notes:

- The frontend's API URL is configured to `http://backend:8000` in Docker Compose. When accessing from host, the frontend still calls the backend via Docker networking.
- If you prefer to run locally without Docker: start the backend with `uvicorn app.main:app --reload --port 8000` from the `backend/` folder, and start the frontend with `npm install` then `npm run dev` from the `frontend/` folder.

Repository was initialized and pushed to the remote provided by the user.
