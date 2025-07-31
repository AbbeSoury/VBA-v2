from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

tags_metadata = [
    {"name": "Courses", "description": "Gestion des cours"},
    {"name": "Lessons", "description": "Gestion des leçons"},
    {"name": "Exercises", "description": "Gestion des exercices"},
    {"name": "Submissions", "description": "Soumissions d'exercices"},
    {"name": "Tests", "description": "Examens et tests"},
    {"name": "Test Submissions", "description": "Soumissions de tests"},
    {"name": "Projects", "description": "Projets"},
    {"name": "Project Submissions", "description": "Soumissions de projets"},
    {"name": "User Progress", "description": "Progression utilisateur"},
    {"name": "Question Bank", "description": "Banque de questions"},
    {"name": "Dashboard", "description": "Tableau de bord"},
]

app = FastAPI(openapi_tags=tags_metadata)

# Ajout du middleware CORS avec wildcard pour tous les sous-domaines Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # tu peux laisser localhost ici
    allow_origin_regex=r"https://vba-v2-.*\.abbesourys-projects\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import (
    courses, test_supabase, exercises, lessons,
    submissions, tests, test_submissions, projects,
    project_submissions, user_progress, question_bank, dashboard
)

app.include_router(courses.router)
app.include_router(test_supabase.router)
app.include_router(exercises.router)
app.include_router(lessons.router)
app.include_router(submissions.router)
app.include_router(tests.router)
app.include_router(test_submissions.router)
app.include_router(projects.router)
app.include_router(project_submissions.router)
app.include_router(user_progress.router)
app.include_router(question_bank.router)
app.include_router(dashboard.router)

@app.get("/ping")
def ping():
    return {"message": "pong"}