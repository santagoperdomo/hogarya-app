#!/bin/bash

echo "🚀 Iniciando HogarYa..."
echo ""

# Verificar que existe .env en backend
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: No existe backend/.env"
    echo "   Copia backend/.env.example a backend/.env y configúralo"
    exit 1
fi

# Verificar que MongoDB URI está configurado
if grep -q "PENDIENTE_CONFIGURAR" backend/.env 2>/dev/null; then
    echo "❌ Error: MONGODB_URI no está configurado en backend/.env"
    echo "   Edita backend/.env y agrega tu connection string de MongoDB Atlas"
    exit 1
fi

echo "✅ Configuración verificada"
echo ""
echo "📡 Iniciando backend en puerto 5000..."
echo "   (Los logs aparecerán aquí)"
echo ""

# Iniciar backend
./node_modules/.bin/tsx backend/src/server.ts
