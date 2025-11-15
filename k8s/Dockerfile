# Dockerfile para la aplicación de Apertura de Cuenta
FROM node:16-alpine as build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Generar env.js y construir la aplicación
RUN npm run generate-env && npm run build

# Imagen de producción con nginx
FROM nginx:alpine

# Copiar los archivos construidos al nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY k8s/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

