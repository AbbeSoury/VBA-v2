from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import get_supabase
from app.schemas.project_submission import ProjectSubmissionCreate
from typing import List

router = APIRouter()

TEACHER_TOKEN = "secret-teacher-token"
security = HTTPBearer()

def get_current_teacher(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token != TEACHER_TOKEN:
        raise HTTPException(status_code=403, detail="Not authorized as teacher")
    return {"role": "teacher"}

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"user_id": credentials.credentials}

@router.post("/project_submissions", status_code=status.HTTP_201_CREATED, tags=["Project Submissions"])
def create_project_submission(submission: ProjectSubmissionCreate, user=Depends(get_current_user)):
    supabase = get_supabase()
    data = submission.dict()
    data["user_id"] = user["user_id"]
    response = supabase.table("project_submissions").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la soumission du projet")
    return response.data[0]

@router.get("/project_submissions/me", tags=["Project Submissions"])
def my_project_submissions(user=Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("project_submissions").select("*").eq("user_id", user["user_id"]).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.get("/project_submissions/{id}", tags=["Project Submissions"])
def get_project_submission(id: str, user=Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("project_submissions").select("*").eq("id", id).single().execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Project submission not found")
    return response.data

@router.put("/project_submissions/{id}/grade", tags=["Project Submissions"])
def grade_project_submission(id: str, score: int, feedback: str = "", teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    response = supabase.table("project_submissions").update({"score": score, "feedback": feedback}).eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Project submission not found or not graded")
    return response.data[0]