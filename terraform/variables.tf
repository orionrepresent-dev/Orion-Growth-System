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
