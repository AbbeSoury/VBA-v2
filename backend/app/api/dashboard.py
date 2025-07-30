from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any

router = APIRouter()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"user_id": credentials.credentials}

@router.get("/dashboard/overview", tags=["Dashboard"])
def dashboard_overview(user=Depends(get_current_user)) -> Dict[str, Any]:
    # Simulé, à remplacer par la vraie logique
    return {
        "progress": 75,
        "average_score": 88,
        "deadlines": ["2024-07-01", "2024-07-15"]
    }

@router.get("/dashboard/activity", tags=["Dashboard"])
def dashboard_activity(user=Depends(get_current_user)) -> Dict[str, Any]:
    # Simulé, à remplacer par la vraie logique
    return {
        "recent_submissions": [
            {"id": "sub1", "date": "2024-06-01"},
            {"id": "sub2", "date": "2024-06-02"}
        ]
    }