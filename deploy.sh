#!/bin/bash
# ============================================================
# Orion Growth Studio - Deploy Script
# VPS: 148.230.76.111 | Ubuntu 24.04 + Caddy
# ============================================================

set -e

echo "🚀 Iniciando deploy do Orion Growth Studio..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
APP_NAME="studio-app"
APP_DIR="/opt/studio-app"
DATA_DIR="/data/studio-app"
DOMAIN="studio-app.orionconsultoria.cloud"
REPO_URL="https://github.com/orionrepresent-dev/Orion-Growth-System.git"
REPO_BRANCH="main"

# ============================================================
# 1. Criar diretórios
# ============================================================
echo -e "${YELLOW}📁 Criando diretórios...${NC}"
mkdir -p $APP_DIR
mkdir -p $DATA_DIR
chmod 755 $DATA_DIR

# ============================================================
# 2. Clonar ou atualizar repositório
# ============================================================
echo -e "${YELLOW}📥 Clonando/atualizando código...${NC}"
if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    git pull origin $REPO_BRANCH
else
    rm -rf $APP_DIR/*
    git clone -b $REPO_BRANCH $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# ============================================================
# 3. Verificar rede Caddy
# ============================================================
echo -e "${YELLOW}🌐 Verificando rede Caddy...${NC}"
if ! docker network ls | grep -q "caddy"; then
    echo -e "${RED}Erro: Rede 'caddy' não encontrada!${NC}"
    echo "Criando rede caddy..."
    docker network create caddy
fi

# ============================================================
# 4. Criar arquivo .env (se não existir)
# ============================================================
if [ ! -f "$APP_DIR/.env" ]; then
    echo -e "${YELLOW}📝 Criando arquivo .env...${NC}"
    cat > $APP_DIR/.env << 'EOF'
# Orion Growth Studio - Environment Variables
NODE_ENV=production

# Resend (Email)
RESEND_API_KEY=re_sua_chave_aqui
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=pablo@orionconsultoria.com.br

# Z-API (WhatsApp)
ZAPI_INSTANCE=sua_instancia
ZAPI_TOKEN=seu_token
EOF
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edite o arquivo .env com suas chaves reais!${NC}"
    echo "   Arquivo: $APP_DIR/.env"
fi

# ============================================================
# 5. Build e deploy com Docker Compose
# ============================================================
echo -e "${YELLOW}🔨 Building imagem Docker...${NC}"
cd $APP_DIR
docker compose build --no-cache

echo -e "${YELLOW}🚀 Iniciando container...${NC}"
docker compose down 2>/dev/null || true
docker compose up -d

# ============================================================
# 6. Configurar Caddy
# ============================================================
echo -e "${YELLOW}🔧 Configurando Caddy...${NC}"

CADDYFILE="/opt/caddy/Caddyfile"
if [ -f "$CADDYFILE" ]; then
    # Verificar se já existe a configuração
    if ! grep -q "$DOMAIN" "$CADDYFILE"; then
        echo -e "${YELLOW}Adicionando configuração ao Caddyfile...${NC}"
        cat >> "$CADDYFILE" << EOF

# Orion Growth Studio
$DOMAIN {
    reverse_proxy studio-app:3000
}
EOF
        # Recarregar Caddy
        docker exec orion-caddy caddy reload --config /etc/caddy/Caddyfile
        echo -e "${GREEN}✅ Caddy configurado!${NC}"
    else
        echo -e "${GREEN}✅ Caddy já configurado para $DOMAIN${NC}"
    fi
else
    echo -e "${RED}⚠️  Caddyfile não encontrado em $CADDYFILE${NC}"
    echo "Adicione manualmente:"
    echo ""
    echo "$DOMAIN {"
    echo "    reverse_proxy studio-app:3000"
    echo "}"
fi

# ============================================================
# 7. Verificar status
# ============================================================
echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo "📊 Status:"
docker ps --filter "name=studio-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🌐 URL: https://$DOMAIN"
echo "📁 Dados: $DATA_DIR"
echo "⚙️  Config: $APP_DIR/.env"
echo ""
echo "Comandos úteis:"
echo "  Logs:     docker logs studio-app -f"
echo "  Restart:  docker compose -f $APP_DIR/docker-compose.yml restart"
echo "  Update:   cd $APP_DIR && git pull && docker compose up -d --build"
