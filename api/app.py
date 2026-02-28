
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth.auth_routes import router as auth_router
from auth.middleware import MultiTenantMiddleware

from api.routes_tenants import router as tenants_router
from api.routes_users import router as users_router
from api.routes_campaigns import router as campaigns_router
from api.routes_system import router as system_router
from api.whatsapp_webhook import router as whatsapp_router

from core.init_db import init_db

app = FastAPI(
    title="ORION SaaS API",
    description="Plataforma de automação Ads multi-tenant.",
    version="1.0.0"
)

init_db()

app.middleware("http")(MultiTenantMiddleware())

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tenants_router)
app.include_router(users_router)
app.include_router(campaigns_router)
app.include_router(system_router)
app.include_router(whatsapp_router)

@app.get("/")
def raiz():
    return {"mensagem": "ORION SaaS API ativa"}
