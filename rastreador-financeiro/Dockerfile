# ---------- Etapa 1: build do React ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build
 
# ---------- Etapa 2: nginx servindo os arquivos estáticos ----------
FROM nginx:1.27-alpine
# O nginx substitui ${PORT} no template ao iniciar (Render/Railway injetam PORT)
ENV PORT=80
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
 