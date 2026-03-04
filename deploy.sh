#!/bin/bash
# =====================================================
# ORION GROWTH STUDIO - DEPLOY AUTOMÁTICO
# Friendly Automation Edition
# =====================================================

set -e

echo "🚀 Iniciando deploy do Orion Growth Studio..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
DOMAIN="${1:-studio-app.orionconsultoria.cloud}"
EMAIL="${2:-pablo@orionconsultoria.com.br}"
PROJECT_DIR="/opt/orion-growth-studio"
GITHUB_REPO="https://github.com/orionrepresent-dev/Orion-Growth-System.git"

echo -e "${BLUE}📋 Configuração:${NC}"
echo "   Domínio: $DOMAIN"
echo "   Email: $EMAIL"
echo "   Diretório: $PROJECT_DIR"
echo ""

# 1. Instalar Docker se necessário
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}✅ Docker instalado!${NC}"
else
    echo -e "${GREEN}✅ Docker já instalado${NC}"
fi

# 2. Criar rede Caddy se não existir
if ! docker network inspect caddy &> /dev/null; then
    echo -e "${YELLOW}🌐 Criando rede Caddy...${NC}"
    docker network create caddy
    echo -e "${GREEN}✅ Rede Caddy criada!${NC}"
else
    echo -e "${GREEN}✅ Rede Caddy já existe${NC}"
fi

# 3. Criar diretório do projeto
echo -e "${YELLOW}📁 Preparando diretório...${NC}"
mkdir -p $PROJECT_DIR
mkdir -p /data/studio-app

# 4. Clonar ou atualizar repositório
if [ -d "$PROJECT_DIR/.git" ]; then
    echo -e "${YELLOW}📥 Atualizando repositório...${NC}"
    cd $PROJECT_DIR
    git pull origin master
else
    echo -e "${YELLOW}📥 Clonando repositório...${NC}"
    rm -rf $PROJECT_DIR/*
    git clone $GITHUB_REPO $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 5. Criar Caddyfile com SSL automático
echo -e "${YELLOW}🔧 Configurando Caddy com SSL...${NC}"
cat > /opt/Caddyfile << EOF
{
    email $EMAIL
    acme_ca https://acme-v02.api.letsencrypt.org/directory
}

$DOMAIN {
    encode gzip

    # Logs
    log {
        output file /var/log/caddy/access.log
        format json
    }

    # Headers de segurança
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    # Proxy para a aplicação
    reverse_proxy studio-app:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
        header_up X-Forwarded-Host {host}
    }
}

# Redirecionamento www
www.$DOMAIN {
    redir https://$DOMAIN{uri} permanent
}
EOF

echo -e "${GREEN}✅ Caddyfile configurado!${NC}"

# 6. Criar .env
echo -e "${YELLOW}🔐 Configurando variáveis de ambiente...${NC}"
cat > $PROJECT_DIR/.env << EOF
NODE_ENV=production
PORT=3000
RESEND_API_KEY=re_FGq9yL9a_C5dZ62jeaF57r3NLruWHosmA
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=$EMAIL
EOF

# 7. Parar containers antigos
echo -e "${YELLOW}🛑 Parando containers antigos...${NC}"
docker compose down 2>/dev/null || true
docker stop studio-app 2>/dev/null || true
docker rm studio-app 2>/dev/null || true

# 8. Build e deploy
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
cd $PROJECT_DIR
docker compose build --no-cache

echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
docker compose up -d

# 9. Iniciar/Atualizar Caddy
echo -e "${YELLOW}🌐 Configurando Caddy (proxy reverso)...${NC}"
if docker ps | grep -q caddy; then
    echo -e "${GREEN}✅ Caddy já está rodando, recarregando configuração...${NC}"
    docker exec caddy caddy reload --config /etc/caddy/Caddyfile
else
    echo -e "${YELLOW}Iniciando Caddy...${NC}"
    docker run -d \
        --name caddy \
        --restart unless-stopped \
        --network caddy \
        -p 80:80 \
        -p 443:443 \
        -v /opt/Caddyfile:/etc/caddy/Caddyfile \
        -v /data/caddy:/data \
        -v /var/log/caddy:/var/log/caddy \
        caddy:latest
fi

# 10. Verificar status
echo ""
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}🌐 URL:${NC} https://$DOMAIN"
echo -e "${BLUE}📊 Status dos containers:${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "   1. Certifique-se que o DNS está apontando para este servidor (148.230.76.111)"
echo "   2. O SSL será configurado automaticamente pelo Caddy"
echo "   3. Pode levar alguns minutos para o certificado ser emitido"
echo ""
echo -e "${BLUE}📝 Comandos úteis:${NC}"
echo "   Ver logs: docker logs -f studio-app"
echo "   Reiniciar: docker compose restart"
echo "   Parar: docker compose down"
echo ""
