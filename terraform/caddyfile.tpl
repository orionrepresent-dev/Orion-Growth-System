{
  email ${email}
}

${app_domain} {
  reverse_proxy orion-frontend:3000
}

${api_domain} {
  reverse_proxy orion-backend:8000
}
