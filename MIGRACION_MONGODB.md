# Guía de Migración: Supabase → MongoDB Atlas

## ✅ Migración Completada

HogarYa ha sido migrado exitosamente de Supabase a MongoDB Atlas + Express.

---

## 📋 Pasos para Poner en Marcha

### 1️⃣ Configurar MongoDB Atlas (Cloud - Gratis)

#### a) Crear Cuenta y Cluster
1. Ve a [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Regístrate con Google o email
3. Crea una organización (ej: "HogarYa")
4. Crea un proyecto (ej: "HogarYa Production")
5. Haz clic en **"Build a Database"**
6. Selecciona **"M0 FREE"** (512MB gratis, perfecto para empezar)
7. Elige región: **"AWS / N. Virginia (us-east-1)"** o la más cercana a Barranquilla
8. Nombre del cluster: `hogarya-cluster`
9. Clic en **"Create"**

#### b) Configurar Acceso de Red
1. En el menú lateral: **"Network Access"**
2. Clic en **"Add IP Address"**
3. Para desarrollo: clic en **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ En producción: agregar solo IPs específicas
4. Confirmar

#### c) Crear Usuario de Base de Datos
1. En el menú lateral: **"Database Access"**
2. Clic en **"Add New Database User"**
3. Authentication Method: **"Password"**
4. Username: `hogarya_admin`
5. Password: Genera una contraseña segura (cópiala, la necesitarás)
   - Ejemplo: `Hog@rY4_2024_S3cur3!`
6. Database User Privileges: **"Atlas Admin"**
7. Clic en **"Add User"**

#### d) Obtener Connection String
1. Ve a **"Database"** en el menú lateral
2. Clic en **"Connect"** en tu cluster
3. Selecciona **"Connect your application"**
4. Driver: **"Node.js"** / Version: **"5.5 or later"**
5. Copia el connection string (se ve así):
   ```
   mongodb+srv://hogarya_admin:<password>@hogarya-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Reemplaza `<password>` con tu contraseña real
7. Agrega el nombre de la base de datos antes del `?`:
   ```
   mongodb+srv://hogarya_admin:Hog@rY4_2024_S3cur3!@hogarya-cluster.xxxxx.mongodb.net/hogarya?retryWrites=true&w=majority
   ```

---

### 2️⃣ Configurar Backend

#### a) Instalar Dependencias
```bash
cd backend
pnpm install
```

#### b) Configurar Variables de Entorno
Edita el archivo `backend/.env`:

```env
MONGODB_URI=mongodb+srv://hogarya_admin:TU_PASSWORD@hogarya-cluster.xxxxx.mongodb.net/hogarya?retryWrites=true&w=majority
JWT_SECRET=hogarya_super_secreto_jwt_key_2024_cambiar_en_produccion
PORT=5000
NODE_ENV=development
```

⚠️ **Reemplaza `TU_PASSWORD` y el cluster URL con tus valores reales**

#### c) Inicializar Base de Datos con Datos de Prueba
```bash
pnpm run seed
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

📝 Credenciales de prueba:
   Cliente: cliente@hogarya.com / password123
   Trabajador: carlos.martinez@hogarya.com / password123
```

#### d) Iniciar Backend
```bash
pnpm run dev
```

Deberías ver:
```
✅ MongoDB conectado exitosamente
🚀 Servidor corriendo en puerto 5000
📍 URL: http://localhost:5000
🌐 Ambiente: development
```

---

### 3️⃣ Verificar Backend

Abre tu navegador en: [http://localhost:5000](http://localhost:5000)

Deberías ver:
```json
{
  "success": true,
  "message": "HogarYa API funcionando correctamente",
  "version": "1.0.0"
}
```

#### Probar Endpoints (Postman/Thunder Client)

**1. Registrar usuario:**
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456",
  "nombre": "Usuario Test",
  "tipo": "cliente",
  "telefono": "300-000-0000"
}
```

**2. Login:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "cliente@hogarya.com",
  "password": "password123"
}
```

Respuesta (copia el `access_token`):
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "cliente@hogarya.com",
    "nombre": "Cliente Prueba",
    "tipo": "cliente"
  }
}
```

**3. Obtener trabajadores:**
```http
GET http://localhost:5000/api/trabajadores
```

---

### 4️⃣ Iniciar Frontend

En otra terminal:

```bash
pnpm run dev
```

El frontend arrancará en el puerto habitual y ahora se conectará al backend de Express en lugar de Supabase.

---

### 5️⃣ Probar la Aplicación Completa

