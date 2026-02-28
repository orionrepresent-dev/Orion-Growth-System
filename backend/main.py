import os
from datetime import datetime, timedelta
from typing import Optional, Any

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from .agents.engine import engine as orion_engine

# =========================
# Load env
# =========================

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://orion:orionpass@postgres:5432/oriondb",
)

JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_THIS_TO_LONG_RANDOM_SECRET")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "https://app.oriongrowthstudio.cloud")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# =========================
# App
# =========================

app = FastAPI(title="Orion Growth Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in CORS_ORIGINS.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Database
# =========================

db_engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=db_engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# Security
# =========================

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
security = HTTPBearer()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=ALGORITHM,
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise credentials_exception

    return user


# =========================
# Models
# =========================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(320), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# Mantido por compatibilidade com o frontend atual (Client = antigo "projeto")
class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Briefing(Base):
    __tablename__ = "briefings"

    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Run(Base):
    __tablename__ = "runs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    run_type = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("runs.id"), nullable=False)
    agent_name = Column(String(100), nullable=False)
    level = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    payload = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True)
    briefing_id = Column(Integer, ForeignKey("briefings.id"), nullable=False)
    run_id = Column(Integer, ForeignKey("runs.id"), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# =========================
# Schemas
# =========================

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ClientCreate(BaseModel):
    name: str


class ProjectCreate(BaseModel):
    name: str


class BriefingCreate(BaseModel):
    client_id: Optional[int] = None
    project_id: Optional[int] = None
    content: str


class RoadmapCreate(BaseModel):
    briefing_id: int
    content: str


class RunCreate(BaseModel):
    run_type: str
    briefing_id: int


# =========================
# Auth routes
# =========================

@app.post("/auth/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
    )

    db.add(user)
    db.commit()

    return {"message": "User created"}


@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})

    return {"access_token": token, "token_type": "bearer"}


# =========================
# Clients (compat)
# =========================

