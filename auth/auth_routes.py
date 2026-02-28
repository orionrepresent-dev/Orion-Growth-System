
from fastapi import APIRouter, HTTPException
from core.database import SessionLocal
from core.models import User
from utils.security import verificar_senha
from auth.jwt_handler import criar_access_token

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/login")
def login(email: str, senha: str):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verificar_senha(senha, user.senha_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")
    token = criar_access_token({"user_id": user.id, "tenant_id": user.tenant_id, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "tenant": user.tenant_id}
