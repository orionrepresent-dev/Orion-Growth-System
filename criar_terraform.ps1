# Criar diretório terraform
$path = "terraform"
if (-Not (Test-Path $path)) {
    New-Item -ItemType Directory -Path $path | Out-Null
}

# Criar main.tf
@'
terraform {
  required_providers {
    ssh = {
      source  = "loafoe/ssh"
      version = "2.6.0"
    }
  }
}

provider "ssh" {
  host     = var.server_host
  user     = "root"
  password = var.server_password
}

resource "ssh_file" "docker_compose" {
  path        = "/opt/orion/docker-compose.yml"
  permissions = "0644"
  content     = templatefile("${path.module}/docker-compose.tpl", {
    api_domain = var.api_domain
    app_domain = var.app_domain
    repo_owner = var.repo_owner
  })
}

resource "ssh_file" "caddyfile" {
  path        = "/opt/orion/Caddyfile"
  permissions = "0644"
  content     = templatefile("${path.module}/caddyfile.tpl", {
    api_domain = var.api_domain
    app_domain = var.app_domain
    email      = var.caddy_email
  })
}

resource "ssh_command" "deploy" {
  command = <<EOT
mkdir -p /opt/orion
docker compose -f /opt/orion/docker-compose.yml down
docker compose -f /opt/orion/docker-compose.yml up -d --build
EOT
  depends_on = [ssh_file.docker_compose, ssh_file.caddyfile]
}
'@ | Set-Content "$path/main.tf"

# Criar variables.tf
@'
variable "server_host" {
  description = "Hostname ou IP da VPS"
  type        = string
}

variable "server_password" {
  description = "Senha SSH do root"
  type        = string
}

variable "repo_owner" {
  description = "Owner do repositório GitHub"
  type        = string
}

variable "api_domain" {
  description = "Domínio da API"
  type        = string
  default     = "api.oriongrowthstudio.cloud"
}

variable "app_domain" {
  description = "Domínio do frontend"
  type        = string
  default     = "app.oriongrowthstudio.cloud"
}

variable "caddy_email" {
  description = "Email para certificados HTTPS"
  type        = string
  default     = "admin@oriongrowthstudio.cloud"
}
'@ | Set-Content "$path/variables.tf"

# Criar outputs.tf
@'
output "server_host" {
  description = "Host configurado"
  value       = var.server_host
}

output "api_domain" {
  description = "Domínio da API configurado"
  value       = var.api_domain
}

output "app_domain" {
  description = "Domínio do frontend"
  value       = var.app_domain
}
'@ | Set-Content "$path/outputs.tf"

# Criar docker-compose.tpl
@'
services:
  caddy:
    image: caddy:2
    container_name: orion-caddy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - orion

  backend:
    image: ghcr.io/${repo_owner}/orion-backend:latest
    container_name: orion-backend
    restart: always
    env_file:
      - /opt/orion/.env
    networks:
      - orion

  frontend:
    image: ghcr.io/${repo_owner}/orion-frontend:latest
    container_name: orion-frontend
    restart: always
    networks:
      - orion

networks:
  orion:

volumes:
  caddy_data:
  caddy_config:
'@ | Set-Content "$path/docker-compose.tpl"

# Criar caddyfile.tpl
@'
{
  email ${email}
}

${app_domain} {
  reverse_proxy orion-frontend:3000
}

${api_domain} {
  reverse_proxy orion-backend:8000
}
'@ | Set-Content "$path/caddyfile.tpl"

Write-Host "Arquivos Terraform criados com sucesso!"