#!/usr/bin/env node

/**
 * Script para generar el archivo env.js para producción
 * Uso: node scripts/generate-env.js
 * 
 * Este script genera public/env.js con las variables de entorno necesarias
 * para la aplicación en producción.
 */

const fs = require('fs');
const path = require('path');

// Variables de entorno para producción
// Ajusta estas URLs según tu entorno
const envConfig = {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'https://api.stsecurities.com.ar',
  REACT_APP_GHOST_URL: process.env.REACT_APP_GHOST_URL || 'https://api.stsecurities.com.ar'
};

// Generar el contenido del archivo env.js
const envContent = `window.env = ${JSON.stringify(envConfig, null, 2)};
`;

// Escribir el archivo
const envPath = path.join(__dirname, '..', 'public', 'env.js');
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ Archivo env.js generado exitosamente en public/env.js');
console.log('📝 Configuración:');
console.log(JSON.stringify(envConfig, null, 2));

