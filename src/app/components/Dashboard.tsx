import { useState } from 'react';
import {
  Home, Users, Package, Warehouse, ShoppingCart, FileText,
  ShoppingBag, Scissors, Truck, BarChart3, MessageSquare,
  Shield, Menu, X, Bell, Search, ChevronDown, Moon, Sun, User, LogOut, Headphones, AlertCircle, PackageCheck
} from 'lucide-react';
import UsuariosRoles from './UsuariosRoles';
import Productos from './Productos';
import Ventas from './Ventas';
import Facturacion from './Facturacion';
import Comunicacion from './Comunicacion';
import Carrito from './Carrito';
import CarritoConSeguimiento from './CarritoConSeguimiento';
import Proveedores from './Proveedores';
import Inventario from './Inventario';
import Perfil from './Perfil';
import Auditoria from './Auditoria';
import Soporte from './Soporte';
import Incidencias from './Incidencias';
import Telas from './Telas';
import ModulosPrenda from './ModulosPrenda';
import Reportes from './Reportes';
import GestionPedidos from './GestionPedidos';
import WhatsAppFloat from './WhatsAppFloat';

type Module = 'dashboard' | 'usuarios' | 'productos' | 'inventario' | 'ventas' |
  'facturacion' | 'carrito' | 'pedidos' | 'telas' | 'prenda' | 'proveedores' | 'reportes' |
  'comunicacion' | 'auditoria' | 'perfil' | 'soporte' | 'incidencias';

type UserRole = 'admin' | 'empleado' | 'cliente' | 'proveedor' | 'pendiente';

interface User {
  email: string;
  password: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  address: string;
  city: string;
  role: UserRole;
  estado: 'activo' | 'pendiente' | 'bloqueado';
  intentosFallidos?: number;
}

