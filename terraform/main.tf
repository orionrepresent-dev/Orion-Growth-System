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
