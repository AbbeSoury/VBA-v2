from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import get_supabase
from app.schemas.user_progress import UserProgressCreate
from typing import List

router = APIRouter()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"user_id": credentials.credentials}

@router.get("/user_progress/me", tags=["User Progress"])
def my_progress(user=Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("user_progress").select("*").eq("user_id", user["user_id"]).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.post("/user_progress", status_code=status.HTTP_201_CREATED, tags=["User Progress"])
def mark_lesson_completed(progress: UserProgressCreate, user=Depends(get_current_user)):
    supabase = get_supabase()
    data = progress.dict()
    data["user_id"] = user["user_id"]
    response = supabase.table("user_progress").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la progression")
    return response.data[0]