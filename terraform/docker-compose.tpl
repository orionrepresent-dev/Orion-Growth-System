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
