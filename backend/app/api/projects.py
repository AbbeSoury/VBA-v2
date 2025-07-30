from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import get_supabase
from app.schemas.project import ProjectCreate
from typing import List

router = APIRouter()

TEACHER_TOKEN = "secret-teacher-token"
security = HTTPBearer()

def get_current_teacher(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token != TEACHER_TOKEN:
        raise HTTPException(status_code=403, detail="Not authorized as teacher")
    return {"role": "teacher"}

@router.get("/projects", tags=["Projects"])
def list_projects():
    supabase = get_supabase()
    response = supabase.table("projects").select("*").eq("is_published", True).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    return response.data

@router.get("/projects/{id}", tags=["Projects"])
def get_project(id: str):
    supabase = get_supabase()
    response = supabase.table("projects").select("*").eq("id", id).single().execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return response.data

@router.post("/projects", status_code=status.HTTP_201_CREATED, tags=["Projects"])
def create_project(project: ProjectCreate, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    data = project.dict()
    response = supabase.table("projects").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création du projet")
    return response.data[0]

@router.put("/projects/{id}", tags=["Projects"])
def update_project(id: str, project: ProjectCreate, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    data = project.dict(exclude_unset=True)
    response = supabase.table("projects").update(data).eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Project not found or not updated")
    return response.data[0]

@router.delete("/projects/{id}", tags=["Projects"])
def delete_project(id: str, teacher=Depends(get_current_teacher)):
    supabase = get_supabase()
    response = supabase.table("projects").delete().eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail=str(response.error))
    if not response.data:
        raise HTTPException(status_code=404, detail="Project not found or not deleted")
    return {"success": True, "project": response.data[0]}