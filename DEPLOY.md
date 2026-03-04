# 🚀 DEPLOY - Orion Growth Studio
# Friendly Automation Edition

## OPÇÃO 1: Deploy Automático (Recomendado)

### Passo 1: Acesse a VPS via SSH
```bash
ssh root@148.230.76.111
# Senha: Pablom01@@@@
```

### Passo 2: Execute o comando de deploy
```bash
# Deploy com domínio padrão (app.oriongrowth.com.br)
curl -fsSL https://raw.githubusercontent.com/orionrepresent-dev/Orion-Growth-System/master/deploy.sh | bash

# OU com domínio personalizado
curl -fsSL https://raw.githubusercontent.com/orionrepresent-dev/Orion-Growth-System/master/deploy.sh | bash -s -- SEUDOMINIO.com.br seu@email.com
```

---

## OPÇÃO 2: Deploy Manual

### 1. Acesse a VPS
```bash
ssh root@148.230.76.111
```

### 2. Instale Docker (se necessário)
```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker && systemctl start docker
```

### 3. Crie a rede Caddy
```bash
docker network create caddy
```

### 4. Clone o projeto
```bash
mkdir -p /opt/orion-growth-studio
cd /opt/orion-growth-studio
git clone https://github.com/orionrepresent-dev/Orion-Growth-System.git .
```

### 5. Configure o .env
```bash
cat > .env << EOF
NODE_ENV=production
PORT=3000
RESEND_API_KEY=re_FGq9yL9a_C5dZ62jeaF57r3NLruWHosmA
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=pablo@orionconsultoria.com.br
EOF
```

### 6. Configure o Caddyfile
```bash
cat > /opt/Caddyfile << 'EOF'
{
    email pablo@orionconsultoria.com.br
}

SEUDOMINIO.com.br {
    encode gzip
    reverse_proxy studio-app:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }
}
EOF
```

### 7. Build e Deploy
```bash
cd /opt/orion-growth-studio
docker compose build
docker compose up -d
```

### 8. Inicie o Caddy
```bash
docker run -d \
    --name caddy \
    --restart unless-stopped \
    --network caddy \
    -p 80:80 \
    -p 443:443 \
    -v /opt/Caddyfile:/etc/caddy/Caddyfile \
    -v /data/caddy:/data \
    caddy:latest
```

---

## 🌐 DNS - Configuração Necessária

Configure um registro A no seu provedor de DNS:

```
Tipo: A
Nome: app (ou @ para raiz)
Valor: 148.230.76.111
TTL: 300 (ou automático)
```

Exemplo para app.oriongrowth.com.br:
```
A    app    148.230.76.111
```

---

## ✅ Verificar Deploy

### Status dos containers
```bash
docker ps
```

### Logs da aplicação
```bash
docker logs -f studio-app
```

### Logs do Caddy
```bash
docker logs -f caddy
```

---

## 🔧 Comandos Úteis

| Ação | Comando |
|------|---------|
| Ver status | `docker ps` |
| Ver logs | `docker logs -f studio-app` |
| Reiniciar | `docker compose restart` |
| Parar | `docker compose down` |
| Atualizar | `git pull && docker compose build && docker compose up -d` |

---

## 🆘 Troubleshooting

### Erro de DNS
Certifique-se que o domínio está apontando para 148.230.76.111

### SSL não funciona
Aguarde alguns minutos. O Caddy emite certificados automaticamente.

### Container não inicia
```bash
docker logs studio-app
```

### Porta ocupada
```bash
netstat -tlnp | grep -E '80|443|3000'
```
