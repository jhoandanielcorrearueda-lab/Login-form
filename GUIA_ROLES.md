# 🔐 Guía del Sistema de Verificación de Roles - Yesmau Moda

## 📖 Resumen

Este sistema garantiza que solo personas autorizadas tengan acceso al panel administrativo. El administrador principal (`admin@yesmau.com`) tiene control total sobre quién puede acceder y qué permisos tiene cada usuario.

---

## 🎯 Roles Disponibles

### 1. **Administrador** 👑
- **Único**: Solo `admin@yesmau.com`
- **Privilegios**:
  - Acceso completo al sistema
  - Gestión de usuarios y asignación de roles
  - Todas las operaciones CRUD
  - Gestión de permisos
  - Acceso a auditoría

### 2. **Empleado** 👔
- **Acceso**:
  - Dashboard y métricas
  - Ver y gestionar productos
  - Crear ventas
  - Ver inventario
  - Ver proveedores
- **Restricciones**:
  - No puede gestionar usuarios
  - No puede cambiar permisos

### 3. **Cliente** 🛍️
- **Acceso**:
  - Ver catálogo de productos
  - Crear órdenes de compra
- **Restricciones**:
  - No puede ver inventario completo
  - No puede gestionar otros usuarios

### 4. **Proveedor** 🚚
- **Acceso**:
  - Ver productos
  - Ver información de proveedores
  - Crear órdenes de compra
- **Restricciones**:
  - No puede ver ventas
  - No puede gestionar inventario completo

### 5. **Pendiente** ⏳
- **Estado temporal**: Usuario recién registrado
- **Acceso**: NINGUNO - No puede entrar al dashboard
- **Debe esperar**: Aprobación del administrador

---

## 🔄 Flujo de Registro y Acceso

### Para Usuarios Nuevos:

```
1. Usuario va a la página pública
   ↓
2. Hace clic en "Iniciar Sesión" → "Regístrate"
   ↓
3. Completa el formulario de registro
   ↓
4. Sistema le asigna automáticamente:
   - Rol: "Cliente"
   - Estado: "Activo"
   ↓
5. Ve mensaje: "¡Registro exitoso! Ya puedes iniciar sesión"
   ↓
6. Inicia sesión inmediatamente
   ↓
7. ✅ Accede al dashboard como Cliente
   ↓
8. Puede ver productos y hacer compras
```

### Para el Administrador (Cambio de Roles):

```
1. Inicia sesión como admin@yesmau.com
   ↓
2. Va a "Usuarios & Roles"
   ↓
3. Ve tabla de "Usuarios Activos"
   ↓
4. Encuentra al usuario que necesita cambio de rol
   ↓
5. Clic en ícono de editar (lápiz)
   ↓
6. Selecciona el nuevo rol:
   - Empleado (si trabaja en la empresa)
   - Proveedor (si va a suministrar telas)
   - Mantener Cliente (si solo compra)
   ↓
7. Clic en ✓ (guardar)
   ↓
8. ✅ Cambio aplicado inmediatamente
```

---

## 🛡️ Medidas de Seguridad

### ✅ Protecciones Implementadas:

1. **Verificación de Email**: Solo `admin@yesmau.com` es administrador automáticamente

2. **Aprobación Manual**: Todos los demás usuarios deben ser aprobados

3. **Sin Acceso Previo**: Usuarios pendientes no pueden ver ningún dato del sistema

4. **Roles Inmutables**: El administrador principal no puede ser degradado

5. **Restricciones por Módulo**: Cada rol solo ve lo que le corresponde

### ⚠️ Importante:

- **NO compartas** la contraseña de `admin@yesmau.com`
- **Cambia la contraseña** en producción inmediatamente
- **Revisa periódicamente** los usuarios pendientes
- **Asigna roles** solo a personas de confianza

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Nuevo Empleado

```
Juan se une a Yesmau Moda como vendedor:

1. Juan se registra con juan@ejemplo.com
2. Sistema: "¡Registro exitoso! Ya puedes iniciar sesión"
3. Juan inicia sesión automáticamente como Cliente
4. Juan contacta al administrador para que le cambie el rol
5. Administrador cambia rol de Juan a: "Empleado"
6. Juan cierra sesión y vuelve a entrar
7. Juan ve: Dashboard, Productos, Ventas, Inventario
```

### Ejemplo 2: Cliente Regular

```
María quiere comprar telas:

1. María se registra con maria@gmail.com
2. Sistema: "¡Registro exitoso! Ya puedes iniciar sesión"
3. María inicia sesión automáticamente como Cliente
4. María ve: Catálogo de productos, Carrito de compras
5. ✅ Empieza a comprar inmediatamente
```

### Ejemplo 3: Proveedor de Telas

```
TextilSur S.A. quiere suministrar telas:

1. Se registra con ventas@textilsur.com
2. Sistema: "¡Registro exitoso! Ya puedes iniciar sesión"
3. Inicia sesión automáticamente como Cliente
4. Contacta al administrador para solicitar rol de Proveedor
5. Administrador cambia rol a: "Proveedor"
6. TextilSur cierra sesión y vuelve a entrar
7. TextilSur ve: Productos, Órdenes de compra, Inventario
```

---

## 🔧 Cambio de Roles

El administrador puede cambiar el rol de usuarios activos:

1. Ir a "Usuarios & Roles" → Pestaña "Usuarios"
2. En la tabla de "Usuarios Activos"
3. Clic en el ícono de editar (lápiz)
4. Seleccionar nuevo rol del dropdown
5. Clic en guardar (✓)
6. El cambio es inmediato

**Nota**: No se puede cambiar el rol del administrador principal.

---

## ❓ Preguntas Frecuentes

**P: ¿Todos los usuarios nuevos tienen que esperar aprobación?**
R: No, todos pueden acceder inmediatamente como Cliente. Solo necesitan aprobación si requieren un rol diferente (Empleado o Proveedor).

**P: ¿Puedo tener múltiples administradores?**
R: No automáticamente. Solo `admin@yesmau.com` es admin por defecto. Tendrías que modificar el código para agregar más.

**P: ¿Qué pasa si olvido la contraseña de admin?**
R: Deberás modificar directamente el código o la base de datos. Por eso es importante guardarla en un lugar seguro.

**P: ¿Un cliente puede comprar inmediatamente después de registrarse?**
R: Sí, ese es el objetivo. Sin barreras de entrada para facilitar las ventas.

**P: ¿Puedo cambiar un Cliente a Empleado?**
R: Sí, el administrador puede cambiar roles en cualquier momento desde el módulo "Usuarios & Roles".

**P: ¿Los cambios de rol son inmediatos?**
R: Sí, pero el usuario debe cerrar sesión y volver a entrar para que el cambio se refleje completamente.

**P: ¿Puede un usuario tener múltiples roles?**
R: No, cada usuario tiene exactamente un rol a la vez.

---

## 🚀 Próximos Pasos Recomendados

1. **Cambiar contraseña** del administrador
2. **Crear backup** de la base de datos de usuarios
3. **Implementar recuperación** de contraseña
4. **Agregar logs** de cambios de roles (auditoría)
5. **Notificaciones** por email cuando se aprueba un usuario

---

**Desarrollado para Yesmau Moda** 💗
