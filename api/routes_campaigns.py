
from fastapi import APIRouter, Depends
from core.database import SessionLocal
from core.models import Campaign
from auth.dependencies import require_client

router = APIRouter(prefix="/campaigns", tags=["Campanhas"])

@router.get("/", dependencies=[Depends(require_client)])
def listar_campanhas(data = Depends(require_client)):
    db = SessionLocal()
    tenant = data["tenant"]
    return db.query(Campaign).filter(Campaign.tenant_id == tenant.id).all()

@router.post("/criar")
def criar_campanha(nome: str, data = Depends(require_client)):
    db = SessionLocal()
    tenant = data["tenant"]
    campanha = Campaign(nome=nome, status="rascunho", tenant_id=tenant.id)
    db.add(campanha)
    db.commit()
    return {"mensagem": "Campanha criada.", "campanha_id": campanha.id}
