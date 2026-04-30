# 💻 Guía de Desarrollo - HogarYa

## 🏗️ Arquitectura de la Aplicación

### Patrón de Diseño
La aplicación sigue una **arquitectura de tres capas**:

```
┌─────────────────────────────────────┐
│         FRONTEND (React)            │
│  - Componentes de UI                │
│  - Gestión de estado local          │
│  - Navegación (React Router)        │
└─────────────┬───────────────────────┘
              │ HTTP/REST
┌─────────────▼───────────────────────┐
│      BACKEND (Hono + Deno)          │
│  - Endpoints REST API               │
│  - Lógica de negocio                │
│  - Autenticación JWT                │
└─────────────┬───────────────────────┘
              │ KV Store API
┌─────────────▼───────────────────────┐
│    BASE DE DATOS (Supabase KV)      │
│  - Usuarios                         │
│  - Trabajadores                     │
│  - Reseñas                          │
└─────────────────────────────────────┘
```

## 📂 Estructura de Archivos

```
hogarya/
├── src/
│   ├── app/
│   │   ├── pages/               # Páginas de la aplicación
│   │   │   ├── Landing.tsx      # Página principal
│   │   │   ├── Login.tsx        # Inicio de sesión
│   │   │   ├── Signup.tsx       # Registro
│   │   │   ├── Catalogo.tsx     # Catálogo de trabajadores ⭐
│   │   │   ├── ClienteDashboard.tsx
│   │   │   ├── TrabajadorDashboard.tsx
│   │   │   └── SolicitarTrabajador.tsx
│   │   ├── components/
│   │   │   ├── ui/              # Componentes UI reutilizables
│   │   │   └── figma/           # Componentes Figma
│   │   ├── utils/
│   │   │   └── api.ts           # Funciones de API ⭐
│   │   ├── routes.tsx           # Configuración de rutas
│   │   └── App.tsx              # Componente raíz
│   └── styles/
│       ├── index.css
│       ├── fonts.css
│       ├── tailwind.css
│       └── theme.css            # Paleta de colores HogarYa ⭐
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx        # Servidor backend ⭐
│           └── kv_store.tsx     # [PROTEGIDO]
├── utils/
│   └── supabase/
│       └── info.tsx             # Credenciales Supabase [AUTO-GENERADO]
└── package.json
```

## 🔑 Archivos Clave

### 1. `/src/app/utils/api.ts`
**Propósito**: Centraliza todas las llamadas a la API

```typescript
// Ejemplo de uso:
import { auth, trabajadores } from '../utils/api';

// Login
const response = await auth.login(email, password);

// Obtener trabajadores
const data = await trabajadores.getAll();

// Buscar
const results = await trabajadores.search('plomería');
```

**Funciones disponibles**:
- `auth.signup()` - Registro
- `auth.login()` - Inicio de sesión
- `auth.logout()` - Cerrar sesión
- `auth.getSession()` - Verificar sesión
- `auth.getCurrentUser()` - Usuario actual (localStorage)
- `trabajadores.getAll()` - Listar todos
- `trabajadores.getById(id)` - Obtener por ID
- `trabajadores.update(id, data)` - Actualizar
- `trabajadores.search(query)` - Buscar
- `reseñas.create()` - Crear reseña
- `reseñas.getByTrabajador(id)` - Listar por trabajador
- `perfil.update(data)` - Actualizar perfil
- `initData()` - Inicializar datos de prueba

### 2. `/supabase/functions/server/index.tsx`
**Propósito**: Servidor backend con todos los endpoints

**Estructura**:
```typescript
// Autenticación
POST /make-server-60bda1ce/signup
POST /make-server-60bda1ce/login
GET  /make-server-60bda1ce/session

// Trabajadores
GET  /make-server-60bda1ce/trabajadores
GET  /make-server-60bda1ce/trabajadores/:id
PUT  /make-server-60bda1ce/trabajadores/:id [AUTH]
GET  /make-server-60bda1ce/trabajadores/buscar/:query

// Reseñas
POST /make-server-60bda1ce/reseñas [AUTH]
GET  /make-server-60bda1ce/reseñas/:trabajador_id

// Perfil
PUT  /make-server-60bda1ce/perfil [AUTH]

// Utilidad
POST /make-server-60bda1ce/init-data
GET  /make-server-60bda1ce/health
```

### 3. `/src/app/pages/Catalogo.tsx`
**Propósito**: Componente más importante - Catálogo de trabajadores

**Características**:
- Búsqueda por palabras clave
- Filtrado por servicio
- Contacto directo (WhatsApp/llamada)
- Responsive
- Auto-inicialización de datos

### 4. `/src/styles/theme.css`
**Propósito**: Paleta de colores y variables CSS

