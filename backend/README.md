# HogarYa Backend

Backend API para HogarYa construido con Express, JavaScript y MongoDB Atlas.

## Requisitos Previos

- Node.js 18+
- MongoDB (local o MongoDB Atlas)
- pnpm (recomendado) o npm

## Instalación

```bash
cd backend
pnpm install
```

## Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configura las variables de entorno en `.env`:

### Para MongoDB Local:
```env
MONGODB_URI=mongodb://localhost:27017/hogarya
JWT_SECRET=tu_secreto_jwt_super_seguro
PORT=5000
NODE_ENV=development
```

### Para MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hogarya
JWT_SECRET=tu_secreto_jwt_super_seguro
PORT=5000
NODE_ENV=production
```

## MongoDB Atlas Setup

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito (M0)
3. Configura acceso de red (IP Whitelist):
   - Para desarrollo: `0.0.0.0/0` (permite todas las IPs)
   - Para producción: Solo IPs específicas de tu servidor
4. Crea un usuario de base de datos (Database Access)
5. Obtén tu connection string desde "Connect" → "Connect your application"
6. Reemplaza `<password>` en el connection string con tu contraseña real

## Scripts

### Desarrollo
```bash
pnpm run dev
```
Inicia el servidor en modo desarrollo con hot-reload (nodemon).

### Ejecutar localmente
```bash
pnpm run dev
```
Inicia el servidor con nodemon para desarrollo.

### Producción
```bash
pnpm start
```
Ejecuta el servidor JavaScript directamente desde `src/server.js`.

### Seed de Datos
```bash
pnpm run seed
```
Inicializa la base de datos con 6 trabajadores de prueba y un cliente.

## Credenciales de Prueba

Después de ejecutar el seed:

**Cliente:**
- Email: `cliente@hogarya.com`
- Password: `password123`

**Trabajador:**
- Email: `carlos.martinez@hogarya.com`
- Password: `password123`

(También hay 5 trabajadores más: maria.gonzalez, jose.ramirez, ana.lopez, pedro.suarez, laura.diaz)

## API Endpoints

### Autenticación
- `POST /api/auth/signup` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/session` - Verificar sesión (requiere token)

### Trabajadores
- `GET /api/trabajadores` - Listar todos los trabajadores
- `GET /api/trabajadores/:id` - Obtener trabajador específico
- `PUT /api/trabajadores/:id` - Actualizar trabajador (requiere token)
- `GET /api/trabajadores/buscar/:query` - Buscar trabajadores

### Reseñas
- `POST /api/reseñas` - Crear reseña (requiere token)
- `GET /api/reseñas/:trabajador_id` - Obtener reseñas de un trabajador

### Perfil
- `PUT /api/perfil` - Actualizar perfil de usuario (requiere token)

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js   # Lógica de autenticación
│   │   ├── trabajadores.controller.js
│   │   ├── reseñas.controller.js
│   │   └── perfil.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # Verificación JWT
│   │   └── errorHandler.js      # Manejo de errores
│   ├── models/
│   │   ├── Usuario.js           # Schema de Usuario
│   │   ├── Trabajador.js        # Schema de Trabajador
│   │   └── Reseña.js            # Schema de Reseña
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── trabajadores.routes.js
│   │   ├── reseñas.routes.js
│   │   └── perfil.routes.js
│   ├── utils/
│   │   ├── generateToken.js     # Helpers JWT
│   │   └── seed.js              # Script de seed
│   └── server.js                # Punto de entrada
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Seguridad

- Las contraseñas se hashean con bcrypt (salt rounds: 10)
- JWT tokens expiran en 30 días
- CORS habilitado para desarrollo (configurar dominios específicos en producción)
- Validaciones en todos los endpoints
- Middleware de autenticación para rutas protegidas

## Deployment

### Railway
1. Crea cuenta en [Railway](https://railway.app)
2. Conecta tu repositorio
3. Configura variables de entorno en Railway dashboard
4. Deploy automático desde main branch

### DigitalOcean App Platform
1. Crea cuenta en [DigitalOcean](https://www.digitalocean.com) y abre App Platform.
2. Selecciona "Create App" y conecta tu repositorio.
3. Elige el servicio de backend y configura la carpeta de código como `backend`.
4. Configura el entorno a Node.js 20+.
5. Build command: `pnpm install && pnpm run build:app`
6. Start command: `pnpm start`
7. Variables de entorno necesarias:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://hogarya.me`
8. Agrega tu dominio personalizado `hogarya.me` en App Platform y sigue las instrucciones DNS para apuntar el dominio.

> Nota: el frontend se construye en `backend/public` y el backend Express sirve la SPA en la misma aplicación. Esto permite una sola app para frontend y backend.

### Render
1. Crea cuenta en [Render](https://render.com)
2. New → Web Service
3. Conecta repositorio
4. Install Command: `cd backend && pnpm install`
5. Start Command: `cd backend && pnpm start`
6. Configura variables de entorno

### Fly.io
```bash
fly launch
fly secrets set MONGODB_URI=... JWT_SECRET=...
fly deploy
```

## Troubleshooting

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté corriendo (local) o que el connection string sea correcto (Atlas)
- Verifica firewall/IP whitelist en MongoDB Atlas
- Asegúrate de que la variable `MONGODB_URI` esté correctamente configurada

### Error: "JWT_SECRET not defined"
- Asegúrate de que el archivo `.env` existe
- Verifica que `JWT_SECRET` esté definido en `.env`

### Error: "Port already in use"
- Cambia el puerto en `.env`: `PORT=5001`
- O mata el proceso usando el puerto: `lsof -ti:5000 | xargs kill`

## Licencia

MIT
