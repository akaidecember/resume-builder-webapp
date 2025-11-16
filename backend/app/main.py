import os
import json
import uuid
from pathlib import Path

from fastapi import FastAPI, Body
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app import resume as generator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/resume/generate-pdf")
async def generate_pdf(payload: dict = Body(...)):
    """
    Accepts JSON with keys like:
    {
      "resume_data": { ... },
      "font_size": 11,
      "margin_top": 0.3,
      "margin_bottom": 0.3,
      "margin_left": 0.45,
      "margin_right": 0.45,
      "one_line_education": true,
      "section_order": ["education","skills","experience","projects"]
    }
    Returns a PDF file.
    """

    data = payload.get("resume_data") or payload
    section_order = payload.get("section_order") or ["education", "skills", "experience", "projects"]
    one_line = bool(payload.get("one_line_education", True))

    # formatting options
    try:
        font_size = int(payload.get("font_size", 11) or 11)
    except Exception:
        font_size = 11
    margins = {
        "top": float(payload.get("margin_top", 0.30) or 0.30),
        "bottom": float(payload.get("margin_bottom", 0.30) or 0.30),
        "left": float(payload.get("margin_left", 0.45) or 0.45),
        "right": float(payload.get("margin_right", 0.45) or 0.45),
    }

    # Output dir per-request
    out_dir = Path("/tmp/resumes") / str(uuid.uuid4())
    out_dir.mkdir(parents=True, exist_ok=True)
    tex_path = out_dir / "resume.tex"
    pdf_path = out_dir / "resume.pdf"

    try:
        tex = generator.generate_tex(data, one_line, section_order, font_size=font_size, margins=margins)
        generator.write_file(tex, str(tex_path))
        generator.compile_to_pdf(str(tex_path), str(out_dir))
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"PDF generation failed: {e}"})

    if not pdf_path.exists():
        return JSONResponse(status_code=500, content={"detail": "Failed to create PDF"})

    return FileResponse(str(pdf_path), media_type="application/pdf", filename="resume.pdf")
