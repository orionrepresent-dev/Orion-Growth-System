from fastapi import APIRouter, Depends
from app.auth import get_current_user

router = APIRouter()

@router.get("/")
def list_runs(user=Depends(get_current_user)):
    return {"message": "Runs ok", "user": user}

@router.post("/")
def create_run(payload: dict, user=Depends(get_current_user)):
    return {"status": "created", "payload": payload, "user": user}
