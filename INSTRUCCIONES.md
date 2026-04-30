# 🚀 Instrucciones de Ejecución - HogarYa

## ✅ La aplicación está lista para usar

La aplicación HogarYa está **completamente funcional** y lista para producción.

## 🎯 Cómo empezar a usar la aplicación

### 1️⃣ Primera visita

Cuando abres la aplicación por primera vez:

1. Verás la **Landing Page** con información sobre HogarYa
2. Puedes explorar sin registrarte haciendo clic en **"Buscar trabajadores"**
3. El catálogo se cargará con **6 trabajadores de prueba** automáticamente

### 2️⃣ Crear una cuenta

#### Como Cliente:
```
1. Click en "Registrarse"
2. Completa el formulario:
   - Nombre: Tu nombre completo
   - Email: tu@email.com
   - Teléfono: +57 300 123 4567 (opcional)
   - Contraseña: mínimo 6 caracteres
   - Tipo: Selecciona "Cliente"
3. Click en "Crear cuenta"
4. Serás redirigido al Panel de Cliente
```

#### Como Trabajador:
```
1. Click en "Registrarse"
2. Completa el formulario:
   - Nombre: Tu nombre completo
   - Email: tu@email.com
   - Teléfono: +57 300 123 4567 (recomendado)
   - Contraseña: mínimo 6 caracteres
   - Tipo: Selecciona "Trabajador"
3. Click en "Crear cuenta"
4. Serás redirigido al Panel de Trabajador
5. ¡IMPORTANTE! Edita tu perfil para configurar servicios
```

### 3️⃣ Usar el Catálogo (Funcionalidad Clave)

El catálogo es el corazón de la aplicación:

#### Buscar trabajadores:
```
1. Ve a "Buscar trabajadores" (desde landing o dashboard)
2. Usa el buscador: escribe lo que necesitas
   Ejemplos:
   - "necesito arreglar una tubería"
   - "limpieza de casa"
   - "carpintero"
3. Los resultados se filtran automáticamente
```

#### Filtrar por servicio:
```
1. En el catálogo, verás botones de servicios:
   - Todos
   - Plomería
   - Limpieza
   - Carpintería
   - Etc.
2. Click en cualquier servicio para filtrar
```

#### Contactar trabajador:
```
1. Encuentra el trabajador que necesitas
2. Dos opciones de contacto:
   
   📱 WhatsApp (botón verde):
   - Click y se abrirá WhatsApp
   - Mensaje pre-escrito incluido
   
   📞 Llamar (botón con icono de teléfono):
   - Click para marcar directamente
```

### 4️⃣ Panel de Trabajador

Si te registraste como trabajador:

#### Configurar perfil:
```
1. Click en "Editar" en tu perfil
2. Agrega tus servicios:
   - Escribe el servicio (ej: "Plomería")
   - Click en el botón "+"
   - Repite para todos tus servicios
3. Escribe una descripción profesional
4. Confirma tu teléfono de contacto
5. Click en "Guardar cambios"
```

#### Gestionar disponibilidad:
```
El toggle de disponibilidad es crucial:

✅ DISPONIBLE (ON):
- Apareces en el catálogo
- Los clientes pueden verte
- Recibes contactos

❌ OCUPADO (OFF):
- NO apareces en el catálogo
- Los clientes no te ven
- Útil cuando estés lleno de trabajo
```

### 5️⃣ Solicitar ser trabajador (sin cuenta)

Si no quieres registrarte aún:

```
1. Click en "Quiero ser trabajador" (landing page)
2. Completa el formulario de solicitud
3. Recibirás mensaje de confirmación
4. El equipo de HogarYa te contactará
```

## 🎨 Navegación de la App

### Páginas públicas (sin login):
- `/` - Landing page
- `/login` - Iniciar sesión
- `/signup` - Registrarse
- `/catalogo` - Ver trabajadores (acceso público)
- `/solicitar-trabajador` - Formulario de solicitud

### Páginas protegidas (requieren login):
- `/cliente/dashboard` - Panel del cliente
- `/trabajador/dashboard` - Panel del trabajador

## 📊 Datos de Prueba

La app incluye **6 trabajadores de ejemplo**:

1. **Carlos Martínez** - Plomería, Electricidad
2. **María González** - Limpieza, Organización
3. **José Ramírez** - Carpintería, Reparaciones
4. **Ana López** - Pintura, Decoración
5. **Pedro Suárez** - Mudanzas (NO disponible)
6. **Laura Díaz** - Jardinería, Paisajismo

Nota: Pedro Suárez está marcado como "no disponible" para demostrar el filtrado.

## 🔍 Probar Funcionalidades