**Variables HogarYa**:
```css
--color-hogar-claro: #A7EBF2;
--color-hogar-secundario: #54ACBF;
--color-hogar-medio: #26658C;
--color-hogar-oscuro: #023859;
--color-hogar-fondo: #011C40;
```

## 🔄 Flujo de Datos

### Registro de Usuario
```
1. Usuario completa formulario (Signup.tsx)
   ↓
2. Frontend llama auth.signup() (api.ts)
   ↓
3. POST /signup al backend (index.tsx)
   ↓
4. Supabase Auth crea usuario
   ↓
5. KV Store guarda datos adicionales
   ↓
6. Si es trabajador, crea perfil trabajador
   ↓
7. Auto-login y redirección a dashboard
```

### Búsqueda de Trabajadores
```
1. Usuario escribe en buscador (Catalogo.tsx)
   ↓
2. Click en buscar o Enter
   ↓
3. Frontend llama trabajadores.search(query) (api.ts)
   ↓
4. GET /trabajadores/buscar/:query (index.tsx)
   ↓
5. Backend filtra en KV Store
   ↓
6. Retorna trabajadores que coinciden
   ↓
7. Frontend actualiza lista de resultados
```

### Actualizar Disponibilidad
```
1. Trabajador cambia toggle (TrabajadorDashboard.tsx)
   ↓
2. Frontend llama trabajadores.update(id, {disponible}) (api.ts)
   ↓
3. PUT /trabajadores/:id [con token] (index.tsx)
   ↓
4. Backend verifica autenticación
   ↓
5. Actualiza en KV Store
   ↓
6. Retorna trabajador actualizado
   ↓
7. Frontend actualiza estado local
```

## 🔐 Autenticación

### Flujo de Tokens
```typescript
// 1. Login exitoso
localStorage.setItem('access_token', token);
localStorage.setItem('user', JSON.stringify(user));

// 2. Peticiones subsecuentes
const token = localStorage.getItem('access_token');
headers: {
  'Authorization': `Bearer ${token}`
}

// 3. Backend valida
const token = request.headers.get('Authorization')?.split(' ')[1];
const { data: { user } } = await supabase.auth.getUser(token);

// 4. Logout
localStorage.removeItem('access_token');
localStorage.removeItem('user');
```

## 🎨 Guía de Estilos

### Colores en Código
```jsx
// Fondo principal
style={{ backgroundColor: '#011C40' }}

// Cards principales
style={{ backgroundColor: '#023859' }}

// Cards secundarias
style={{ backgroundColor: '#26658C' }}

// Botones primarios
style={{ backgroundColor: '#54ACBF', color: 'white' }}

// Textos secundarios
style={{ color: '#A7EBF2' }}
```

### Componentes UI Reutilizables
```jsx
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
```

## 🚀 Agregar Nueva Funcionalidad

### Ejemplo: Agregar campo "Ubicación" a trabajadores

#### 1. Actualizar estructura de datos (Backend)
```typescript
// En /supabase/functions/server/index.tsx

// Endpoint signup - agregar campo
const trabajador = {
  // ... campos existentes
  ubicacion: body.ubicacion || '', // NUEVO
};

// Endpoint update - permitir actualizar
const trabajadorActualizado = {
  // ... campos existentes
  ubicacion: body.ubicacion ?? trabajadorActual.ubicacion, // NUEVO
};
```

#### 2. Actualizar API (Frontend)
```typescript
// En /src/app/utils/api.ts

export const trabajadores = {
  // ... funciones existentes
  
  update: async (id: string, data: any) => {
    // data ahora puede incluir ubicacion
    return apiRequest(`/trabajadores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
```

#### 3. Actualizar UI (Frontend)
```jsx
// En /src/app/pages/TrabajadorDashboard.tsx

const [formData, setFormData] = useState({
  // ... campos existentes
  ubicacion: '', // NUEVO
});

// En el formulario
<div>
  <Label className="text-white mb-2 block">Ubicación</Label>
  {editing ? (
    <Input
      value={formData.ubicacion}
      onChange={(e) =>
        setFormData({ ...formData, ubicacion: e.target.value })
      }
      placeholder="Ej: Norte de Barranquilla"
      className="bg-white/10 border-white/20 text-white"
    />
  ) : (
    <p style={{ color: '#A7EBF2' }}>
      {trabajador.ubicacion || 'No especificada'}
    </p>
  )}
</div>
```

#### 4. Actualizar catálogo (opcional)
```jsx
// En /src/app/pages/Catalogo.tsx

// Mostrar ubicación en tarjeta de trabajador
{trabajador.ubicacion && (
  <p className="text-sm" style={{ color: '#A7EBF2' }}>
    📍 {trabajador.ubicacion}
  </p>
)}
```

## 🧪 Testing

### Probar endpoints manualmente

```bash
# Signup
curl -X POST http://localhost:54321/functions/v1/make-server-60bda1ce/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -d '{"email":"test@test.com","password":"test123","nombre":"Test","tipo":"cliente"}'

