from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import get_supabase
from app.schemas.test_submission import TestSubmissionCreate
from typing import List

router = APIRouter()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"user_id": credentials.credentials}

@router.post("/test_submissions", status_code=status.HTTP_201_CREATED, tags=["Test Submissions"])
def create_test_submission(submission: TestSubmissionCreate, user=Depends(get_current_user)):
    supabase = get_supabase()
    data = submission.dict()
    data["user_id"] = user["user_id"]
    response = supabase.table("test_submissions").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la soumission du test")
    return response.data[0]

@router.get("/test_submissions/me", tags=["Test Submissions"])
def my_test_submissions(user=Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("test_submissions").select("*").eq("user_id", user["user_id"]).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.get("/test_submissions/{id}", tags=["Test Submissions"])
def get_test_submission(id: str, user=Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("test_submissions").select("*").eq("id", id).single().execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Test submission not found")
    return response.data