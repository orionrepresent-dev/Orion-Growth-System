
from auth.jwt_handler import verificar_token
from fastapi import Request

class MultiTenantMiddleware:
    async def __call__(self, request: Request, call_next):
        token = request.headers.get("Authorization")
        if token and token.startswith("Bearer"):
            token = token.replace("Bearer ", "")
            payload = verificar_token(token)
            if payload:
                request.state.tenant_id = payload.get("tenant_id")
                request.state.user_role = payload.get("role")
        return await call_next(request)