# Login
curl -X POST http://localhost:54321/functions/v1/make-server-60bda1ce/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get trabajadores
curl http://localhost:54321/functions/v1/make-server-60bda1ce/trabajadores \
  -H "Authorization: Bearer [ANON_KEY]"

# Buscar
curl http://localhost:54321/functions/v1/make-server-60bda1ce/trabajadores/buscar/plomeria \
  -H "Authorization: Bearer [ANON_KEY]"
```

### Debug en Frontend

```jsx
// En cualquier componente
console.log('Estado actual:', state);
console.log('Datos recibidos:', data);
console.log('Error:', error);

// En api.ts ya hay manejo de errores
try {
  const data = await trabajadores.getAll();
  console.log('Trabajadores:', data);
} catch (error) {
  console.error('Error cargando:', error);
}
```

## 🔧 Debugging Común

### Error: "No autorizado"
```
Causa: Token inválido o expirado
Solución: 
1. Verificar que localStorage tenga 'access_token'
2. Hacer logout y login de nuevo
3. Verificar headers en request
```

### Error: "Trabajadores no cargan"
```
Causa: Datos no inicializados
Solución:
1. Esperar 2-3 segundos (auto-inicialización)
2. Refrescar página
3. Verificar consola por errores
```

### Error: "No aparezco en catálogo"
```
Causa: disponible = false
Solución:
1. Ir a dashboard trabajador
2. Activar toggle "Disponible"
3. Guardar cambios
4. Recargar catálogo
```

## 📝 Mejores Prácticas

### 1. Manejo de Estado
```jsx
// ✅ BIEN - Estado específico
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// ❌ MAL - Estado genérico
const [state, setState] = useState({});
```

### 2. Llamadas a API
```jsx
// ✅ BIEN - Con manejo de errores
try {
  setLoading(true);
  const data = await trabajadores.getAll();
  setTrabajadores(data.trabajadores);
} catch (error) {
  console.error('Error:', error);
  toast.error('Error al cargar');
} finally {
  setLoading(false);
}

// ❌ MAL - Sin manejo
const data = await trabajadores.getAll();
setTrabajadores(data.trabajadores);
```

### 3. Validación de Datos
```jsx
// ✅ BIEN - Validar antes de usar
if (response.success && response.trabajadores) {
  setTrabajadores(response.trabajadores);
}

// ❌ MAL - Asumir estructura
setTrabajadores(response.trabajadores);
```

### 4. Componentes
```jsx
// ✅ BIEN - Componentes pequeños y reutilizables
const TrabajadorCard = ({ trabajador }) => { ... };

// ❌ MAL - Todo en un componente gigante
const Catalogo = () => {
  // 500 líneas de código...
};
```

## 🎯 Performance

### Optimizaciones Implementadas
- ✅ Lazy loading de páginas con React Router
- ✅ Búsqueda y filtrado en backend
- ✅ localStorage para sesión (evita llamadas)
- ✅ Inicialización única de datos de prueba
- ✅ Componentes UI optimizados (Radix)

### Futuras Optimizaciones
- [ ] Paginación en catálogo
- [ ] Cache de resultados de búsqueda
- [ ] Debounce en buscador
- [ ] Virtualización de listas largas
- [ ] Service Worker para offline

## 📚 Recursos

### Documentación Oficial
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/docs)
- [Hono](https://hono.dev/)
- [Lucide Icons](https://lucide.dev/)

### Componentes UI
- [Radix UI](https://www.radix-ui.com/)
- [Sonner (Toasts)](https://sonner.emilkowal.ski/)

## 🐛 Reporte de Issues

Si encuentras un bug:

1. **Verifica la consola** del navegador
2. **Revisa el network tab** para ver requests
3. **Verifica el backend log** (console.log en servidor)
4. **Reproduce el error** en pasos claros
5. **Documenta** el comportamiento esperado vs real

## 🎓 Próximos Pasos de Aprendizaje

### Para mejorar la app:
1. Agregar sistema de favoritos
2. Implementar chat interno
3. Sistema de notificaciones
4. Geolocalización de trabajadores
5. Múltiples fotos de perfil
6. Portafolio de trabajos realizados
7. Sistema de citas/agendamiento
8. Integración de pagos (Stripe/PayPal)

### Para aprender más:
1. Testing con Jest/Vitest
2. E2E testing con Playwright
3. CI/CD con GitHub Actions
4. Deployment en Vercel/Netlify
5. Monitoreo con Sentry
6. Analytics con Posthog

---

**Happy Coding! 🚀**
