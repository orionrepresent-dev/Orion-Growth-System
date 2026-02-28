
from fastapi import APIRouter, Depends
from core.database import SessionLocal
from core.models import User
from utils.security import gerar_hash
from auth.dependencies import get_current_user, require_master

router = APIRouter(prefix="/users", tags=["Usuários"])

@router.get("/", dependencies=[Depends(require_master)])
def listar_usuarios():
    db = SessionLocal()
    return db.query(User).all()

@router.post("/criar")
def criar_usuario(email: str, senha: str, data = Depends(get_current_user)):
    db = SessionLocal()
    tenant = data["tenant"]
    novo = User(
        email=email,
        senha_hash=gerar_hash(senha),
        role="client",
        tenant_id=tenant.id
    )
    db.add(novo)
    db.commit()
    return {"mensagem": "Usuário criado com sucesso."}
