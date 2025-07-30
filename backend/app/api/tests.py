from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import get_supabase
from app.schemas.test import TestCreate
from typing import List

router = APIRouter()

TEACHER_TOKEN = "secret-teacher-token"
security = HTTPBearer()

def get_current_teacher(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token != TEACHER_TOKEN:
        raise HTTPException(status_code=403, detail="Not authorized as teacher")
    return {"role": "teacher"}

@router.get("/tests", tags=["Tests"])
def list_tests():
    supabase = get_supabase()
    response = supabase.table("tests").select("*").eq("is_published", True).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.get("/tests/{id}", tags=["Tests"])
def get_test(id: str):
    supabase = get_supabase()
    response = supabase.table("tests").select("*").eq("id", id).single().execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Test not found")
    return response.data

@router.post("/tests", status_code=status.HTTP_201_CREATED, tags=["Tests"])
def create_test(test: TestCreate, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    data = test.dict()
    response = supabase.table("tests").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création du test")
    return response.data[0]

@router.put("/tests/{id}", tags=["Tests"])
def update_test(id: str, test: TestCreate, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    data = test.dict(exclude_unset=True)
    response = supabase.table("tests").update(data).eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Test not found or not updated")
    return response.data[0]

@router.delete("/tests/{id}", tags=["Tests"])
def delete_test(id: str, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    response = supabase.table("tests").delete().eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Test not found or not deleted")
    return {"success": True, "test": response.data[0]}