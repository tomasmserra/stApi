# Configuración de Kubernetes para Apertura de Cuenta

Esta carpeta contiene todas las configuraciones necesarias para desplegar la aplicación de Apertura de Cuenta en MicroK8s.

## Requisitos Previos

1. **MicroK8s instalado y corriendo**
   ```bash
   snap install microk8s --classic
   sudo usermod -a -G microk8s $USER
   newgrp microk8s
   microk8s status --wait-ready
   ```

2. **Docker, buildah, o podman instalado** (opcional, para construir la imagen de contenedor)
   
   **Nota importante:** MicroK8s usa **containerd** directamente para ejecutar contenedores, NO Docker. 
   Docker solo se necesita para **construir** imágenes de contenedor. Tu aplicación Java corre con containerd.
   
   El script `deploy-k8s.sh` es inteligente:
   - Si hay Docker/buildah/podman en el servidor remoto, construirá la imagen ahí
   - Si NO hay Docker en el servidor, construirá la imagen localmente (si tienes Docker instalado) 
     y la subirá al servidor
   
   **Opciones:**
   
   **Opción A: Instalar Docker en el servidor** (si prefieres construir en el servidor):
   ```bash
   ssh sistemas@st-app
   sudo apt update
   sudo apt install docker.io
   sudo systemctl enable docker
   sudo systemctl start docker
   sudo usermod -aG docker sistemas
   ```
   
   **Opción B: No instalar Docker en el servidor** (si tienes Docker localmente):
   - El script construirá la imagen localmente y la subirá automáticamente
   - **Importante:** Si construyes en Mac M1/M2 (ARM64), el script automáticamente
     construirá para `linux/amd64` (x86_64) que es la arquitectura del servidor
   - No necesitas instalar nada en el servidor

3. **Habilitar addons necesarios en MicroK8s:**
   ```bash
   microk8s enable ingress
   microk8s enable cert-manager
   ```

## Estructura de Archivos

- `Dockerfile` - Configuración para construir la imagen Docker
- `nginx.conf` - Configuración de Nginx para servir la aplicación SPA
- `deployment.yaml` - Configuración del Deployment de Kubernetes
- `service.yaml` - Configuración del Service de Kubernetes
- `ingress.yaml` - Configuración del Ingress con SSL/TLS
- `cert-manager-issuer.yaml` - Configuración de Let's Encrypt para certificados SSL
- `configmap-env.yaml` - Variables de entorno (puedes modificar las URLs aquí)
- `deploy-site.sh` - Script para construir y subir archivos al servidor remoto
- `deploy-k8s.sh` - Script automatizado de despliegue completo en Kubernetes
- `.dockerignore` - Archivos a excluir del build Docker

## Despliegue

### Opción 1: Solo construir y subir archivos (sin Kubernetes)

Si solo quieres construir la aplicación y subir los archivos al servidor:

1. **Haz el script ejecutable:**
   ```bash
   chmod +x k8s/deploy-site.sh
   ```

2. **Ejecuta el script:**
   ```bash
   ./k8s/deploy-site.sh
   ```

Este script:
- Instala dependencias si es necesario
- Genera el archivo `env.js` para producción
- Construye la aplicación React (`npm run build`)
- Sube todos los archivos al servidor remoto (`sistemas@st-app:/data/st/apertura`)

### Opción 2: Script Automatizado Completo (Kubernetes)

**Importante:** Este script requiere que primero ejecutes `deploy-site.sh` para subir los archivos al servidor.

1. **Primero, sube los archivos al servidor:**
   ```bash
   ./k8s/deploy-site.sh
   ```

2. **Edita el email en `cert-manager-issuer.yaml`:**
   ```yaml
   email: admin@stsecurities.com.ar  # Cambia por tu email
   ```

3. **Haz el script ejecutable:**
   ```bash
   chmod +x k8s/deploy-k8s.sh
   ```

4. **Ejecuta el script de despliegue en Kubernetes:**
   ```bash
   ./k8s/deploy-k8s.sh
   ```

Este script:
- Utiliza los archivos que ya están en `/data/st/apertura` (subidos con `deploy-site.sh`)
- Construye la imagen Docker
- Despliega la aplicación en MicroK8s

### Opción 3: Despliegue Manual

1. **Construir la imagen Docker:**
   ```bash
   docker build -t apertura:latest -f k8s/Dockerfile .
   ```

