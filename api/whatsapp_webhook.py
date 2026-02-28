
from fastapi import APIRouter, Request
from config.settings import settings
from core.orchestrator import Orchestrator
from core.responder import Responder

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])

@router.get("/webhook")
def verificar_token(mode: str = None, token: str = None, challenge: str = None):
    if token == settings.WHATSAPP_VERIFY_TOKEN:
        return int(challenge or 0)
    return {"status": "erro", "motivo": "token inválido"}

@router.post("/webhook")
async def receber_mensagem(request: Request):
    data = await request.json()
    try:
        mensagem = data["entry"][0]["changes"][0]["value"]["messages"][0]
        texto = mensagem.get("text", {}).get("body")
        numero = mensagem["from"]
        tenant_id = "orion"
        orc = Orchestrator(tenant_id)
        resposta_ia = orc.processar_comando(texto)
        responder = Responder(tenant_id)
        responder.enviar(numero, resposta_ia)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "erro", "detalhes": str(e)}
