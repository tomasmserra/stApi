#!/bin/bash

# Script de despliegue para MicroK8s
# Este script construye la imagen Docker y despliega la aplicación en MicroK8s
# Utiliza los archivos que ya están en /data/st/apertura (subidos con deploy-site.sh)
#
# IMPORTANTE: MicroK8s usa containerd directamente (no Docker) para ejecutar contenedores.
# Docker solo se necesita para CONSTRUIR imágenes. Si no hay Docker en el servidor,
# construiremos la imagen localmente y la subiremos al servidor.
#
# Uso:
#   ./k8s/deploy-k8s.sh [--rebuild]
#   --rebuild: Reconstruye la imagen Docker (por defecto, solo sube la imagen si existe)

set -e

# Procesar argumentos
REBUILD_IMAGE=false
if [[ "$1" == "--rebuild" ]] || [[ "$1" == "-r" ]]; then
    REBUILD_IMAGE=true
    echo "🔨 Modo: Reconstruir imagen habilitado"
fi

echo "🚀 Iniciando despliegue de Apertura en MicroK8s..."

# Variables
REMOTE_USER="sistemas"
REMOTE_HOST="st-app"
REMOTE_PATH="/data/st"
REMOTE_SITE_PATH="${REMOTE_PATH}/apertura"
IMAGE_NAME="apertura"
IMAGE_TAG="latest"
NAMESPACE="st"
BUILD_LOCALLY=false

# Verificar que SSH está disponible
if ! command -v ssh &> /dev/null; then
    echo "❌ SSH no está disponible. Por favor, instala SSH primero."
    exit 1
fi

# Verificar conexión SSH
echo "🔌 Verificando conexión SSH a ${REMOTE_USER}@${REMOTE_HOST}..."
if ! ssh -o ConnectTimeout=5 ${REMOTE_USER}@${REMOTE_HOST} "echo 'Conexión exitosa'" > /dev/null 2>&1; then
    echo "❌ No se puede conectar a ${REMOTE_USER}@${REMOTE_HOST}"
    echo "   Por favor, verifica la conexión SSH y las claves."
    exit 1
fi

echo "✅ Conexión SSH establecida"

# Verificar que el directorio apertura existe y tiene los archivos necesarios
echo "📁 Verificando que los archivos del sitio están en ${REMOTE_SITE_PATH}..."
if ! ssh ${REMOTE_USER}@${REMOTE_HOST} "test -d ${REMOTE_SITE_PATH} && test -d ${REMOTE_SITE_PATH}/build"; then
    echo "❌ No se encontró el directorio apertura o el build en ${REMOTE_SITE_PATH}"
    echo "   Por favor, ejecuta primero: ./k8s/deploy-site.sh"
    exit 1
fi

echo "✅ Archivos del sitio encontrados en ${REMOTE_SITE_PATH}"

# Verificar qué herramienta de build está disponible EN EL SERVIDOR
echo "🔍 Verificando herramientas de build disponibles..."
REMOTE_BUILD_TOOL=""
if ssh ${REMOTE_USER}@${REMOTE_HOST} "command -v docker &> /dev/null" 2>/dev/null; then
    REMOTE_BUILD_TOOL="docker"
elif ssh ${REMOTE_USER}@${REMOTE_HOST} "command -v buildah &> /dev/null" 2>/dev/null; then
    REMOTE_BUILD_TOOL="buildah"
elif ssh ${REMOTE_USER}@${REMOTE_HOST} "command -v podman &> /dev/null" 2>/dev/null; then
    REMOTE_BUILD_TOOL="podman"
fi

# Si no hay herramienta en el servidor, verificar si podemos construir localmente
if [ -z "${REMOTE_BUILD_TOOL}" ]; then
    echo "⚠️  No se encontró herramienta de build en el servidor (docker, buildah, podman)"
    echo "   Verificando si podemos construir localmente..."
    
    if command -v docker &> /dev/null; then
        LOCAL_BUILD_TOOL="docker"
        BUILD_LOCALLY=true
        echo "✅ Docker disponible localmente, construiremos la imagen aquí y la subiremos"
    elif command -v buildah &> /dev/null; then
        LOCAL_BUILD_TOOL="buildah"
        BUILD_LOCALLY=true
        echo "✅ Buildah disponible localmente, construiremos la imagen aquí y la subiremos"
    elif command -v podman &> /dev/null; then
        LOCAL_BUILD_TOOL="podman"
        BUILD_LOCALLY=true
        echo "✅ Podman disponible localmente, construiremos la imagen aquí y la subiremos"
    else
        echo "❌ No se encontró ninguna herramienta para construir imágenes"
        echo "   Opciones:"
        echo "   1. Instala Docker, buildah o podman en el servidor remoto"
        echo "   2. Instala Docker, buildah o podman localmente para construir y subir"
        exit 1
    fi
