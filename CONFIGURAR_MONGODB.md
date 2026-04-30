# 🚀 Guía Rápida: Configurar MongoDB Atlas (5 minutos)

## ¿Ya tienes MongoDB Atlas configurado?

**SI** → Salta al paso 5 y copia tu connection string
**NO** → Sigue desde el paso 1

---

## Pasos para Crear MongoDB Atlas (Gratis)

### 1️⃣ Crear Cuenta (1 min)
1. Ve a: **https://www.mongodb.com/cloud/atlas/register**
2. Regístrate con Google/GitHub o email
3. Confirma tu email

### 2️⃣ Crear Cluster Gratuito (2 min)
1. Haz clic en **"Create"** o **"Build a Database"**
2. Selecciona **"M0 FREE"** (512MB gratis para siempre)
3. Provider: **AWS**
4. Region: **us-east-1** (o la más cercana a Colombia)
5. Cluster Name: **hogarya-cluster**
6. Clic en **"Create"**

### 3️⃣ Crear Usuario de Base de Datos (30 seg)
Aparecerá un modal "Security Quickstart":

1. **Username:** `hogarya_admin`
2. **Password:** Clic en **"Autogenerate Secure Password"**
3. **⚠️ IMPORTANTE:** Copia la contraseña generada (ej: `Abc123xyz456`)
4. Clic en **"Create User"**

### 4️⃣ Configurar Acceso de Red (30 seg)
En el mismo modal:

1. Clic en **"Add My Current IP Address"**
2. También clic en **"Add a Different IP Address"**
   - IP: `0.0.0.0/0`
   - Description: `Allow All (Development)`
3. Clic en **"Finish and Close"**

### 5️⃣ Obtener Connection String (1 min)
1. En el dashboard, clic en **"Connect"** (botón en tu cluster)
2. Selecciona **"Drivers"**
3. Driver: **Node.js** / Version: **5.5 or later**
4. **Copia** el connection string (se ve así):
   ```
   mongodb+srv://hogarya_admin:<password>@hogarya-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Reemplaza** `<password>` con la contraseña que copiaste en el paso 3

**Ejemplo final:**
```
mongodb+srv://hogarya_admin:Abc123xyz456@hogarya-cluster.xxxxx.mongodb.net/hogarya?retryWrites=true&w=majority
```

⚠️ **Nota:** Agregué `/hogarya` antes del `?` para especificar el nombre de la base de datos.

---

## 6️⃣ Configurar en HogarYa

Edita el archivo `backend/.env` y pega tu connection string:

```env
MONGODB_URI=mongodb+srv://hogarya_admin:TU_PASSWORD@hogarya-cluster.xxxxx.mongodb.net/hogarya?retryWrites=true&w=majority
JWT_SECRET=hogarya_super_secreto_jwt_key_2024_cambiar_en_produccion
PORT=5000
NODE_ENV=development
```

---

## 7️⃣ Inicializar Datos de Prueba

```bash
pnpm run seed
```

Deberías ver:
```
🌱 Iniciando seed de la base de datos...
✅ MongoDB conectado exitosamente
👥 Creando trabajadores...
  ✓ Carlos Martínez creado
  ✓ María González creado
  ...
✅ Seed completado exitosamente!
```

---

## 8️⃣ Iniciar Backend

```bash
pnpm run backend
```

Deberías ver:
```
✅ MongoDB conectado exitosamente
🚀 Servidor corriendo en puerto 5000
```

---

## 9️⃣ Iniciar Frontend (en otra terminal)

```bash
pnpm run dev
```

---

## ✅ ¡Listo!

Ahora puedes:
- Ir a `/catalogo` → Ver 6 trabajadores
- Ir a `/login` → Entrar con `cliente@hogarya.com` / `password123`
- Ir a `/signup` → Registrar nueva cuenta

---

## 🆘 Problemas Comunes

### "MongoServerSelectionError"
**Causa:** Tu IP no está en la whitelist
**Solución:** 
1. Ve a MongoDB Atlas → Network Access
2. Clic en "Add IP Address"
3. Selecciona "Allow Access from Anywhere"

### "Bad auth" o "Authentication failed"
**Causa:** Usuario/contraseña incorrectos
**Solución:** 
1. Verifica que reemplazaste `<password>` en el connection string
2. Si la contraseña tiene caracteres especiales (@#$%), codifícalos:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`

### "Cannot find module 'dotenv'"
**Causa:** Dependencias no instaladas
**Solución:** 
```bash
pnpm install
```

---

## 📞 ¿Necesitas Ayuda?

Pégame tu connection string aquí (borrando la contraseña):
```
mongodb+srv://hogarya_admin:***OCULTO***@hogarya-cluster.xxxxx.mongodb.net/hogarya?retryWrites=true&w=majority
```

Y te ayudo a configurarlo.
