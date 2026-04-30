# HogarYa - Plataforma de Servicios del Hogar

## 📋 Descripción

HogarYa es una plataforma completa de servicios del hogar en Barranquilla, similar a TaskRabbit. Conecta clientes que necesitan servicios (reparaciones, mudanzas, limpieza, etc.) con trabajadores verificados.

## 🎨 Paleta de Colores

La aplicación utiliza una paleta específica de colores azules:

- **#A7EBF2** - Claro (acentos y textos secundarios)
- **#54ACBF** - Secundario (botones primarios)
- **#26658C** - Medio (cards secundarias)
- **#023859** - Oscuro (cards principales)
- **#011C40** - Fondo principal

## 🚀 Características Principales

### 1. Landing Page Pública
- Hero con CTA destacado "Buscar trabajadores"
- Sección de servicios disponibles
- Cómo funciona (3 pasos)
- Sección de confianza y beneficios
- Botones: Iniciar sesión, Registrarse, Ser trabajador

### 2. Sistema de Autenticación
- Registro de usuarios (cliente o trabajador)
- Inicio de sesión
- Manejo de sesiones con Supabase Auth
- Protección de rutas

### 3. Panel de Cliente
- Perfil editable (nombre, teléfono)
- Acceso rápido al catálogo de trabajadores
- Opción para convertirse en trabajador

### 4. Catálogo de Trabajadores (COMPONENTE CLAVE)
- Lista dinámica desde base de datos
- Muestra: Nombre, servicios, calificación, estado
- **Buscador por palabras clave**: "necesito arreglar una tubería"
- **Filtros por tipo de servicio**
- Filtrado automático por disponibilidad
- Botones de contacto:
  - WhatsApp (mensaje pre-escrito)
  - Llamada telefónica
- Diseño tipo tarjetas moderno