else
    echo "✅ Herramienta de build encontrada en el servidor: ${REMOTE_BUILD_TOOL}"
fi

# Construir/subir la imagen de contenedor
# Nota: Kubernetes/MicroK8s usa containerd para ejecutar contenedores, pero necesitamos
# construir la imagen primero con docker/buildah/podman.
if [ "${REBUILD_IMAGE}" = true ]; then
    echo "🔨 Reconstruyendo imagen de contenedor..."
else
    echo "📤 Verificando si existe imagen para subir..."
fi

if [ "${BUILD_LOCALLY}" = true ]; then
    # Construir/subir imagen localmente al servidor
    if [ "${REBUILD_IMAGE}" = true ]; then
        echo "🔨 Reconstruyendo imagen localmente con ${LOCAL_BUILD_TOOL}..."
    else
        # Verificar si la imagen existe localmente
        if docker images ${IMAGE_NAME}:${IMAGE_TAG} --format "{{.Repository}}:{{.Tag}}" 2>/dev/null | grep -q "${IMAGE_NAME}:${IMAGE_TAG}"; then
            echo "✅ Imagen encontrada localmente, solo subiendo..."
        else
            echo "⚠️  Imagen no encontrada localmente. Reconstruyendo..."
            REBUILD_IMAGE=true
        fi
    fi
    
    if [ "${REBUILD_IMAGE}" = true ]; then
        if [ "${LOCAL_BUILD_TOOL}" = "docker" ]; then
            # Construir para arquitectura linux/amd64 (x86_64) del servidor
            # Esto es necesario si estás construyendo en Mac M1/M2 (ARM64)
            echo "🔧 Construyendo para plataforma linux/amd64..."
            docker build --platform linux/amd64 -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
        elif [ "${LOCAL_BUILD_TOOL}" = "buildah" ]; then
            echo "🔧 Construyendo para plataforma linux/amd64..."
            buildah bud --platform linux/amd64 -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
        elif [ "${LOCAL_BUILD_TOOL}" = "podman" ]; then
            echo "🔧 Construyendo para plataforma linux/amd64..."
            podman build --platform linux/amd64 -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
        fi
    fi
    
    # Exportar y subir imagen (siempre)
    if [ "${LOCAL_BUILD_TOOL}" = "docker" ]; then
        echo "📦 Exportando imagen..."
        docker save ${IMAGE_NAME}:${IMAGE_TAG} | gzip > /tmp/${IMAGE_NAME}.tar.gz
        echo "📤 Subiendo imagen al servidor..."
        scp /tmp/${IMAGE_NAME}.tar.gz ${REMOTE_USER}@${REMOTE_HOST}:/tmp/
        echo "📦 Importando imagen a MicroK8s (containerd)..."
        ssh ${REMOTE_USER}@${REMOTE_HOST} "gunzip -c /tmp/${IMAGE_NAME}.tar.gz | microk8s ctr image import - && rm -f /tmp/${IMAGE_NAME}.tar.gz"
        rm -f /tmp/${IMAGE_NAME}.tar.gz
    elif [ "${LOCAL_BUILD_TOOL}" = "buildah" ]; then
        # Si no se reconstruyó, verificar que existe
        if [ "${REBUILD_IMAGE}" = false ]; then
            if ! buildah images --format "{{.Repository}}:{{.Tag}}" 2>/dev/null | grep -q "${IMAGE_NAME}:${IMAGE_TAG}"; then
                echo "⚠️  Imagen no encontrada. Reconstruyendo..."
                buildah bud --platform linux/amd64 -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
            fi
        fi
        echo "📦 Exportando imagen..."
        buildah push ${IMAGE_NAME}:${IMAGE_TAG} docker-archive:/tmp/${IMAGE_NAME}.tar
        gzip /tmp/${IMAGE_NAME}.tar
        echo "📤 Subiendo imagen al servidor..."
        scp /tmp/${IMAGE_NAME}.tar.gz ${REMOTE_USER}@${REMOTE_HOST}:/tmp/
        echo "📦 Importando imagen a MicroK8s (containerd)..."
        ssh ${REMOTE_USER}@${REMOTE_HOST} "gunzip -c /tmp/${IMAGE_NAME}.tar.gz | microk8s ctr image import - && rm -f /tmp/${IMAGE_NAME}.tar.gz"
        rm -f /tmp/${IMAGE_NAME}.tar.gz
    elif [ "${LOCAL_BUILD_TOOL}" = "podman" ]; then
        # Si no se reconstruyó, verificar que existe
        if [ "${REBUILD_IMAGE}" = false ]; then
            if ! podman images --format "{{.Repository}}:{{.Tag}}" 2>/dev/null | grep -q "${IMAGE_NAME}:${IMAGE_TAG}"; then
                echo "⚠️  Imagen no encontrada. Reconstruyendo..."
                podman build --platform linux/amd64 -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
            fi
        fi
        echo "📦 Exportando imagen..."
        podman save ${IMAGE_NAME}:${IMAGE_TAG} | gzip > /tmp/${IMAGE_NAME}.tar.gz
        echo "📤 Subiendo imagen al servidor..."
        scp /tmp/${IMAGE_NAME}.tar.gz ${REMOTE_USER}@${REMOTE_HOST}:/tmp/
        echo "📦 Importando imagen a MicroK8s (containerd)..."
        ssh ${REMOTE_USER}@${REMOTE_HOST} "gunzip -c /tmp/${IMAGE_NAME}.tar.gz | microk8s ctr image import - && rm -f /tmp/${IMAGE_NAME}.tar.gz"
        rm -f /tmp/${IMAGE_NAME}.tar.gz
    fi
    echo "✅ Imagen subida e importada exitosamente en MicroK8s"
