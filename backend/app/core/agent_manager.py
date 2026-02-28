from typing import Dict, Any
import requests
import os

N8N_WEBHOOK_URL = os.getenv(
    "N8N_WEBHOOK_URL",
    "http://n8n:5678/webhook/orion-execute-agent"
)

class AgentManager:

    @staticmethod
    def execute_agent(agent_name: str, payload: Dict[str, Any], user_id: int):

        data = {
            "agent": agent_name,
            "user_id": user_id,
            "payload": payload
        }

        try:
            response = requests.post(
                N8N_WEBHOOK_URL,
                json=data,
                timeout=120
            )

            return {
                "success": True,
                "status_code": response.status_code,
                "result": response.json() if response.content else {}
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
