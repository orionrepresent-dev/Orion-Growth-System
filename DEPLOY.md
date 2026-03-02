# Guia de Deploy - SaaS SEO/AEO/GEO Platform

## 🚀 Opção 1: Vercel (Recomendado para Next.js)

### Via GitHub (Mais Fácil)
1. Crie um repositório no GitHub
2. Suba o código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
3. Acesse https://vercel.com
4. Clique em "New Project" → Importe o repositório
5. Deploy automático!

### Via CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🐳 Opção 2: Docker

### Build e Run
```bash
docker build -t seo-saas .
docker run -p 3000:3000 seo-saas
```

## ☁️ Opção 3: Outras Plataformas

### Railway
```bash
npm i -g railway
railway login
railway init
railway up
```

### Render
1. Acesse https://render.com
2. Crie um novo Web Service
3. Conecte seu repositório
4. Configure:
   - Build Command: `npm run build`
   - Start Command: `npm start`

## 📦 Variáveis de Ambiente

Crie um arquivo `.env` com:
```
# Opcional - para funcionalidades adicionais
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=...
```

## ✅ Teste Local

O servidor de desenvolvimento já está rodando:
- URL: http://localhost:3000
- Rotas: /, /analyze, /results, /builder