2. **Exportar la imagen a MicroK8s:**
   ```bash
   docker save apertura:latest | microk8s ctr image import -
   ```

3. **Aplicar las configuraciones:**
   ```bash
   microk8s kubectl apply -f k8s/configmap-env.yaml
   microk8s kubectl apply -f k8s/deployment.yaml
   microk8s kubectl apply -f k8s/service.yaml
   microk8s kubectl apply -f k8s/cert-manager-issuer.yaml
   microk8s kubectl apply -f k8s/ingress.yaml
   ```

## Configuración de DNS

Para que el certificado SSL funcione correctamente, asegúrate de que el dominio `apertura.stsecurities.com.ar` apunte a la IP de tu servidor MicroK8s.

1. Obtén la IP del servidor:
   ```bash
   hostname -I | awk '{print $1}'
   ```

2. Configura un registro A en tu DNS:
   ```
   apertura.stsecurities.com.ar  A  [IP_DEL_SERVIDOR]
   ```

## Verificación

### Ver el estado del despliegue:
```bash
microk8s kubectl get pods
microk8s kubectl get svc
microk8s kubectl get ingress
```

### Ver los logs:
```bash
microk8s kubectl logs -f deployment/apertura-deployment
```

### Verificar el certificado SSL:
```bash
microk8s kubectl get certificate
microk8s kubectl describe certificate apertura-tls
```

## Actualización de la Aplicación

Para actualizar la aplicación después de hacer cambios:

### Si solo quieres actualizar archivos (sin Kubernetes):

1. **Ejecutar el script de build y upload:**
   ```bash
   ./k8s/deploy-site.sh
   ```

### Si quieres actualizar en Kubernetes:

1. **Actualizar archivos primero (si hay cambios):**
   ```bash
   ./k8s/deploy-site.sh
   ```

2. **Desplegar en Kubernetes:**
   ```bash
   ./k8s/deploy-k8s.sh
   ```

   **O manualmente:**
   ```bash
   # Reconstruir la imagen
   docker build -t apertura:latest -f k8s/Dockerfile .
   docker save apertura:latest | microk8s ctr image import -
   
   # Reiniciar el deployment
   microk8s kubectl rollout restart deployment/apertura-deployment
   ```

## Configuración de Variables de Entorno

Para cambiar las URLs del backend, edita `configmap-env.yaml` y luego:

```bash
microk8s kubectl apply -f k8s/configmap-env.yaml
microk8s kubectl rollout restart deployment/apertura-deployment
```

**Nota:** Actualmente las variables están en el ConfigMap, pero como la aplicación usa `env.js` en tiempo de ejecución, necesitarás reconstruir la imagen si cambias las URLs.

## Troubleshooting

### El certificado SSL no se genera

1. Verifica que cert-manager esté corriendo:
   ```bash
   microk8s kubectl get pods -n cert-manager
   ```

2. Verifica los eventos del certificado:
   ```bash
   microk8s kubectl describe certificate apertura-tls
   ```

3. Verifica que el dominio apunte correctamente al servidor

### La aplicación no carga

1. Verifica que los pods estén corriendo:
   ```bash
   microk8s kubectl get pods
   ```

2. Verifica los logs:
   ```bash
   microk8s kubectl logs deployment/apertura-deployment
   ```

3. Verifica el servicio:
   ```bash
   microk8s kubectl describe svc apertura-service
   ```

### Ingress no funciona

1. Verifica que ingress esté habilitado:
   ```bash
   microk8s status
   ```

2. Verifica los pods de ingress:
   ```bash
   microk8s kubectl get pods -n ingress
   ```

3. Verifica la IP del ingress:
   ```bash
   microk8s kubectl get ingress -o wide
   ```

## Eliminación

Para eliminar completamente el despliegue:

```bash
microk8s kubectl delete -f k8s/
```

## Notas Importantes

1. **Email en cert-manager:** Debes editar `cert-manager-issuer.yaml` y cambiar el email antes de aplicar.

2. **Dominio:** Asegúrate de que `apertura.stsecurities.com.ar` apunte correctamente a tu servidor.

3. **CORS:** Asegúrate de que el backend en `https://api.stsecurities.com.ar` permita solicitudes desde `https://apertura.stsecurities.com.ar`.

4. **Recursos:** Los límites de recursos en `deployment.yaml` son ejemplos. Ajústalos según las necesidades de tu servidor.

