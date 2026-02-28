from fastapi import APIRouter, Depends
from app.auth import get_current_user

router = APIRouter()

@router.get("/")
def list_projects(user=Depends(get_current_user)):
    return {"projects": [], "user": user}

@router.post("/")
def create_project(body: dict, user=Depends(get_current_user)):
    return {"status": "created", "project": body, "user": user}