### Test 1: Búsqueda inteligente
```
1. Ve al catálogo
2. Escribe: "necesito arreglar tubería"
3. Deberías ver a Carlos Martínez (Plomería)
```

### Test 2: Filtros
```
1. Ve al catálogo
2. Click en el filtro "Limpieza"
3. Deberías ver solo a María González
```

### Test 3: Disponibilidad
```
1. Registrate como trabajador
2. En tu dashboard, desactiva "Disponible"
3. Abre el catálogo en otra pestaña
4. NO deberías aparecer en la lista
5. Vuelve a activar "Disponible"
6. Recarga el catálogo
7. Ahora SÍ deberías aparecer
```

### Test 4: Editar servicios
```
1. Como trabajador, ve a tu dashboard
2. Click en "Editar"
3. Agrega servicio: "Electricidad"
4. Agrega servicio: "Plomería"
5. Guarda cambios
6. Ve al catálogo
7. Filtra por "Electricidad"
8. Deberías aparecer en los resultados
```

### Test 5: WhatsApp
```
1. En el catálogo, encuentra un trabajador
2. Click en botón "WhatsApp" (verde)
3. Se abrirá WhatsApp con mensaje pre-escrito:
   "Hola [Nombre], vi tu perfil en HogarYa..."
```

## 🎯 Casos de Uso Reales

### Caso 1: Cliente busca plomero
```
1. Cliente entra a la app
2. Click en "Buscar trabajadores"
3. Escribe "plomería" o "arreglar tubería"
4. Ve a Carlos Martínez (4.8⭐)
5. Lee su perfil y reseñas
6. Click en WhatsApp para contactar
7. Acuerda servicio directamente
```

### Caso 2: Trabajador se une
```
1. Trabajador entra a la app
2. Click en "Registrarse"
3. Tipo: "Trabajador"
4. Completa registro
5. En dashboard, configura:
   - Servicios: "Electricidad", "Instalaciones"
   - Descripción: "10 años de experiencia..."
   - Teléfono: +57 300 XXX XXXX
6. Activa "Disponible"
7. Ahora los clientes pueden verlo y contactarlo
```

### Caso 3: Trabajador ocupado
```
1. Trabajador tiene mucho trabajo
2. Entra a su dashboard
3. Desactiva el toggle "Disponible"
4. Deja de aparecer en catálogo
5. Cuando termine trabajos, vuelve a activar
```

## ⚙️ Funcionalidades Técnicas

### Autenticación:
- Email y contraseña
- Sesión persistente (localStorage)
- Logout seguro

### Base de datos:
- Supabase KV Store
- Operaciones en tiempo real
- CRUD completo

### Búsqueda:
- Por palabras clave
- Filtra en: nombre, descripción, servicios
- Insensible a mayúsculas/minúsculas

### Filtros:
- Por tipo de servicio
- Solo trabajadores disponibles
- Ordenados por calificación

## 🐛 Solución de Problemas

### No veo trabajadores en el catálogo:
```
Solución: 
1. Espera 2-3 segundos (se inicializan automáticamente)
2. Si persiste, recarga la página
3. Los datos se crean en la primera visita al catálogo
```

### No puedo iniciar sesión:
```
Solución:
1. Verifica email y contraseña
2. La contraseña debe tener mínimo 6 caracteres
3. Si acabas de registrarte, espera 1 segundo
```

### WhatsApp no se abre:
```
Solución:
1. Asegúrate de tener WhatsApp instalado
2. En navegador móvil, debe abrirse automáticamente
3. En desktop, abrirá WhatsApp Web
```

### No aparezco en el catálogo (trabajador):
```
Solución:
1. Verifica que "Disponible" esté activado
2. Asegúrate de haber guardado cambios
3. Recarga la página del catálogo
```

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Móvil (iOS y Android)
- ✅ Tablet
- ✅ Desktop
- ✅ Responsive en todas las resoluciones

## 🎓 Tips para Sacarle el Máximo Provecho

### Para Clientes:
1. Usa palabras descriptivas en la búsqueda
2. Revisa las calificaciones
3. Lee las descripciones de los trabajadores
4. Usa WhatsApp para respuesta rápida

### Para Trabajadores:
1. Completa todo tu perfil
2. Sé específico en servicios
3. Escribe una buena descripción
4. Mantén actualizado tu teléfono
5. Gestiona tu disponibilidad

## 🚀 ¡Listo!

La aplicación está **100% funcional** y lista para usar.

No requiere instalación adicional ni configuración.

Solo abre la app y empieza a explorar.

---

**HogarYa - Conectando hogares en Barranquilla** 🏠