interface DashboardProps {
  onLogout: () => void;
  currentUser: User | null;
  allUsers: User[];
  onUpdateUserRole: (email: string, newRole: UserRole) => void;
  onToggleUserAccess: (email: string) => void;
  onUpdateUserProfile: (email: string, updatedData: Partial<User>) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface ProductoCarrito {
  id: number | string;
  nombre: string;
  precio: number;
  cantidad: number;
  talla?: string;
  color?: string;
  imagen?: string;
}

export default function Dashboard({ onLogout, currentUser, allUsers, onUpdateUserRole, onToggleUserAccess, onUpdateUserProfile, darkMode, onToggleDarkMode }: DashboardProps) {
  const isCliente = currentUser?.role === 'cliente';
  const [activeModule, setActiveModule] = useState<Module>(isCliente ? 'productos' : 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);

  const isAdmin = currentUser?.role === 'admin';

  const handleAddToCart = (producto: any) => {
    const itemExistente = carrito.find(item => item.id === producto.id);

    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      const nuevoItem: ProductoCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen,
        color: producto.color || (producto.coloresDisponibles && producto.coloresDisponibles[0]),
        talla: producto.tallasDisponibles && producto.tallasDisponibles[0]
      };
      setCarrito([...carrito, nuevoItem]);
    }
  };

  const handleUpdateCantidad = (id: string | number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  const handleEliminarDelCarrito = (id: string | number) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const carritoCount = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const allMenuItems = [
    { id: 'principal', label: 'PRINCIPAL', items: [
      { id: 'dashboard', icon: Home, label: 'Dashboard' }
    ]},
    { id: 'usuarios', label: 'USUARIOS', items: [
      { id: 'usuarios', icon: Users, label: 'Usuarios & Roles' }
    ]},
    { id: 'catalogo', label: 'CATÁLOGO', items: [
      { id: 'productos', icon: Package, label: 'Productos', count: 248 },
      { id: 'inventario', icon: Warehouse, label: 'Inventario' }
    ]},
    { id: 'comercial', label: 'COMERCIAL', items: [
      { id: 'ventas', icon: ShoppingCart, label: 'Ventas', count: 12 },
      { id: 'facturacion', icon: FileText, label: 'Facturación' },
      { id: 'carrito', icon: ShoppingBag, label: 'Carrito', count: carritoCount > 0 ? carritoCount : undefined },
      { id: 'pedidos', icon: PackageCheck, label: 'Gestión de Pedidos' }
    ]},
    { id: 'produccion', label: 'PRODUCCIÓN', items: [
      { id: 'telas', icon: Scissors, label: 'Telas & Retazos' },
      { id: 'prenda', icon: Package, label: 'Módulos de Prenda' }
    ]},
    { id: 'gestion', label: 'GESTIÓN', items: [
      { id: 'proveedores', icon: Truck, label: 'Proveedores' },
      { id: 'reportes', icon: BarChart3, label: 'Reportes' },
      { id: 'comunicacion', icon: MessageSquare, label: 'Comunicación' },
      { id: 'auditoria', icon: Shield, label: 'Auditoría' },
      { id: 'soporte', icon: Headphones, label: 'Soporte & PQRS' },
      { id: 'incidencias', icon: AlertCircle, label: 'Incidencias' }
    ]}
  ];

  // Filtrar menú para clientes - productos, carrito y soporte
  const menuItems = isCliente
    ? [
        { id: 'catalogo', label: 'CATÁLOGO', items: [
          { id: 'productos', icon: Package, label: 'Productos', count: 248 }
        ]},
        { id: 'comercial', label: 'COMERCIAL', items: [
          { id: 'carrito', icon: ShoppingBag, label: 'Mi Carrito', count: carritoCount > 0 ? carritoCount : undefined }
        ]},
        { id: 'soporte', label: 'SOPORTE', items: [
          { id: 'soporte', icon: Headphones, label: 'Mis Solicitudes' },
          { id: 'incidencias', icon: AlertCircle, label: 'Mis Incidencias' }
        ]}
      ]
    : allMenuItems;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#2a2d3a] dark:bg-[#0a0a0a] text-white transition-all duration-300 flex flex-col border-r border-border`}>
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="font-bold">YesmauERP</h1>
                <p className="text-xs text-white/60 mt-1">SISTEMA DE GESTIÓN TEXTIL</p>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/80 hover:text-white">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuItems.map((section) => (
            <div key={section.id}>
              {sidebarOpen && (
                <h3 className="text-xs text-white/40 uppercase tracking-wider mb-2 px-3">
                  {section.label}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveModule(item.id as Module)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon size={20} />
                        {sidebarOpen && (
                          <>
                            <span className="flex-1 text-left text-sm">{item.label}</span>
                            {item.count && (
                              <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                                {item.count}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10 relative">
          {sidebarOpen ? (
            <>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 hover:bg-white/5 rounded-lg p-2 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span>{currentUser?.fullName.substring(0, 2).toUpperCase() || 'U'}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm">{currentUser?.fullName || 'Usuario'}</p>
                  <p className="text-xs text-white/60">{currentUser?.email || ''}</p>
                  <p className="text-xs text-white/40 capitalize">{currentUser?.role || ''}</p>
                </div>
                <ChevronDown size={16} className={`text-white/60 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1a1d2a] border border-white/10 rounded-lg overflow-hidden shadow-lg">
                  <button
                    onClick={() => {
                      setActiveModule('perfil');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <User size={18} />
                    <span className="text-sm">Mi Perfil</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-t border-white/10"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mx-auto">
              <span>{currentUser?.fullName.substring(0, 2).toUpperCase() || 'U'}</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground">{isCliente ? 'Catálogo de productos' : 'Dashboard general'}</h2>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Sistema activo
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={onToggleDarkMode}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {darkMode ? <Sun size={20} className="text-foreground" /> : <Moon size={20} className="text-foreground" />}
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
                <Bell size={20} className="text-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeModule === 'dashboard' && !isCliente && <DashboardContent />}
          {activeModule === 'dashboard' && isCliente && (
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">Acceso Restringido</h3>
              <p className="text-muted-foreground">Los clientes solo pueden ver el catálogo de productos</p>
            </div>
          )}
          {activeModule === 'usuarios' && isAdmin ? (
            <UsuariosRoles
              allUsers={allUsers}
              onUpdateUserRole={onUpdateUserRole}
              onToggleUserAccess={onToggleUserAccess}
            />
          ) : activeModule === 'usuarios' && !isAdmin ? (
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">Acceso Restringido</h3>
              <p className="text-muted-foreground">Solo los administradores pueden acceder a este módulo</p>
            </div>
          ) : null}
          {activeModule === 'productos' && <Productos onAddToCart={handleAddToCart} isCliente={isCliente} currentUserEmail={currentUser?.email} />}
          {activeModule === 'ventas' && !isCliente && <Ventas />}
          {activeModule === 'facturacion' && !isCliente && <Facturacion />}
          {activeModule === 'comunicacion' && !isCliente && <Comunicacion />}
          {activeModule === 'carrito' && (
            isCliente ? (
              <CarritoConSeguimiento
                carrito={carrito}
                onUpdateCantidad={handleUpdateCantidad}
                onEliminar={handleEliminarDelCarrito}
              />
            ) : (
              <Carrito
                carrito={carrito}
                onUpdateCantidad={handleUpdateCantidad}
                onEliminar={handleEliminarDelCarrito}
              />
            )
          )}
          {activeModule === 'proveedores' && !isCliente && <Proveedores />}
          {activeModule === 'inventario' && !isCliente && <Inventario />}
          {activeModule === 'perfil' && currentUser && <Perfil currentUser={currentUser} onUpdateProfile={onUpdateUserProfile} />}
          {activeModule === 'auditoria' && isAdmin && <Auditoria />}
          {activeModule === 'auditoria' && !isAdmin && (
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">Acceso Restringido</h3>
              <p className="text-muted-foreground">Solo los administradores pueden acceder al módulo de auditoría</p>
            </div>
          )}
          {activeModule === 'soporte' && currentUser && <Soporte currentUser={currentUser} />}
          {activeModule === 'incidencias' && currentUser && <Incidencias currentUser={currentUser} />}
          {activeModule === 'telas' && !isCliente && <Telas />}
          {activeModule === 'prenda' && !isCliente && <ModulosPrenda />}
          {activeModule === 'reportes' && !isCliente && <Reportes />}
          {activeModule === 'pedidos' && !isCliente && <GestionPedidos />}
          {activeModule !== 'dashboard' && activeModule !== 'usuarios' && activeModule !== 'productos' &&
           activeModule !== 'ventas' && activeModule !== 'facturacion' && activeModule !== 'comunicacion' &&
           activeModule !== 'carrito' && activeModule !== 'proveedores' && activeModule !== 'inventario' &&
           activeModule !== 'perfil' && activeModule !== 'auditoria' && activeModule !== 'soporte' &&
           activeModule !== 'incidencias' && activeModule !== 'telas' && activeModule !== 'prenda' &&
           activeModule !== 'reportes' && (
            isCliente ? (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="mb-2">Acceso Restringido</h3>
                <p className="text-muted-foreground">Los clientes solo pueden ver el catálogo de productos</p>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="mb-2">Módulo: {allMenuItems.flatMap(s => s.items).find(i => i.id === activeModule)?.label}</h3>
                <p className="text-muted-foreground">Este módulo está en desarrollo</p>
              </div>
            )
          )}
        </main>
      </div>

      {/* WhatsApp Flotante solo para clientes */}
      {isCliente && (
        <WhatsAppFloat
          phoneNumber="573001234567"
          message="Hola, soy cliente de Yesmau Moda y necesito ayuda con los productos."
        />
      )}
    </div>
  );
}

function DashboardContent() {
  const metrics = [
    { label: 'VENTAS HOY', value: '$8.4M', change: '+14.2% vs ayer', color: 'text-[#fbbf24]' },
    { label: 'PEDIDOS ACTIVOS', value: '127', change: '+8 nuevos hoy', color: 'text-[#818cf8]' },
    { label: 'STOCK DISPONIBLE', value: '3,842', change: '+2.1% últimas 24h', color: 'text-[#34d399]' },
    { label: 'RETAZOS ACTIVOS', value: '94 m', change: '+3 sugerencias IA', color: 'text-[#f472b6]' }
  ];

  const systemModules = [
    { name: 'Autenticación', requests: 4, progress: 75, color: 'bg-[#fbbf24]' },
    { name: 'Usuarios & Roles', requests: 5, progress: 60, color: 'bg-[#818cf8]' },
    { name: 'Catálogo', requests: 8, progress: 90, color: 'bg-[#34d399]' },
    { name: 'Inventario', requests: 2, progress: 40, color: 'bg-[#ef4444]' },
    { name: 'Ventas & Pagos', requests: 7, progress: 85, color: 'bg-[#f472b6]' },
    { name: 'Telas & Retazos', requests: 4, progress: 70, color: 'bg-[#34d399]' },
    { name: 'Proveedores', requests: 5, progress: 55, color: 'bg-[#fbbf24]' },
    { name: 'Reportes', requests: 5, progress: 65, color: 'bg-[#818cf8]' },
    { name: 'Comunicación', requests: 3, progress: 50, color: 'bg-[#34d399]' }
  ];

  const recentActivity = [
    { user: 'Carlos R.', action: 'registró venta #4821', time: 'hace 3 min', category: 'Ventas', color: 'bg-[#34d399]' },
    { user: 'IA sugerencia', action: 'retazo 1.2m disponible para blusa M', time: 'hace 5 min', category: 'Retazos', color: 'bg-[#818cf8]' },
    { user: 'TextilSur', action: 'envió cotización #112', time: 'hace 15 min', category: 'Proveedores', color: 'bg-[#fbbf24]' },
    { user: 'Ana M.', action: 'generó factura PDF — $1.2M', time: 'hace 22 min', category: 'Facturación', color: 'bg-[#f472b6]' },
    { user: 'Sistema', action: 'respaldo automático completado', time: 'hace 1h', category: 'Seguridad', color: 'bg-[#34d399]' }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-gradient-to-br from-secondary to-muted dark:from-[#1f1f1f] dark:to-[#0a0a0a] rounded-lg p-6 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{metric.label}</p>
            <p className={`text-3xl mb-1 ${metric.color}`}>{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* System Modules */}
        <div className="xl:col-span-2 bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3>Módulos del sistema</h3>
            <a href="#" className="text-sm text-primary hover:underline">Ver todos →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemModules.map((module, idx) => (
              <div key={idx} className="bg-gradient-to-br from-secondary to-muted dark:from-[#1f1f1f] dark:to-[#0a0a0a] rounded-lg p-4 border border-border">
                <p className="text-foreground mb-2">{module.name}</p>
                <p className="text-sm text-muted-foreground mb-3">{module.requests} requisitos</p>
                <div className="w-full h-1 bg-accent dark:bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${module.color}`} style={{ width: `${module.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3>Actividad reciente</h3>
            <a href="#" className="text-sm text-primary hover:underline">Auditoría →</a>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.user} <span className="text-muted-foreground">{activity.action}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time} • {activity.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
