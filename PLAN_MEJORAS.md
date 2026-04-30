# Plan de Mejoras - HogarYa

## 🔴 PRIORIDAD ALTA - Errores Críticos

### 1. ✅ Error de conexión con el servidor
**Problema:** Backend no inicia por falta de MongoDB URI
**Solución:** Configurar `backend/.env` con credenciales de MongoDB Atlas
**Estado:** En progreso - Esperando credenciales del usuario

### 2. ✅ Error al cargar trabajadores en catálogo
**Problema:** API no responde porque backend no está corriendo
**Solución:** Una vez configurado MongoDB, los trabajadores cargarán automáticamente
**Estado:** Bloqueado por #1

---

## 🟡 PRIORIDAD MEDIA - Funcionalidad Core

### 3. Logo en Header
**Descripción:** Agregar logo de HogarYa en el header de todas las páginas
**Archivos a modificar:**
- Crear componente `Header.tsx`
- Agregar logo en `/src/assets/` o usar texto estilizado
**Tiempo estimado:** 30 min

### 4. Botones de Categoría Funcionales
**Descripción:** Los botones de categorías en Landing deben filtrar trabajadores
**Funcionalidad:**
- Click en categoría → redirige a `/catalogo?categoria=Plomería`
- Catálogo aplica filtro automático
**Archivos a modificar:**
- `/src/app/pages/Landing.tsx` (agregar navegación)
- `/src/app/pages/Catalogo.tsx` (leer query params)
**Tiempo estimado:** 1 hora

### 5. Edición de Perfil Cliente
**Descripción:** Permitir al cliente editar su información personal
**Funcionalidad:**
- Nombre, teléfono, email
- Cambiar contraseña
**Archivos a modificar:**
- `/src/app/pages/ClienteDashboard.tsx` (agregar formulario)
- Backend ya tiene endpoint `/api/perfil` ✅
**Tiempo estimado:** 1.5 horas

### 6. Sistema de Solicitud de Servicio
**Descripción:** Cliente puede solicitar servicio a un trabajador
**Funcionalidad:**
- Click en trabajador → abrir modal/página
- Formulario: tipo servicio, descripción, fecha preferida
- Enviar solicitud (guardar en BD)
**Backend necesario:**
- Nuevo modelo `Solicitud`
- Endpoints CRUD
**Archivos nuevos:**
- `backend/src/models/Solicitud.ts`
- `backend/src/controllers/solicitudes.controller.ts`
- `backend/src/routes/solicitudes.routes.ts`
- `src/app/components/SolicitarServicioModal.tsx`
**Tiempo estimado:** 3 horas

---

## 🟢 PRIORIDAD BAJA - Features Avanzadas

### 7. Sistema de Pago
**Descripción:** Integración con pasarela de pagos
**Opciones:**
- MercadoPago (LATAM)
- Stripe (Internacional)
- PayU (Colombia)
**Consideraciones:**
- Requiere cuenta de comerciante
- Manejo de webhooks
- Comisiones (2-5%)
**Tiempo estimado:** 8-12 horas
**Recomendación:** Dejar para Fase 2

### 8. Sistema de Calificaciones
**Descripción:** Clientes pueden calificar trabajadores después del servicio
**Funcionalidad:**
- Modal de calificación (1-5 estrellas + comentario)
- Asociado a una solicitud completada
- Actualiza promedio del trabajador
**Backend:**
- Ya existe modelo `Reseña` ✅
- Ya existe endpoint `/api/reseñas` ✅
**Frontend:**
- Componente de calificación
- Integrar en flujo post-servicio
**Tiempo estimado:** 2 horas

### 9. Verificación de Cuenta
**Descripción:** Verificar email/teléfono de usuarios
**Opciones:**
- Email: Enviar código por correo (Resend, SendGrid)
- SMS: Enviar código por SMS (Twilio, MessageBird)
**Consideraciones:**
- Requiere servicio externo
- Costos variables
**Tiempo estimado:** 4-6 horas
**Recomendación:** Dejar para Fase 2

### 10. Recuperación de Contraseña
**Descripción:** "Olvidé mi contraseña"
**Funcionalidad:**
- Enviar código/link por email
- Resetear contraseña
**Backend necesario:**
- Endpoint `/api/auth/forgot-password`
- Endpoint `/api/auth/reset-password`
- Tokens de recuperación temporales
**Tiempo estimado:** 3 horas

### 11. Formulario de Postulación Trabajador
**Descripción:** Nuevos trabajadores pueden postularse
**Funcionalidad:**
- Formulario público en `/postularse`
- Campos: nombre, servicios, experiencia, documentos
- Admin revisa y aprueba
**Backend necesario:**
- Modelo `Postulacion`
- Endpoints CRUD
- Sistema de estados (pendiente, aprobado, rechazado)
**Tiempo estimado:** 4 horas

### 12. Sistema de Aprobación de Postulaciones
**Descripción:** Admin puede aprobar/rechazar trabajadores
**Funcionalidad:**
- Panel de administración `/admin`
- Listar postulaciones pendientes
- Aprobar → crear usuario trabajador
**Tiempo estimado:** 3 horas

### 13. Bandeja de Comentarios Pública
**Descripción:** Mostrar todas las reseñas de un trabajador
**Funcionalidad:**
- En perfil de trabajador
- Paginación si hay muchas
- Ordenar por fecha
**Backend:**
- Endpoint ya existe `/api/reseñas/:trabajador_id` ✅
**Frontend:**
- Componente lista de reseñas
**Tiempo estimado:** 1.5 horas

---

## 📊 Resumen de Tiempo

| Prioridad | Features | Tiempo Estimado |
|-----------|----------|-----------------|
| 🔴 Alta | 2 | 1 hora |
| 🟡 Media | 4 | 6.5 horas |
| 🟢 Baja | 7 | 25-35 horas |
| **Total** | **13** | **32-42 horas** |

---

## 🚀 Roadmap Propuesto

### **Fase 1 - MVP Funcional** (1-2 días)
1. ✅ Configurar MongoDB
2. ✅ Logo en Header
3. ✅ Botones de categoría funcionales
4. ✅ Edición perfil cliente
5. ✅ Sistema de solicitudes
6. ✅ Sistema de calificaciones básico

### **Fase 2 - Features Avanzadas** (3-5 días)
7. ⏳ Recuperación de contraseña
8. ⏳ Postulación de trabajadores
9. ⏳ Sistema de aprobación
10. ⏳ Bandeja de comentarios

### **Fase 3 - Monetización** (1-2 semanas)
11. ⏳ Sistema de pagos
12. ⏳ Verificación de cuentas
13. ⏳ Dashboard de admin completo

---

## 🎯 Siguiente Paso

**BLOQUEADO:** Necesitamos configurar MongoDB Atlas primero.

Una vez configurado:
1. Backend arrancará correctamente
2. Trabajadores cargarán en catálogo
3. Login/registro funcionará
4. Podemos empezar Fase 1

---

## 📝 Notas

- Backend ya tiene buena base (JWT, usuarios, trabajadores, reseñas)
- Frontend tiene diseño completo
- Principales carencias: features de negocio (solicitudes, pagos, postulaciones)
