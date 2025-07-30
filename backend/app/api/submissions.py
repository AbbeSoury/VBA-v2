from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import get_supabase
from app.schemas.submission import SubmissionCreate
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
    # Pour la démo, on simule user_id à partir du token
    return {"user_id": credentials.credentials}

@router.get("/submissions/me", tags=["Submissions"])
def my_submissions(user=Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("submissions").select("*").eq("user_id", user["user_id"]).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.post("/submissions", status_code=status.HTTP_201_CREATED, tags=["Submissions"])
def create_submission(submission: SubmissionCreate, user=Depends(get_current_user)):
    supabase = get_supabase()
    data = submission.dict()
    data["user_id"] = user["user_id"]
    response = supabase.table("submissions").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la soumission")
    return response.data[0]

@router.get("/submissions/{id}", tags=["Submissions"])
def get_submission(id: str, user=Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("submissions").select("*").eq("id", id).single().execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Submission not found")
    # Optionnel: vérifier que user est bien owner ou teacher
    return response.data

@router.put("/submissions/{id}/grade", tags=["Submissions"])
def grade_submission(id: str, score: int, feedback: str = "", teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    response = supabase.table("submissions").update({"score": score, "feedback": feedback}).eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Submission not found or not graded")
    return response.data[0]