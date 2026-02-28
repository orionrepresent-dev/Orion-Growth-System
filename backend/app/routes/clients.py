from fastapi import APIRouter, Depends
from app.auth import get_current_user

router = APIRouter()

@router.get("/")
def list_clients(user=Depends(get_current_user)):
    return {"clients": [], "user": user}
