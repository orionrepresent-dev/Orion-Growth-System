from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.runs import router as runs_router
from app.routes.agents import router as agents_router
from app.routes.projects import router as projects_router
from app.routes.briefings import router as briefings_router
from app.routes.clients import router as clients_router

app = FastAPI(title="Orion API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(runs_router, prefix="/runs", tags=["Runs"])
app.include_router(agents_router, prefix="/agents", tags=["Agents"])
app.include_router(projects_router, prefix="/projects", tags=["Projects"])
app.include_router(briefings_router, prefix="/briefings", tags=["Briefings"])
app.include_router(clients_router, prefix="/clients", tags=["Clients"])
