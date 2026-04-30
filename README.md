# HogarYa - Plataforma de Servicios del Hogar

Plataforma web que conecta clientes con trabajadores verificados en Barranquilla, Colombia.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Tailwind CSS v4 + React Router v7
- **Backend**: Express + TypeScript + Node.js
- **Base de Datos**: MongoDB Atlas (cloud)
- **Autenticación**: JWT + bcrypt

---

## � Configuración para Producción y Seguridad

### Variables de Entorno
Copia `backend/.env.example` a `backend/.env` y configura:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hogarya?retryWrites=true&w=majority
JWT_SECRET=tu_clave_jwt_segura_generada
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.vercel.app
```

**Importante:** Nunca subas `.env` a GitHub. Está en `.gitignore`.

### Medidas de Seguridad Implementadas
- **Helmet**: Headers de seguridad HTTP
- **Rate Limiting**: Límite de 100 solicitudes por IP cada 15 minutos
- **CORS**: Configurado para dominio específico en producción
- **Validación de Payload**: Límite de 10MB por solicitud
- **Variables de Entorno**: Credenciales no hardcodeadas
- **HTTPS**: Automático en Vercel y DigitalOcean

### Despliegue
1. **Frontend (Vercel)**: Conecta el repo a Vercel, configura `VITE_API_URL` con la URL del backend.
2. **Backend (DigitalOcean)**: Usa App Platform, configura variables de entorno.
3. **Base de Datos**: MongoDB Atlas con IP whitelist y usuario dedicado.

---

- Node.js 18+ (recomendado v22)
- pnpm (gestor de paquetes)
- Cuenta en MongoDB Atlas (gratis)

---

## ⚙️ Configuración Inicial

### 1. Clonar el repositorio e instalar dependencias

```bash
# Instalar dependencias del proyecto principal
pnpm install

# Instalar dependencias del backend
cd backend
pnpm install
cd ..
```

### 2. Configurar MongoDB Atlas

Si aún no tienes MongoDB Atlas configurado, sigue la guía completa en: `MIGRACION_MONGODB.md`

**Resumen rápido:**
1. Crear cuenta en https://cloud.mongodb.com
2. Crear cluster gratuito M0
3. Configurar Network Access → "Allow Access from Anywhere" (0.0.0.0/0)
4. Crear usuario de base de datos
5. Copiar connection string

### 3. Configurar Variables de Entorno

Edita el archivo `backend/.env`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hogarya?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
PORT=5000
NODE_ENV=development
```

⚠️ **Reemplaza** `usuario:password` y el cluster URL con tus credenciales reales de MongoDB Atlas.

### 4. Inicializar Base de Datos

Desde el directorio raíz del proyecto:

```bash
./node_modules/.bin/tsx backend/src/utils/seed.ts
```

Deberías ver:
```
🌱 Iniciando seed de la base de datos...
✅ MongoDB conectado exitosamente
🗑️  Limpiando datos existentes...
👥 Creando trabajadores...
  ✓ Carlos Martínez creado
  ✓ María González creado
  ...
✅ Seed completado exitosamente!
```

---

## 🏃‍♂️ Iniciar la Aplicación

### Opción A: Dos terminales (Recomendado)

**Terminal 1 - Backend:**
```bash
./node_modules/.bin/tsx backend/src/server.ts
```

Verás:
```
✅ MongoDB conectado exitosamente
🚀 Servidor corriendo en puerto 5000
📍 URL: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
pnpm run dev
```

El frontend arrancará en el puerto configurado (usualmente 5173 o similar).

### Opción B: Un comando (experimental)

```bash
# Crear un script que corre ambos
pnpm run dev & ./node_modules/.bin/tsx backend/src/server.ts
```

---

## 🔐 Credenciales de Prueba

Después de ejecutar el seed:

### Cliente
- **Email:** `cliente@hogarya.com`
- **Password:** `password123`

### Trabajadores
- **Email:** `carlos.martinez@hogarya.com`
- **Password:** `password123`

(También disponibles: maria.gonzalez, jose.ramirez, ana.lopez, pedro.suarez, laura.diaz - todos con password123)

---

## 📁 Estructura del Proyecto