1. **Registro:**
   - Ve a [http://localhost:5173/signup](http://localhost:5173/signup)
   - Registra un nuevo usuario tipo "Cliente"
   - Deberías ser redirigido automáticamente al dashboard

2. **Login:**
   - Ve a [http://localhost:5173/login](http://localhost:5173/login)
   - Ingresa: `cliente@hogarya.com` / `password123`
   - Deberías entrar al dashboard de cliente

3. **Ver Catálogo:**
   - Ve a [http://localhost:5173/catalogo](http://localhost:5173/catalogo)
   - Deberías ver los 6 trabajadores de prueba
   - Prueba buscar por nombre o servicio
   - Prueba filtrar por categoría

4. **Dashboard Trabajador:**
   - Cierra sesión
   - Login con: `carlos.martinez@hogarya.com` / `password123`
   - Edita tu perfil de trabajador
   - Actualiza servicios, descripción, disponibilidad

---

## 🔄 Cambios Realizados

### ✅ Backend Nuevo (Express + TypeScript)
- **Servidor:** Express con TypeScript
- **Base de datos:** MongoDB Atlas (cloud)
- **ORM:** Mongoose
- **Autenticación:** JWT + bcrypt (sin Supabase Auth)
- **Estructura:**
  - 3 modelos: Usuario, Trabajador, Reseña
  - 4 controladores: auth, trabajadores, reseñas, perfil
  - Middleware de autenticación JWT
  - Error handling centralizado

### ✅ Frontend Actualizado
- **API Client:** `/src/app/utils/api.ts` actualizado
- **Endpoints:** Cambiados de Supabase Edge Functions a Express
- **Sin cambios:** Componentes, páginas, UI (todo sigue igual)

### ✅ Eliminado
- ❌ Todo el directorio `/supabase`
- ❌ Credenciales de Supabase (`/utils/supabase/info.tsx`)
- ❌ Referencias a `@supabase/supabase-js`

---

## 📊 Comparación: Antes vs Después

| Aspecto | Antes (Supabase) | Después (MongoDB) |
|---------|------------------|-------------------|
| **Base de datos** | PostgreSQL + KV Store | MongoDB Atlas |
| **Autenticación** | Supabase Auth | JWT Custom |
| **Backend** | Edge Functions (Deno) | Express (Node.js) |
| **Hosting BD** | Supabase Cloud | MongoDB Atlas |
| **Costo** | Gratis hasta límites | Gratis hasta 512MB |
| **Control** | Limitado | Total |
| **Escalabilidad** | Automática | Manual/Configurable |

---

## 🚀 Deployment Futuro

### Backend

**Opción 1: Railway (Recomendado)**
1. Conecta tu repo GitHub
2. Selecciona la carpeta `backend`
3. Configura variables de entorno (MONGODB_URI, JWT_SECRET)
4. Deploy automático

**Opción 2: Render**
1. New Web Service
2. Build: `cd backend && pnpm install && pnpm build`
3. Start: `cd backend && pnpm start`
4. Variables de entorno en dashboard

**Opción 3: Fly.io**
```bash
cd backend
fly launch
fly secrets set MONGODB_URI=... JWT_SECRET=...
fly deploy
```

### Frontend

Sigue usando el deployment actual, solo actualiza la variable de entorno:
```
VITE_API_URL=https://tu-backend.railway.app/api
```

---

## ⚠️ Notas Importantes

1. **MongoDB Atlas gratis:** Hasta 512MB de almacenamiento. Después cobra ~$0.10/GB/mes
2. **JWT_SECRET:** Genera uno nuevo para producción: `openssl rand -base64 32`
3. **CORS:** En producción, configura dominios específicos en `backend/src/server.ts`
4. **IP Whitelist:** En producción de MongoDB Atlas, agregar solo IPs del servidor
5. **Datos de producción:** Si tenías usuarios reales en Supabase, exportarlos antes (CSV/JSON)

---

## 🆘 Troubleshooting

### Backend no conecta a MongoDB
```
Error: MongoServerError: bad auth
```
**Solución:** Verifica usuario/password en MongoDB Atlas y connection string

---

### Frontend no se conecta al backend
```
Error: Failed to fetch
```
**Solución:** 
1. Verifica que backend esté corriendo en puerto 5000
2. Revisa la URL en `src/app/utils/api.ts`

---

### Error: "MongoNetworkError"
```
MongoNetworkError: connection timed out
```
**Solución:** Agrega tu IP en "Network Access" de MongoDB Atlas

---

## ✅ Checklist de Verificación

- [ ] MongoDB Atlas configurado con cluster M0 gratuito
- [ ] Usuario de base de datos creado
- [ ] IP whitelist configurada (0.0.0.0/0 para dev)
- [ ] Connection string copiado y configurado en `.env`
- [ ] Dependencias del backend instaladas (`pnpm install`)
- [ ] Seed ejecutado exitosamente (`pnpm run seed`)
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo y conectándose al backend
- [ ] Login funcionando con credenciales de prueba
- [ ] Catálogo mostrando trabajadores
- [ ] Dashboard de trabajador funcionando

---

## 📞 Próximos Pasos

1. ✅ **Probarlo todo localmente**
2. 🔐 **Cambiar JWT_SECRET** para uno más seguro
3. 🌐 **Deploy del backend** (Railway/Render)
4. 🔗 **Actualizar frontend** con URL de producción
5. 📊 **Migrar datos reales** (si había usuarios en Supabase)
6. 🎨 **Seguir con el desarrollo** de nuevas features

---

**¡Migración completada! 🎉**

MongoDB Atlas + Express está listo. HogarYa ahora tiene control total sobre su backend.