else
    # Construir/subir en el servidor
    if [ "${REBUILD_IMAGE}" = true ]; then
        echo "🔨 Reconstruyendo imagen en el servidor remoto con ${REMOTE_BUILD_TOOL}..."
    else
        echo "📤 Verificando imagen en el servidor..."
    fi
    
    ssh ${REMOTE_USER}@${REMOTE_HOST} << EOF
set -e
cd ${REMOTE_SITE_PATH}

# Verificar que MicroK8s está corriendo
if ! microk8s status --wait-ready > /dev/null 2>&1; then
    echo "❌ MicroK8s no está corriendo. Por favor, inicia MicroK8s primero."
    exit 1
fi

echo "✅ MicroK8s está corriendo"

# Construir/subir la imagen según la herramienta disponible
if [ "${REBUILD_IMAGE}" = true ]; then
    # Reconstruir imagen
    if [ "${REMOTE_BUILD_TOOL}" = "docker" ]; then
        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
        echo "📦 Importando imagen a MicroK8s (containerd)..."
        docker save ${IMAGE_NAME}:${IMAGE_TAG} | microk8s ctr image import -
    elif [ "${REMOTE_BUILD_TOOL}" = "buildah" ]; then
        buildah bud -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
        echo "📦 Importando imagen a MicroK8s (containerd)..."
        buildah push ${IMAGE_NAME}:${IMAGE_TAG} docker-archive:/tmp/${IMAGE_NAME}.tar
        cat /tmp/${IMAGE_NAME}.tar | microk8s ctr image import -
        rm -f /tmp/${IMAGE_NAME}.tar
    elif [ "${REMOTE_BUILD_TOOL}" = "podman" ]; then
        podman build -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
        echo "📦 Importando imagen a MicroK8s (containerd)..."
        podman save ${IMAGE_NAME}:${IMAGE_TAG} | microk8s ctr image import -
    fi
    echo "✅ Imagen reconstruida e importada exitosamente"
else
    # Solo verificar que existe
    if microk8s ctr images ls | grep -q "${IMAGE_NAME}:${IMAGE_TAG}"; then
        echo "✅ Imagen ya existe en MicroK8s"
    else
        echo "⚠️  Imagen no encontrada. Reconstruyendo..."
        if [ "${REMOTE_BUILD_TOOL}" = "docker" ]; then
            docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
            docker save ${IMAGE_NAME}:${IMAGE_TAG} | microk8s ctr image import -
        elif [ "${REMOTE_BUILD_TOOL}" = "buildah" ]; then
            buildah bud -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
            buildah push ${IMAGE_NAME}:${IMAGE_TAG} docker-archive:/tmp/${IMAGE_NAME}.tar
            cat /tmp/${IMAGE_NAME}.tar | microk8s ctr image import -
            rm -f /tmp/${IMAGE_NAME}.tar
        elif [ "${REMOTE_BUILD_TOOL}" = "podman" ]; then
            podman build -t ${IMAGE_NAME}:${IMAGE_TAG} -f k8s/Dockerfile .
            podman save ${IMAGE_NAME}:${IMAGE_TAG} | microk8s ctr image import -
        fi
        echo "✅ Imagen construida e importada exitosamente"
    fi
fi
EOF
fi

