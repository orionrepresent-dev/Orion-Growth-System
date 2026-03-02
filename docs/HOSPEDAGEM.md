# 🚀 Guia de Hospedagem - Growth Business Copilot

## Opção 1: Vercel (RECOMENDADO para começar)

### Vantagens
- ✅ Grátis para começar (Hobby Plan)
- ✅ Deploy automático via GitHub
- ✅ SSL gratuito (HTTPS)
- ✅ CDN global
- ✅ Fácil configuração de domínio
- ✅ Escala automaticamente
- ✅ Preview de cada commit

### Limitações do Plano Grátis
- 100GB de banda/mês
- 100 builds/dia
- Funções serverless com limite de 10s

### Quando Upgrade para Pro (US$ 20/mês)
- Mais de 100GB banda/mês
- Funções com até 60s de execução
- Análises avançadas
- Múltiplos domínios

---

## 📋 Passo a Passo: Configurar Domínio Próprio

### 1. Comprar Domínio

**Opções no Brasil:**
| Provedor | Preço Aprox. | .com.br | .com |
|----------|--------------|---------|------|
| Registro.br | R$ 40/ano | ✅ | ❌ |
| Hostinger | R$ 30-50/ano | ✅ | ✅ |
| GoDaddy | R$ 50-80/ano | ✅ | ✅ |
| Namecheap | US$ 10-15/ano | ❌ | ✅ |

**Recomendação:** Para negócio brasileiro, use **.com.br** via Registro.br

---

### 2. Adicionar Domínio no Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto (GLM5)
3. Vá em **Settings** → **Domains**
4. Digite seu domínio: `seusite.com.br`
5. Clique **Add**

### 3. Configurar DNS no Provedor

O Vercel vai mostrar registros como:

```
Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

**No Registro.br / Hostinger:**
1. Acesse o painel do seu domínio
2. Vá em **DNS / Zona DNS**
3. Adicione os registros fornecidos pelo Vercel
4. Aguarde até 48h para propagação

---

### 4. Forçar HTTPS (Automático)

O Vercel já configura SSL automaticamente via Let's Encrypt.

---

## 🔄 Alternativa: VPS Hostinger

### Quando Usar VPS?
- Tráfego muito alto (> 10k visitantes/dia)
- Precisa de banco de dados dedicado
- Processamentos pesados de IA
- Mais controle do servidor

### Configuração VPS Hostinger

**Especificações Mínimas:**
- 2 vCPU
- 4GB RAM
- 50GB SSD
- ~R$ 30-50/mês

**Passos:**
1. Contratar VPS na Hostinger
2. Instalar Docker e Docker Compose
3. Configurar PostgreSQL
4. Fazer deploy do Next.js com PM2
5. Configurar Nginx como proxy reverso
6. Instalar Certbot para SSL

---

## 💰 Comparativo de Custos

| Opção | Custo Mensal | Quando Usar |
|-------|--------------|-------------|
| Vercel Hobby | **GRÁTIS** | Até ~5k visitas/dia |
| Vercel Pro | US$ 20 (~R$ 100) | Até ~50k visitas/dia |
| VPS Hostinger | R$ 30-80 | Controle total, alto tráfego |

---

## ✅ Checklist de Deploy

- [ ] Domínio comprado
- [ ] Projeto conectado ao GitHub
- [ ] Deploy automático funcionando no Vercel
- [ ] Domínio configurado no Vercel
- [ ] DNS propagado (até 48h)
- [ ] HTTPS funcionando
- [ ] Variáveis de ambiente configuradas:
  - [ ] `RESEND_API_KEY`
  - [ ] `EMAIL_FROM`
  - [ ] `ADMIN_EMAIL`

---

## 🌐 URLs após Deploy

- **Vercel padrão:** `https://glm5-xxx.vercel.app`
- **Com domínio:** `https://seusite.com.br`
