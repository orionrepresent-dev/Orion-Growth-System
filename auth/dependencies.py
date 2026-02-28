
from fastapi import Depends, Header, HTTPException
from auth.jwt_handler import verificar_token
from core.database import SessionLocal
from core.models import User, Tenant

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token ausente.")
    token = authorization.replace("Bearer ", "")
    payload = verificar_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido.")
    db = SessionLocal()
    user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not user or not user.ativo:
        raise HTTPException(status_code=403, detail="Usuário inválido.")
    tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first()
    return {"user": user, "tenant": tenant}

def require_master(data = Depends(get_current_user)):
    if data["user"].role != "master":
        raise HTTPException(status_code=403, detail="Apenas master.")
    return data

def require_client(data = Depends(get_current_user)):
    return data