```
hogarya/
├── backend/                 # Servidor Express + MongoDB
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Auth JWT, errores
│   │   ├── models/         # Schemas Mongoose
│   │   ├── routes/         # Rutas Express
│   │   ├── utils/          # Helpers, seed
│   │   └── server.ts       # Punto de entrada
│   ├── .env               # Variables de entorno (NO subir a git)
│   └── package.json
├── src/                    # Frontend React
│   ├── app/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la app
│   │   ├── utils/         # api.ts (cliente API)
│   │   └── routes.tsx     # Configuración de rutas
│   └── styles/            # CSS y Tailwind
├── MIGRACION_MONGODB.md   # Guía completa de migración
└── README.md              # Este archivo
```

---

## 🔌 Endpoints de la API

**Base URL:** `http://localhost:5000/api`

### Autenticación
- `POST /auth/signup` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/session` - Verificar sesión (requiere token)

### Trabajadores
- `GET /trabajadores` - Listar todos
- `GET /trabajadores/:id` - Obtener por ID
- `PUT /trabajadores/:id` - Actualizar (requiere token, solo propietario)
- `GET /trabajadores/buscar/:query` - Buscar por nombre/servicio

### Reseñas
- `POST /reseñas` - Crear reseña (requiere token)
- `GET /reseñas/:trabajador_id` - Listar por trabajador

### Perfil
- `PUT /perfil` - Actualizar perfil (requiere token)

---

## 🧪 Probar la API (opcional)

### Con curl:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@hogarya.com","password":"password123"}'
```

**Obtener trabajadores:**
```bash
curl http://localhost:5000/api/trabajadores
```

**Registro:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"nuevo@example.com","password":"123456","nombre":"Usuario Nuevo","tipo":"cliente"}'
```

---

## 🎨 Paleta de Colores

El diseño usa una paleta específica definida en `/src/styles/theme.css`:

- `#A7EBF2` - Celeste claro
- `#54ACBF` - Azul agua
- `#26658C` - Azul medio
- `#023859` - Azul oscuro
- `#011C40` - Azul profundo

---

## 🐛 Troubleshooting

### Backend no se conecta a MongoDB
```
Error: MongoServerSelectionError
```
**Solución:** Verifica que tu IP esté en la whitelist de MongoDB Atlas.

### Frontend no se conecta al backend
```
Error: Failed to fetch
```
**Solución:** 
1. Verifica que el backend esté corriendo en puerto 5000
2. Revisa la consola del navegador para ver el error exacto

### No aparecen trabajadores en el catálogo
**Solución:**
1. Verifica que el backend esté corriendo
2. Ejecuta el seed nuevamente: `./node_modules/.bin/tsx backend/src/utils/seed.ts`
3. Revisa la consola del navegador (F12) para ver errores

### Error "MONGODB_URI not defined"
**Solución:** Asegúrate de que el archivo `backend/.env` existe y tiene la variable correcta.

---

## 📝 Notas Importantes

- ⚠️ **Nunca** subas el archivo `.env` a git (ya está en `.gitignore`)
- 🔒 Cambia `JWT_SECRET` en producción
- 🌐 MongoDB Atlas gratuito: hasta 512MB de datos
- 📊 Los datos de prueba se pueden reinicializar ejecutando el seed de nuevo

---

## 🚢 Deployment

### Backend
Opciones recomendadas:
- **Railway** - https://railway.app
- **Render** - https://render.com
- **Fly.io** - https://fly.io

### Frontend
- **Vercel** - https://vercel.com
- **Netlify** - https://netlify.com

Recuerda configurar las variables de entorno en la plataforma de deployment.

---

## 📞 Contacto y Soporte

Para problemas técnicos, revisa:
1. `MIGRACION_MONGODB.md` - Guía detallada de configuración
2. Los logs del backend (terminal donde corre el servidor)
3. La consola del navegador (F12 → Console)

---

**¡HogarYa está listo para funcionar! 🎉**

Recuerda:
1. ✅ Configurar MongoDB Atlas
2. ✅ Ejecutar el seed
3. ✅ Iniciar backend (puerto 5000)
4. ✅ Iniciar frontend
5. ✅ Probar con las credenciales de ejemplo
