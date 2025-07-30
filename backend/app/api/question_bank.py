from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import get_supabase
from app.schemas.question_bank import QuestionBankCreate
from typing import List

router = APIRouter()

TEACHER_TOKEN = "secret-teacher-token"
security = HTTPBearer()

def get_current_teacher(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token != TEACHER_TOKEN:
        raise HTTPException(status_code=403, detail="Not authorized as teacher")
    return {"role": "teacher"}

@router.get("/question_bank", tags=["Question Bank"])
def search_question_bank():
    supabase = get_supabase()
    response = supabase.table("question_bank").select("*").execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.post("/question_bank", status_code=status.HTTP_201_CREATED, tags=["Question Bank"])
def add_question(question: QuestionBankCreate, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    data = question.dict()
    response = supabase.table("question_bank").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de l'ajout de la question")
    return response.data[0]