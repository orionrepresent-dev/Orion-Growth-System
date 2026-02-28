
from fastapi import APIRouter

router = APIRouter(prefix="/system", tags=["Sistema"])

@router.get("/health")
def health_check():
    return {"status": "ok"}