# Aplicar configuraciones de Kubernetes en el servidor remoto
echo "📋 Aplicando configuraciones de Kubernetes..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << EOF
set -e
cd ${REMOTE_SITE_PATH}

# Crear namespace si no existe
echo "📁 Verificando namespace ${NAMESPACE}..."
if ! microk8s kubectl get namespace ${NAMESPACE} > /dev/null 2>&1; then
    echo "   Creando namespace ${NAMESPACE}..."
    microk8s kubectl create namespace ${NAMESPACE}
    echo "✅ Namespace ${NAMESPACE} creado"
else
    echo "✅ Namespace ${NAMESPACE} ya existe"
fi

# Eliminar recursos antiguos del namespace default si existen
echo "🧹 Verificando si hay recursos antiguos en namespace 'default'..."
if microk8s kubectl get deployment apertura-deployment -n default > /dev/null 2>&1; then
    echo "   ⚠️  Se encontró Deployment en namespace 'default', eliminándolo..."
    microk8s kubectl delete deployment apertura-deployment -n default --ignore-not-found=true
    echo "   ✅ Deployment eliminado de namespace 'default'"
fi
if microk8s kubectl get service apertura-service -n default > /dev/null 2>&1; then
    echo "   ⚠️  Se encontró Service en namespace 'default', eliminándolo..."
    microk8s kubectl delete service apertura-service -n default --ignore-not-found=true
    echo "   ✅ Service eliminado de namespace 'default'"
fi
if microk8s kubectl get ingress apertura-ingress -n default > /dev/null 2>&1; then
    echo "   ⚠️  Se encontró Ingress en namespace 'default', eliminándolo..."
    microk8s kubectl delete ingress apertura-ingress -n default --ignore-not-found=true
    echo "   ✅ Ingress eliminado de namespace 'default'"
fi

# Esperar un momento después de eliminar
sleep 2

# Aplicar ConfigMap (con namespace explícito)
echo "📝 Aplicando ConfigMap..."
microk8s kubectl apply -n ${NAMESPACE} -f k8s/configmap-env.yaml

# Aplicar Deployment (con namespace explícito)
echo "🚀 Aplicando Deployment..."
if microk8s kubectl apply -n ${NAMESPACE} -f k8s/deployment.yaml; then
    echo "✅ Deployment aplicado"
    # Verificar inmediatamente si se creó
    sleep 2
    if microk8s kubectl get deployment apertura-deployment -n ${NAMESPACE} > /dev/null 2>&1; then
        echo "✅ Deployment encontrado en namespace ${NAMESPACE}"
    else
        echo "❌ ERROR: Deployment NO se encontró en namespace ${NAMESPACE}"
        echo "   Verificando en qué namespace se creó..."
        microk8s kubectl get deployment apertura-deployment -n default 2>/dev/null && echo "   ⚠️  Deployment encontrado en namespace 'default'" || echo "   Deployment no encontrado en ningún namespace"
    fi
else
    echo "❌ ERROR al aplicar Deployment"
    exit 1
fi

# Aplicar Service (con namespace explícito)
echo "🔌 Aplicando Service..."
microk8s kubectl apply -n ${NAMESPACE} -f k8s/service.yaml

# Esperar un momento para que los pods se creen
echo "⏳ Esperando a que los pods se inicien..."
sleep 10

# Verificar que los recursos se crearon en el namespace correcto
echo "🔍 Verificando recursos en namespace ${NAMESPACE}..."
echo ""
echo "Deployments:"
if microk8s kubectl get deployment -n ${NAMESPACE} -l app=apertura 2>/dev/null | grep -v NAME; then
    echo "✅ Deployment encontrado"
    microk8s kubectl get deployment apertura-deployment -n ${NAMESPACE}
else
    echo "❌ No hay deployments de apertura en namespace ${NAMESPACE}"
    echo "   Buscando en todos los namespaces..."
    microk8s kubectl get deployment apertura-deployment --all-namespaces
fi
echo ""
echo "Services:"
microk8s kubectl get svc -n ${NAMESPACE} -l app=apertura 2>/dev/null || microk8s kubectl get svc -n ${NAMESPACE} | grep apertura || echo "   ⚠️  No hay services de apertura en namespace ${NAMESPACE}"
echo ""
echo "Pods:"
microk8s kubectl get pods -n ${NAMESPACE} -l app=apertura 2>/dev/null || microk8s kubectl get pods -n ${NAMESPACE} | grep apertura || echo "   ⚠️  No hay pods de apertura en namespace ${NAMESPACE}"
echo ""
echo "ReplicaSets:"
microk8s kubectl get replicaset -n ${NAMESPACE} -l app=apertura 2>/dev/null || echo "   ⚠️  No hay replicasets en namespace ${NAMESPACE}"
echo ""
echo "Eventos recientes en namespace ${NAMESPACE}:"
microk8s kubectl get events -n ${NAMESPACE} --sort-by='.lastTimestamp' 2>/dev/null | tail -10 || echo "   No se pudieron obtener eventos"
echo ""

