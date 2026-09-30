# 🛍️ Yesmau Moda - Sistema de Gestión de Tienda de Telas y Moda

Sistema completo de e-commerce y gestión para tienda de telas y moda juvenil con herramientas inteligentes.

## 🎨 Características Principales

### Vista Pública (Sin registro requerido)
- **Página Principal Moderna**: Hero banner, categorías visuales, estadísticas
- **Catálogo Completo**: 
  - 60+ tipos de telas en 30 colores
  - 20 modelos de vestidos juveniles
  - 15 modelos de camisas
  - 15 modelos de pantalones
  - 15 modelos de faldas
- **Calculadora Inteligente de Talla**: Calcula metros de tela necesarios según medidas
- **Gestión de Retazos**: Sistema de reciclaje para donar o comprar retazos

### Sistema Administrativo (Requiere registro)
- **Autenticación Completa**: Login y registro con validación
- **Dashboard**: Métricas en tiempo real, actividad reciente
- **Usuarios & Roles**: Gestión de permisos (Admin, Empleado, Cliente, Proveedor)
- **Productos**: Gestión de telas y vestidos con favoritos
- **Navegación Modular**: Inventario, Ventas, Facturación, etc.

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <URL-DEL-REPOSITORIO>
   cd yesmau-moda
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   pnpm dev
   # o
   npm run dev
   ```

4. **Abrir en el navegador**
   - El proyecto se abrirá automáticamente
   - URL: http://localhost:5173

## 👥 Sistema de Usuarios y Roles

### 🔐 Acceso Automático como Cliente

**Administrador Único:**
- Solo el correo `admin@yesmau.com` tiene privilegios de administrador automáticamente
- **Email**: admin@yesmau.com
- **Contraseña**: 123456

**Usuarios Nuevos:**
- Todos los usuarios que se registren acceden automáticamente como **Cliente**
- Pueden iniciar sesión inmediatamente después de registrarse
- Tienen acceso a:
  - Ver catálogo completo de productos
  - Agregar al carrito y crear compras
  - Ver sus pedidos

**Cambio de Roles:**
- El administrador puede cambiar el rol de cualquier usuario a:
  - **Empleado**: Acceso a ventas, productos, inventario
  - **Proveedor**: Acceso a productos y órdenes de compra
  - Mantener como **Cliente**: Solo compras

### 📋 Proceso de Registro

1. **Usuario se registra** en la página pública
2. **Sistema asigna** automáticamente rol "Cliente" y estado "Activo"
3. **Usuario puede** iniciar sesión inmediatamente
4. **Usuario accede** al dashboard con permisos de cliente
5. **Administrador** puede cambiar su rol después si es necesario (ej: si es empleado de la empresa)

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS v4
- **Formularios**: React Hook Form
- **Iconos**: Lucide React
- **Build**: Vite
- **Gestión de Paquetes**: pnpm

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── App.tsx                    # Componente principal
│   ├── components/
│   │   ├── Dashboard.tsx          # Dashboard administrativo
│   │   ├── UsuariosRoles.tsx      # Gestión de usuarios y permisos
│   │   ├── Productos.tsx          # Catálogo de productos (admin)
│   │   ├── PublicView.tsx         # Vista pública
│   │   ├── PublicNavbar.tsx       # Navegación pública
│   │   ├── PublicCatalogo.tsx     # Catálogos públicos
│   │   ├── CalculadoraTalla.tsx   # Calculadora de talla
│   │   └── GestionRetazos.tsx     # Gestión de retazos
│   └── styles/
│       ├── theme.css              # Variables de tema
│       └── fonts.css              # Fuentes
```

## 🎨 Paleta de Colores

- **Primary**: #d4768f (Rosa)
- **Secondary**: #fce8ed (Rosa pálido)
- **Background**: #ffffff (Blanco)
- **Foreground**: #4a1a2c (Marrón oscuro)

## 🔐 Sistema de Roles y Permisos

### Administrador
- Acceso completo al sistema
- Gestión de usuarios y permisos
- Todas las operaciones CRUD

### Empleado
- Ver dashboard y productos
- Crear ventas
- Ver inventario

### Cliente
- Ver productos
- Crear ventas (compras)

### Proveedor
- Ver productos
- Crear órdenes de compra

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Vista previa de producción
pnpm preview
```

## 🤝 Colaboración en Equipo

### Workflow de Git

1. **Actualizar rama principal**
   ```bash
   git pull origin main
   ```

2. **Crear rama para nueva funcionalidad**
   ```bash
   git checkout -b feature/nombre-funcionalidad
   ```

3. **Hacer cambios y commit**
   ```bash
   git add .
   git commit -m "feat: descripción de cambios"
   ```

4. **Subir cambios**
   ```bash
   git push origin feature/nombre-funcionalidad
   ```

5. **Crear Pull Request en GitHub/GitLab**

### Convenciones de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de errores
- `docs:` Documentación
- `style:` Formato, sin cambios de código
- `refactor:` Refactorización
- `test:` Agregar tests

## 🚢 Despliegue

### Opciones Recomendadas

1. **Vercel** (Recomendado)
   - Conectar repositorio GitHub
   - Despliegue automático en cada push
   - Gratis para proyectos personales

2. **Netlify**
   - Similar a Vercel
   - Fácil configuración

3. **GitHub Pages**
   - Gratis para repositorios públicos

## 📧 Contacto

Para dudas o sugerencias sobre el proyecto:
- Email: equipo@yesmaumoda.com

## 📄 Licencia

Este proyecto es privado y pertenece a Yesmau Moda.

---

Desarrollado con ❤️ por el equipo de Yesmau Moda
