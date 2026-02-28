
from fastapi import APIRouter, Depends, HTTPException
from core.database import SessionLocal
from core.models import Tenant
from auth.dependencies import require_master

router = APIRouter(prefix="/tenants", tags=["Tenants"])

@router.get("/", dependencies=[Depends(require_master)])
def listar_tenants():
    db = SessionLocal()
    return db.query(Tenant).all()

@router.post("/", dependencies=[Depends(require_master)])
def criar_tenant(id: str, nome: str):
    db = SessionLocal()
    if db.query(Tenant).filter(Tenant.id == id).first():
        raise HTTPException(status_code=400, detail="Tenant já existe.")
    novo = Tenant(id=id, nome=nome)
    db.add(novo)
    db.commit()
    return {"mensagem": "Tenant criado com sucesso."}