@app.post("/clients")
def create_client(
    payload: ClientCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    client = Client(name=payload.name, user_id=user.id)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


# =========================
# Projects (novo)
# =========================

@app.get("/projects")
def list_projects(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return db.query(Project).filter(Project.user_id == user.id).order_by(Project.id.desc()).all()


@app.post("/projects")
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    project = Project(name=payload.name, user_id=user.id)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


# =========================
# Briefings
# =========================

@app.post("/briefings")
def create_briefing(
    payload: BriefingCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.client_id is not None:
        client = db.query(Client).filter(Client.id == payload.client_id, Client.user_id == user.id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

    if payload.project_id is not None:
        project = db.query(Project).filter(Project.id == payload.project_id, Project.user_id == user.id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

    briefing = Briefing(
        client_id=payload.client_id,
        project_id=payload.project_id,
        content=payload.content,
    )

    db.add(briefing)
    db.commit()
    db.refresh(briefing)
    return briefing


# =========================
# Roadmaps
# =========================

@app.post("/roadmaps")
def create_roadmap(
    payload: RoadmapCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    briefing = db.query(Briefing).filter(Briefing.id == payload.briefing_id).first()
    if not briefing:
        raise HTTPException(status_code=404, detail="Briefing not found")

    if briefing.client_id is not None:
        client = db.query(Client).filter(Client.id == briefing.client_id, Client.user_id == user.id).first()
        if not client:
            raise HTTPException(status_code=403, detail="Forbidden")

    if briefing.project_id is not None:
        project = db.query(Project).filter(Project.id == briefing.project_id, Project.user_id == user.id).first()
        if not project:
            raise HTTPException(status_code=403, detail="Forbidden")

    roadmap = Roadmap(briefing_id=payload.briefing_id, content=payload.content)

    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)
    return roadmap


# =========================
# Runs & Logs
# =========================

def _create_log(db: Session, run_id: int, agent_name: str, level: str, message: str, payload: Optional[Any] = None):
    log = AgentLog(
        run_id=run_id,
        agent_name=agent_name,
        level=level,
        message=message,
        payload=None if payload is None else str(payload),
    )
    db.add(log)
    db.commit()


def generate_roadmap_task(run_id: int, briefing_id: int):
    db = SessionLocal()
    try:
        run = db.query(Run).filter(Run.id == run_id).first()
        if not run:
            return

        run.status = "running"
        run.updated_at = datetime.utcnow()
        db.commit()

        _create_log(db, run_id, "ORION_CORE", "INFO", f"Starting roadmap generation (run_id={run_id})")

        briefing = db.query(Briefing).filter(Briefing.id == briefing_id).first()
        if not briefing:
            raise Exception("Briefing not found")

        _create_log(db, run_id, "GROWTH_AGENT", "INFO", "Generating roadmap from briefing")

        result = orion_engine.run(briefing.content)

        roadmap = Roadmap(
            briefing_id=briefing.id,
            run_id=run_id,
            content=getattr(result, "content", str(result)),
        )

        db.add(roadmap)

        run.status = "done"
        run.updated_at = datetime.utcnow()
        db.commit()

        _create_log(db, run_id, "ORION_CORE", "INFO", "Roadmap generation completed")

    except Exception as e:
        run = db.query(Run).filter(Run.id == run_id).first()
        if run:
            run.status = "failed"
            run.updated_at = datetime.utcnow()
            db.commit()
        _create_log(db, run_id, "ORION_CORE", "ERROR", f"Generation failed: {str(e)}")
    finally:
        db.close()


@app.post("/projects/{project_id}/runs")
def create_run(
    project_id: int,
    payload: RunCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    briefing = db.query(Briefing).filter(Briefing.id == payload.briefing_id).first()
    if not briefing:
        raise HTTPException(status_code=404, detail="Briefing not found")

    if briefing.project_id != project_id:
        raise HTTPException(status_code=400, detail="Briefing is not linked to this project (project_id mismatch)")

    run = Run(project_id=project_id, run_type=payload.run_type, status="pending")
    db.add(run)
    db.commit()
    db.refresh(run)

    _create_log(db, run.id, "ORION_CORE", "INFO", f"Run created: type={payload.run_type}")

    if payload.run_type == "roadmap_generate":
        background_tasks.add_task(generate_roadmap_task, run.id, payload.briefing_id)
        return {"run_id": run.id, "status": "queued"}

    return {"run_id": run.id, "status": "created"}


@app.get("/runs/{run_id}")
def get_run(
    run_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    run = (
        db.query(Run)
        .join(Project, Project.id == Run.project_id)
        .filter(Run.id == run_id, Project.user_id == user.id)
        .first()
    )
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


@app.get("/runs/{run_id}/logs")
def get_run_logs(
    run_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    run = (
        db.query(Run)
        .join(Project, Project.id == Run.project_id)
        .filter(Run.id == run_id, Project.user_id == user.id)
        .first()
    )
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    return (
        db.query(AgentLog)
        .filter(AgentLog.run_id == run_id)
        .order_by(AgentLog.created_at.asc())
        .all()
    )
@app.get("/runs/{run_id}/roadmap")
def get_run_roadmap(
    run_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    run = (
        db.query(Run)
        .join(Project, Project.id == Run.project_id)
        .filter(Run.id == run_id, Project.user_id == user.id)
        .first()
    )
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    roadmap = db.query(Roadmap).filter(Roadmap.run_id == run_id).order_by(Roadmap.id.desc()).first()
    if not roadmap:
        return {"message": "No roadmap found for this run"}

    return roadmap

# =========================
# Agents (compat endpoint)
# =========================

@app.post("/agents/generate-roadmap/{briefing_id}")
def generate_roadmap_compat(
    briefing_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    briefing = db.query(Briefing).filter(Briefing.id == briefing_id).first()
    if not briefing:
        raise HTTPException(status_code=404, detail="Briefing not found")

    if briefing.project_id is not None:
        project = db.query(Project).filter(Project.id == briefing.project_id, Project.user_id == user.id).first()
        if not project:
            raise HTTPException(status_code=403, detail="Forbidden")

    if briefing.client_id is not None:
        client = db.query(Client).filter(Client.id == briefing.client_id, Client.user_id == user.id).first()
        if not client:
            raise HTTPException(status_code=403, detail="Forbidden")

    result = orion_engine.run(briefing.content)

    roadmap = Roadmap(
        briefing_id=briefing.id,
        content=getattr(result, "content", str(result)),
    )

    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return roadmap


# =========================
# Health
# =========================

@app.get("/health")
def health():
    return {"status": "ok", "service": "orion-backend", "time": datetime.utcnow()}


# =========================
# Startup
# =========================

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=db_engine)
    print("Backend started successfully.")