# Si no hay pods, verificar errores del Deployment
if ! microk8s kubectl get pods -n ${NAMESPACE} -l app=apertura 2>/dev/null | grep -q apertura; then
    echo "⚠️  No se encontraron pods. Verificando estado del Deployment..."
    microk8s kubectl describe deployment apertura-deployment -n ${NAMESPACE} 2>/dev/null | tail -30 || echo "   No se pudo obtener descripción del Deployment"
    echo ""
fi

# Verificar si cert-manager está habilitado
if microk8s kubectl get crd certificates.cert-manager.io > /dev/null 2>&1; then
    echo "📜 Cert-manager está habilitado"
    
    # Aplicar ClusterIssuers
    echo "🔐 Aplicando ClusterIssuers..."
    microk8s kubectl apply -f k8s/cert-manager-issuer.yaml
else
    echo "⚠️  Cert-manager no está habilitado. Para habilitarlo ejecuta: microk8s enable cert-manager"
fi

# Verificar si ingress está habilitado
if microk8s kubectl get pods -n ingress 2>/dev/null | grep -q nginx-ingress; then
    echo "🌐 Ingress está habilitado"
    
    # Aplicar Ingress (con namespace explícito)
    echo "🌐 Aplicando Ingress..."
    microk8s kubectl apply -n ${NAMESPACE} -f k8s/ingress.yaml
else
    echo "⚠️  Ingress no está habilitado. Para habilitarlo ejecuta: microk8s enable ingress"
fi

# Verificar estado final
echo ""
echo "📊 Estado final de los recursos:"
echo ""
echo "Recursos en namespace ${NAMESPACE}:"
microk8s kubectl get all -n ${NAMESPACE} | grep apertura || echo "   ⚠️  No se encontraron recursos de apertura en namespace ${NAMESPACE}"
echo ""
echo "Recursos en namespace 'default' (no deberían existir):"
DEFAULT_COUNT=\$(microk8s kubectl get deployment,svc,ingress -n default -l app=apertura 2>/dev/null | grep -v NAME | wc -l || echo "0")
if [ "\${DEFAULT_COUNT}" -gt 0 ]; then
    echo "   ⚠️  Aún hay recursos en namespace 'default':"
    microk8s kubectl get deployment,svc,ingress -n default -l app=apertura
    echo "   💡 Elimínalos con: microk8s kubectl delete deployment,svc,ingress -n default -l app=apertura"
else
    echo "   ✅ No hay recursos de apertura en namespace 'default'"
fi

echo "✅ Despliegue completado en el servidor remoto!"
EOF

echo ""
echo "✅ Despliegue completado!"
echo ""
echo "📋 Comandos útiles (ejecutar en el servidor remoto):"
echo "  ssh ${REMOTE_USER}@${REMOTE_HOST}"
echo "  cd ${REMOTE_SITE_PATH}"
echo "  microk8s kubectl get pods -n ${NAMESPACE}"
echo "  microk8s kubectl get svc -n ${NAMESPACE}"
echo "  microk8s kubectl get ingress -n ${NAMESPACE}"
echo "  microk8s kubectl logs -f deployment/apertura-deployment -n ${NAMESPACE}"
echo ""
echo "🔍 Para diagnosticar problemas con certificados SSL:"
echo "  microk8s kubectl get pods -n cert-manager"
echo "  microk8s kubectl get clusterissuer"
echo "  microk8s kubectl get certificate -n ${NAMESPACE}"
echo "  microk8s kubectl describe certificate apertura-tls -n ${NAMESPACE}"
echo "  microk8s kubectl describe clusterissuer letsencrypt-prod"
echo "  microk8s kubectl get ingressclass"
echo ""
echo "💡 Uso del script:"
echo "  ./k8s/deploy-k8s.sh           # Solo sube imagen si existe, no reconstruye"
echo "  ./k8s/deploy-k8s.sh --rebuild # Reconstruye la imagen antes de subir"
echo ""
echo "💡 Nota: Este script usa los archivos que ya están en ${REMOTE_SITE_PATH}"
echo "   Si necesitas actualizar los archivos, ejecuta primero: ./k8s/deploy-site.sh"
echo ""

