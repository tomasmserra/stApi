#!/bin/bash

# Script para eliminar toda la configuración de MicroK8s para la aplicación Apertura
# Se conecta por SSH al servidor remoto para ejecutar los comandos

set -e

echo "🧹 Limpiando configuración de MicroK8s para Apertura..."
echo ""

# Variables
REMOTE_USER="sistemas"
REMOTE_HOST="st-app"
NAMESPACE="st"

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
echo ""

echo "⚠️  Se eliminarán los siguientes recursos en ${REMOTE_USER}@${REMOTE_HOST}:"
echo "   - Deployment: apertura-deployment"
echo "   - Service: apertura-service"
echo "   - Ingress: apertura-ingress"
echo "   - Certificate: apertura-tls"
echo "   - Secret: apertura-tls"
echo "   - ConfigMap: apertura-env"
echo "   - Imagen Docker: apertura:latest"
echo ""
read -p "¿Continuar? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

echo "🗑️  Eliminando recursos en el servidor remoto..."

# Ejecutar comandos en el servidor remoto
ssh ${REMOTE_USER}@${REMOTE_HOST} << EOF
set -e

# Eliminar Deployment
echo "   Eliminando Deployment..."
microk8s kubectl delete deployment apertura-deployment -n ${NAMESPACE} --ignore-not-found=true || true

# Eliminar Service
echo "   Eliminando Service..."
microk8s kubectl delete service apertura-service -n ${NAMESPACE} --ignore-not-found=true || true

# Eliminar Ingress
echo "   Eliminando Ingress..."
microk8s kubectl delete ingress apertura-ingress -n ${NAMESPACE} --ignore-not-found=true || true

# Eliminar Certificate
echo "   Eliminando Certificate..."
microk8s kubectl delete certificate apertura-tls -n ${NAMESPACE} --ignore-not-found=true || true

# Eliminar Secret TLS
echo "   Eliminando Secret TLS..."
microk8s kubectl delete secret apertura-tls -n ${NAMESPACE} --ignore-not-found=true || true

# Eliminar ConfigMap
echo "   Eliminando ConfigMap..."
microk8s kubectl delete configmap apertura-env -n ${NAMESPACE} --ignore-not-found=true || true

# Eliminar órdenes y desafíos de ACME relacionados (si existen)
echo "   Eliminando órdenes y desafíos de ACME..."
microk8s kubectl delete order -n ${NAMESPACE} -l cert-manager.io/certificate-name=apertura-tls --ignore-not-found=true || true
microk8s kubectl delete challenge -n ${NAMESPACE} -l cert-manager.io/certificate-name=apertura-tls --ignore-not-found=true || true

# Intentar eliminar la imagen Docker (puede fallar si no existe)
echo "   Eliminando imagen Docker..."
microk8s ctr images rm apertura:latest 2>/dev/null || echo "     ⚠️  Imagen no encontrada o ya eliminada"

# Esperar a que los pods terminen
echo ""
echo "⏳ Esperando a que los pods terminen..."
sleep 3

# Verificar que todo se eliminó
echo ""
echo "✅ Limpieza completada!"
echo ""
echo "📋 Verificando recursos restantes:"
echo ""
echo "Pods:"
microk8s kubectl get pods -n ${NAMESPACE} | grep apertura || echo "   ✅ No hay pods de apertura"
echo ""
echo "Services:"
microk8s kubectl get svc -n ${NAMESPACE} | grep apertura || echo "   ✅ No hay services de apertura"
echo ""
echo "Ingress:"
microk8s kubectl get ingress -n ${NAMESPACE} | grep apertura || echo "   ✅ No hay ingress de apertura"
echo ""
echo "Certificates:"
microk8s kubectl get certificate -n ${NAMESPACE} | grep apertura || echo "   ✅ No hay certificates de apertura"
echo ""
echo "💡 Nota: Los archivos en /data/st/apertura NO se eliminan."
echo "   Para eliminarlos manualmente: rm -rf /data/st/apertura"
echo ""
EOF

echo ""
echo "✅ Limpieza completada en el servidor remoto!"
echo ""

