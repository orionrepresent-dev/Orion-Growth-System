# Configuração de DNS - Vercel + Hostinger

## O Problema

Você está com conflito de DNS porque o registro CNAME atual para `www` está apontando para `orionconsultoria.cloud` ao invés de apontar para o Vercel.

## Solução Passo a Passo

### Passo 1: Acesse o painel da Hostinger

1. Faça login em: https://hpanel.hostinger.com
2. Vá em **Domínios** → **orionconsultoria.cloud**
3. Clique em **DNS / Zona DNS**

### Passo 2: Remova o registro CNAME conflitante

Localize e **DELETE** o registro:
```
Tipo: CNAME
Nome: www
Valor: orionconsultoria.cloud
```

### Passo 3: Adicione os registros corretos para o Vercel

**Registro A (para o domínio raiz):**
```
Tipo: A
Nome: @
Valor: 76.76.21.21
TTL: 3600
```

**Registro CNAME (para www):**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

### Passo 4: Configure no Vercel

1. Acesse: https://vercel.com/dashboard
2. Vá no seu projeto
3. Clique em **Settings** → **Domains**
4. Adicione o domínio: `orionconsultoria.cloud`
5. Adicione também: `www.orionconsultoria.cloud`
6. O Vercel vai detectar que os DNS estão corretos e validar

### Passo 5: Aguarde a propagação

- A propagação DNS pode levar de 5 minutos a 48 horas
- Normalmente em 10-30 minutos já está funcionando
- Você pode testar com: `nslookup orionconsultoria.cloud`

## Resumo Visual

| Tipo | Nome | Valor |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

## Comandos para Verificar

```bash
# Verificar se o DNS está apontando para o Vercel
nslookup orionconsultoria.cloud
nslookup www.orionconsultoria.cloud

# Deve retornar:
# orionconsultoria.cloud -> 76.76.21.21
# www.orionconsultoria.cloud -> aponta para cname.vercel-dns.com
```

## Possíveis Erros

### "Conflicting DNS Records"

Se o Vercel mostrar erro de conflito:
1. Vá na Hostinger e remova TODOS os registros A e CNAME existentes para @ e www
2. Adicione apenas os registros listados acima
3. Aguarde 5-10 minutos
4. Tente adicionar o domínio novamente no Vercel

### "DNS Propagation Pending"

Isso é normal! Apenas aguarde a propagação. O Vercel vai mostrar isso enquanto os servidores DNS ao redor do mundo não atualizarem.

## Contato

Se precisar de ajuda adicional:
- Suporte Vercel: https://vercel.com/support
- Suporte Hostinger: https://www.hostinger.com.br/contato
