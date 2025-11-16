# Resume Builder
Generate polished resumes from a simple web form. The React frontend lets you edit, reorder sections, and preview; the FastAPI backend converts your JSON into LaTeX and returns a PDF.

## Features
- Drag-and-drop section ordering (education, skills, experience, projects, certificates)
- Live resume preview with adjustable margins and font size
- Export resume JSON or download a PDF via the backend
- Dockerized frontend and backend, plus one-command `docker-compose` setup

## Stack
- **Frontend:** React 18 + Vite, Tailwind, `@hello-pangea/dnd`, `axios`
- **Backend:** FastAPI + Uvicorn, LaTeX (`pdflatex`) for PDF generation
- **Containers:** Dockerfiles for both services; `docker-compose` for local orchestration

## Repository Layout
- `frontend/` — React app, preview UI, forms, and settings
  - `src/App.tsx` — Page layout and section ordering
  - `src/components/EditForm.tsx` — Inputs for personal info, education, experience, skills
  - `src/components/SettingsPanel.tsx` — Font size, margins, one-line education toggle
  - `src/components/ResumePreview.tsx` — On-screen preview of the resume
- `backend/` — FastAPI service and LaTeX generator
  - `app/main.py` — `/api/resume/generate-pdf` endpoint
  - `app/resume.py` — Builds LaTeX, escapes user text, runs `pdflatex`
- `docker-compose.yml` — Runs both services together for local dev
- `PROJECT_OVERVIEW.md` — ELI5 walkthrough of the flow and file roles

## Quick Start (Local)
Requirements: Node 18+, Python 3.11+, `pdflatex` available on PATH (install TeX Live/MacTeX).

1) **Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # or your preferred env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

2) **Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev   # defaults to http://localhost:5173
```
Set `VITE_API_URL` in `.env` if the backend is not on `http://localhost:8000`.

Visit `http://localhost:5173`, fill out the form, click **Download PDF**.

## Quick Start (Docker Compose)
```bash
docker-compose up --build
```
- Frontend: http://localhost:5173  
- Backend: http://localhost:8000  
`VITE_API_URL` is wired to the backend service inside compose.

## API at a Glance
`POST /api/resume/generate-pdf`
- Body: `{ resume_data, section_order, font_size, margin_top/bottom/left/right, one_line_education }`
- Response: `application/pdf` (or JSON error)
- See `PROJECT_OVERVIEW.md` for a sample payload and flow diagram.

## Troubleshooting
- **PDF generation fails:** Ensure `pdflatex` is installed and available to the backend container/host.
- **CORS issues:** Backend enables `allow_origins=["*"]`; check `VITE_API_URL` matches the backend address.
- **Blank sections:** Confirm the JSON shape matches the fields in `SAMPLE_RESUME` (see `src/App.tsx`).
