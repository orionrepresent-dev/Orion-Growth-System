from datetime import datetime


class AgentResult:

    def __init__(self, content: str):

        self.content = content

        self.created_at = datetime.utcnow()


class GrowthStrategistAgent:

    name = "growth_strategist"

    def run(self, briefing_content: str):

        roadmap = f"""
ORION GROWTH ROADMAP

Generated: {datetime.utcnow()}

BRIEFING ANALYSIS:
{briefing_content}

STRATEGY:

1. Define ICP precisely
2. Identify acquisition channels
3. Deploy paid acquisition tests
4. Build organic acquisition engine
5. Automate conversion funnels
6. Optimize retention

EXECUTION PLAN:

Phase 1 — Validation
Phase 2 — Acquisition
Phase 3 — Scale
Phase 4 — Automation

"""

        return AgentResult(roadmap)


class AgentEngine:

    def __init__(self):

        self.agents = {

            "growth": GrowthStrategistAgent(),

        }

    def select_agent(self, briefing_content: str):

        return self.agents["growth"]

    def run(self, briefing_content: str):

        agent = self.select_agent(briefing_content)

        result = agent.run(briefing_content)

        return result


engine = AgentEngine()
