#!/bin/bash

# Script para construir la aplicación y subir todos los archivos al servidor remoto
# Se conecta a sistemas@st-app y sube los archivos a /data/st/apertura

set -e

echo "🔨 Construyendo y subiendo aplicación..."

# Variables
REMOTE_USER="sistemas"
REMOTE_HOST="st-app"
REMOTE_PATH="/data/st"
REMOTE_SITE_PATH="${REMOTE_PATH}/apertura"

# Verificar que SSH está disponible
if ! command -v ssh &> /dev/null; then
    echo "❌ SSH no está disponible. Por favor, instala SSH primero."
    exit 1
fi

# Verificar que rsync está disponible
if ! command -v rsync &> /dev/null; then
    echo "❌ rsync no está disponible. Por favor, instala rsync primero."
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

# Verificar que Node.js está disponible
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está disponible. Por favor, instala Node.js primero."
    exit 1
fi

# Verificar que npm está disponible
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está disponible. Por favor, instala npm primero."
    exit 1
fi

echo "✅ Node.js y npm disponibles"

# Limpiar build anterior
if [ -d "build" ]; then
    echo "🧹 Limpiando build anterior..."
    rm -rf build
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
else
    echo "✅ Dependencias ya instaladas"
fi

# Generar env.js para producción
echo "⚙️  Generando env.js para producción..."
node scripts/generate-env.js

# Construir la aplicación
echo "🔨 Construyendo la aplicación..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "build" ]; then
    echo "❌ El build falló. No se creó el directorio build."
    exit 1
fi

echo "✅ Build completado exitosamente"

# Verificar permisos en el directorio remoto
echo "📁 Verificando permisos en el directorio remoto..."
if ! ssh ${REMOTE_USER}@${REMOTE_HOST} "test -w ${REMOTE_PATH} 2>/dev/null || (mkdir -p ${REMOTE_PATH} 2>/dev/null && test -w ${REMOTE_PATH})"; then
    echo "⚠️  No se tienen permisos de escritura en ${REMOTE_PATH}"
    echo "   Intentando crear el directorio con sudo..."
    
    # Intentar crear el directorio con sudo si no existe
    if ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo mkdir -p ${REMOTE_PATH} && sudo chown ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_PATH} && sudo chmod 755 ${REMOTE_PATH}"; then
        echo "✅ Directorio creado con permisos correctos"
    else
        echo "❌ No se pudieron establecer permisos en ${REMOTE_PATH}"
        echo "   Por favor, verifica manualmente los permisos del directorio:"
        echo "   ssh ${REMOTE_USER}@${REMOTE_HOST}"
        echo "   sudo mkdir -p ${REMOTE_PATH}"
        echo "   sudo chown ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_PATH}"
        echo "   sudo chmod 755 ${REMOTE_PATH}"
        exit 1
    fi
else
    echo "✅ Permisos correctos en el directorio remoto"
fi

# Crear directorio apertura dentro de REMOTE_PATH
echo "📁 Creando directorio apertura (${REMOTE_SITE_PATH})..."
if ! ssh ${REMOTE_USER}@${REMOTE_HOST} "test -w ${REMOTE_SITE_PATH} 2>/dev/null || (mkdir -p ${REMOTE_SITE_PATH} 2>/dev/null && test -w ${REMOTE_SITE_PATH})"; then
    echo "⚠️  No se tienen permisos de escritura en ${REMOTE_SITE_PATH}"
    echo "   Intentando crear el directorio con sudo..."
    
    # Intentar crear el directorio apertura con sudo si no existe
    if ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo mkdir -p ${REMOTE_SITE_PATH} && sudo chown ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_SITE_PATH} && sudo chmod 755 ${REMOTE_SITE_PATH}"; then
        echo "✅ Directorio apertura creado con permisos correctos"
    else
        echo "❌ No se pudieron establecer permisos en ${REMOTE_SITE_PATH}"
        echo "   Por favor, verifica manualmente los permisos del directorio:"
        echo "   ssh ${REMOTE_USER}@${REMOTE_HOST}"
        echo "   sudo mkdir -p ${REMOTE_SITE_PATH}"
        echo "   sudo chown ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_SITE_PATH}"
        echo "   sudo chmod 755 ${REMOTE_SITE_PATH}"
        exit 1
    fi
else
    echo "✅ Directorio apertura listo"
fi

# Sincronizar archivos al servidor remoto
echo "📤 Subiendo archivos al servidor remoto..."

# Subir directorio build y archivos necesarios
# Usar --no-o --no-g para evitar problemas de permisos con propietarios
rsync -avz --progress \
    --no-o --no-g \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'apertura' \
    --exclude '*.log' \
    --exclude '.DS_Store' \
    --exclude '.env*' \
    --exclude 'coverage' \
    --include 'build/' \
    --include 'build/**' \
    --include 'public/' \
    --include 'public/env.js' \
    --include 'public/favicon.ico' \
    --include 'public/index.html' \
    --include 'public/manifest.json' \
    --include 'public/robots.txt' \
    --include 'k8s/' \
    --include 'k8s/**' \
    --include 'package.json' \
    --include 'package-lock.json' \
    --include 'scripts/' \
    --include 'scripts/**' \
    --exclude '*' \
    ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_SITE_PATH}/

# Verificar que los archivos se subieron correctamente
if ssh ${REMOTE_USER}@${REMOTE_HOST} "test -d ${REMOTE_SITE_PATH}/build"; then
    echo "🔍 Verificando archivos en el servidor remoto..."
    ssh ${REMOTE_USER}@${REMOTE_HOST} "ls -lah ${REMOTE_SITE_PATH}/build | head -5"
    echo "✅ Archivos subidos correctamente"
else
    echo "⚠️  No se encontró el directorio build en el servidor remoto"
    echo "   Puede ser un problema de permisos. Verifica manualmente:"
    echo "   ssh ${REMOTE_USER}@${REMOTE_HOST}"
    echo "   ls -lah ${REMOTE_SITE_PATH}/"
fi

echo ""
echo "✅ Archivos subidos exitosamente!"
echo ""
echo "📋 Archivos en el servidor remoto: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_SITE_PATH}"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Si necesitas desplegar en Kubernetes, ejecuta: ./k8s/deploy.sh"
echo "  2. Para verificar archivos en el servidor:"
echo "     ssh ${REMOTE_USER}@${REMOTE_HOST}"
echo "     ls -lah ${REMOTE_SITE_PATH}/build"
echo ""