### 5. Panel de Trabajador
- Estadísticas (calificación, # reseñas, estado)
- Edición de perfil profesional:
  - Servicios ofrecidos (agregar/eliminar)
  - Descripción profesional
  - Teléfono de contacto
- **Toggle de disponibilidad**:
  - Disponible: aparece en catálogo
  - Ocupado: no aparece en catálogo
- Visualización de reseñas recibidas
- Consejos para trabajadores

### 6. Formulario de Solicitud para Trabajadores
- Formulario completo de aplicación
- Mensaje de confirmación al enviar
- Próximos pasos explicados

## 🗄️ Estructura de Base de Datos

La aplicación usa el sistema KV Store de Supabase con las siguientes estructuras:

### Usuarios
```typescript
{
  id: string
  email: string
  nombre: string
  tipo: 'cliente' | 'trabajador'
  telefono: string
  createdAt: string
}
```

### Trabajadores
```typescript
{
  id: string
  user_id: string
  nombre: string
  servicios: string[]
  descripcion: string
  disponible: boolean
  calificacion: number
  telefono: string
  numReseñas: number
  createdAt: string
}
```

### Reseñas
```typescript
{
  id: string
  trabajador_id: string
  cliente_id: string
  cliente_nombre: string
  puntuacion: number (1-5)
  comentario: string
  createdAt: string
}
```

## 📁 Estructura del Proyecto

```
/src
  /app
    /pages
      Landing.tsx              # Página principal pública
      Login.tsx                # Inicio de sesión
      Signup.tsx               # Registro
      Catalogo.tsx             # Catálogo de trabajadores (CLAVE)
      ClienteDashboard.tsx     # Panel del cliente
      TrabajadorDashboard.tsx  # Panel del trabajador
      SolicitarTrabajador.tsx  # Formulario de solicitud
    /utils
      api.ts                   # Funciones de API
    routes.tsx                 # Configuración de rutas
    App.tsx                    # Componente principal
  /styles
    theme.css                  # Paleta de colores HogarYa

/supabase/functions/server
  index.tsx                    # Servidor backend (Hono)
  kv_store.tsx                 # Utilidades KV Store (protegido)
```

## 🔌 API Endpoints (Backend)

### Autenticación
- `POST /make-server-60bda1ce/signup` - Registro de usuario
- `POST /make-server-60bda1ce/login` - Inicio de sesión
- `GET /make-server-60bda1ce/session` - Verificar sesión

### Trabajadores
- `GET /make-server-60bda1ce/trabajadores` - Listar todos (solo disponibles)
- `GET /make-server-60bda1ce/trabajadores/:id` - Obtener por ID
- `PUT /make-server-60bda1ce/trabajadores/:id` - Actualizar (requiere auth)
- `GET /make-server-60bda1ce/trabajadores/buscar/:query` - Buscar por palabras clave

### Reseñas
- `POST /make-server-60bda1ce/reseñas` - Crear reseña (requiere auth)
- `GET /make-server-60bda1ce/reseñas/:trabajador_id` - Listar por trabajador

### Perfil
- `PUT /make-server-60bda1ce/perfil` - Actualizar perfil (requiere auth)

### Datos de prueba
- `POST /make-server-60bda1ce/init-data` - Inicializar 6 trabajadores de prueba

## 🎯 Flujo de Usuario

### Cliente:
1. Registrarse como "Cliente"
2. Explorar catálogo de trabajadores
3. Buscar por servicio o palabra clave
4. Filtrar por tipo de servicio
5. Ver perfiles con calificaciones
6. Contactar por WhatsApp o llamada

### Trabajador:
1. Registrarse como "Trabajador"
2. Completar perfil profesional
3. Agregar servicios ofrecidos
4. Configurar disponibilidad
5. Recibir contactos de clientes
6. Acumular reseñas

## 🔐 Seguridad

- Autenticación con Supabase Auth
- Tokens JWT para sesiones
- Rutas protegidas en backend
- Validación de permisos (usuarios solo pueden editar su propio perfil)
- Service Role Key solo en backend

## 📱 Diseño Responsive

- Mobile-first approach
- Grid adaptable (1 col móvil, 2-3 cols desktop)
- Navegación optimizada para móvil
- Botones grandes y táctiles
- Tipografía escalable

## 🎨 Estilo UI/UX

- Moderno y minimalista
- Bordes redondeados (0.75rem)
- Sombras suaves en cards
- Transiciones suaves
- Inspirado en Uber/Rappi/TaskRabbit
- Iconos de Lucide React

## 🚀 Cómo Usar

### Primera vez:
1. La app inicializará automáticamente 6 trabajadores de prueba
2. Puedes registrarte como cliente o trabajador
3. Explora el catálogo sin necesidad de cuenta

### Como Cliente:
1. Regístrate con tipo "Cliente"
2. Ve a "Buscar trabajadores"
3. Usa el buscador: "necesito plomero"
4. O filtra por servicio
5. Contacta directamente por WhatsApp

### Como Trabajador:
1. Regístrate con tipo "Trabajador"
2. Completa tu perfil en el dashboard
3. Agrega tus servicios (Plomería, Electricidad, etc.)
4. Activa tu disponibilidad
5. Los clientes te verán en el catálogo

## 📊 Datos de Prueba Incluidos

La app crea automáticamente 6 trabajadores:

1. **Carlos Martínez** - Plomería, Electricidad (4.8⭐, 24 reseñas)
2. **María González** - Limpieza, Organización (5.0⭐, 45 reseñas)
3. **José Ramírez** - Carpintería, Reparaciones (4.5⭐, 18 reseñas)
4. **Ana López** - Pintura, Decoración (4.9⭐, 32 reseñas)
5. **Pedro Suárez** - Mudanzas, Transporte (4.6⭐, 28 reseñas, NO disponible)
6. **Laura Díaz** - Jardinería, Paisajismo (4.7⭐, 21 reseñas)

## 🛠️ Stack Tecnológico

### Frontend:
- React 18.3
- React Router 7 (Data mode)
- Tailwind CSS 4
- Lucide React (iconos)
- Sonner (notificaciones)
- Radix UI (componentes)

### Backend:
- Deno (runtime)
- Hono (web framework)
- Supabase (base de datos + auth)
- KV Store (almacenamiento)

## ⚠️ Notas Importantes

1. **Datos de prueba**: Se inicializan automáticamente al cargar el catálogo por primera vez
2. **Disponibilidad**: Solo trabajadores con `disponible: true` aparecen en el catálogo
3. **Búsqueda**: Busca en nombre, descripción y servicios del trabajador
4. **Contacto directo**: WhatsApp y llamadas son directas (no hay chat interno)
5. **Sin comisiones**: La plataforma conecta, el pago es directo entre cliente y trabajador

## 🔄 Próximas Mejoras Sugeridas

- [ ] Sistema de citas/reservas
- [ ] Chat interno
- [ ] Historial de trabajos
- [ ] Sistema de pagos integrado
- [ ] Verificación de identidad mejorada
- [ ] Notificaciones push
- [ ] Geolocalización
- [ ] Múltiples fotos de perfil
- [ ] Portafolio de trabajos
- [ ] Sistema de favoritos

## 📞 Contacto en la App

- WhatsApp: Mensaje pre-configurado con nombre del trabajador
- Teléfono: Marcado directo desde la app

## 🎓 Aprendizajes del Proyecto

Este proyecto demuestra:
- Arquitectura cliente-servidor completa
- Autenticación y autorización
- CRUD completo con base de datos
- Búsqueda y filtrado dinámico
- Diseño responsive moderno
- UX optimizada para servicios locales
- Integración con apps externas (WhatsApp)

---

**Creado para Barranquilla** 🇨🇴
**HogarYa - Tu hogar, nuestro trabajo** 🏠
