import { useState } from 'react';
import { Shield, Search, Filter, Download, Eye } from 'lucide-react';

interface AuditLog {
  id: string;
  fecha: string;
  hora: string;
  usuario: string;
  email: string;
  rol: string;
  accion: string;
  modulo: string;
  detalles: string;
  ip: string;
  resultado: 'exitoso' | 'fallido' | 'bloqueado';
}

export default function Auditoria() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroModulo, setFiltroModulo] = useState('');
  const [filtroResultado, setFiltroResultado] = useState<'' | 'exitoso' | 'fallido' | 'bloqueado'>('');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      fecha: '2026-04-23',
      hora: '14:35:22',
      usuario: 'Ana María González',
      email: 'ana@yesmau.com',
      rol: 'empleado',
      accion: 'Registró venta',
      modulo: 'Ventas',
      detalles: 'Venta #VEN-001 por $289,000 - Cliente: María Pérez - Método: Tarjeta',
      ip: '192.168.1.45',
      resultado: 'exitoso'
    },
    {
      id: '2',
      fecha: '2026-04-23',
      hora: '14:28:15',
      usuario: 'Administrador Yesmau',
      email: 'admin@yesmau.com',
      rol: 'admin',
      accion: 'Actualizó rol de usuario',
      modulo: 'Usuarios y Roles',
      detalles: 'Cambió rol de carlos@empresa.com de "pendiente" a "empleado"',
      ip: '192.168.1.10',
      resultado: 'exitoso'
    },
    {
      id: '3',
      fecha: '2026-04-23',
      hora: '14:15:08',
      usuario: 'Carlos Rodríguez',
      email: 'carlos@empresa.com',
      rol: 'cliente',
      accion: 'Intento de acceso fallido',
      modulo: 'Autenticación',
      detalles: 'Contraseña incorrecta - Intento 3 de 5',
      ip: '192.168.1.78',
      resultado: 'fallido'
    },
    {
      id: '4',
      fecha: '2026-04-23',
      hora: '13:45:33',
      usuario: 'Sistema',
      email: 'system@yesmau.com',
      rol: 'sistema',
      accion: 'Actualizó inventario',
      modulo: 'Inventario',
      detalles: 'Stock actualizado: Tela Algodón Premium -50m (Orden de compra OC-001)',
      ip: 'localhost',
      resultado: 'exitoso'
    },
    {
      id: '5',
      fecha: '2026-04-23',
      hora: '13:30:12',
      usuario: 'Luis Torres',
      email: 'luis@proveedor.com',
      rol: 'proveedor',
      accion: 'Creó cotización',
      modulo: 'Proveedores',
      detalles: 'Cotización COT-001 para Tela Denim - $22,000/metro',
      ip: '192.168.1.92',
      resultado: 'exitoso'
    },
    {
      id: '6',
      fecha: '2026-04-23',
      hora: '12:15:47',
      usuario: 'Pedro Martínez',
      email: 'pedro@test.com',
      rol: 'cliente',
      accion: 'Cuenta bloqueada',
      modulo: 'Autenticación',
      detalles: 'Cuenta bloqueada automáticamente por 5 intentos fallidos de inicio de sesión',
      ip: '192.168.1.120',
      resultado: 'bloqueado'
    },
    {
      id: '7',
      fecha: '2026-04-23',
      hora: '11:50:29',
      usuario: 'Ana María González',
      email: 'ana@yesmau.com',
      rol: 'empleado',
      accion: 'Generó factura',
      modulo: 'Facturación',
      detalles: 'Factura #FAC-001 por $345,000 - Cliente: Tech Solutions S.A.S',
      ip: '192.168.1.45',
      resultado: 'exitoso'
    },
    {
      id: '8',
      fecha: '2026-04-23',
      hora: '11:20:15',
      usuario: 'Administrador Yesmau',
      email: 'admin@yesmau.com',
      rol: 'admin',
      accion: 'Exportó reporte',
      modulo: 'Reportes',
      detalles: 'Exportó reporte de ventas mensuales en formato PDF',
      ip: '192.168.1.10',
      resultado: 'exitoso'
    },
    {
      id: '9',
      fecha: '2026-04-23',
      hora: '10:35:42',
      usuario: 'Ana María González',
      email: 'ana@yesmau.com',
      rol: 'empleado',
      accion: 'Actualizó producto',
      modulo: 'Productos',
      detalles: 'Modificó precio de "Vestido Floral Verano" de $85,000 a $89,000',
      ip: '192.168.1.45',
      resultado: 'exitoso'
    },
    {
      id: '10',
      fecha: '2026-04-23',
      hora: '10:05:18',
      usuario: 'María Fernández',
      email: 'maria@cliente.com',
      rol: 'cliente',
      accion: 'Inició sesión',
      modulo: 'Autenticación',
      detalles: 'Inicio de sesión exitoso desde navegador Chrome',
      ip: '192.168.1.155',
      resultado: 'exitoso'
    }
  ]);

  const logsFiltrados = logs.filter(log => {
    const matchSearch = log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (filtroModulo && log.modulo !== filtroModulo) return false;
    if (filtroResultado && log.resultado !== filtroResultado) return false;

    return true;
  });

  const modulos = Array.from(new Set(logs.map(log => log.modulo)));

  const resultadoColors = {
    exitoso: 'bg-green-100 text-green-800 dark:bg-[#24545A] dark:text-[#D8C2A8]',
    fallido: 'bg-red-100 text-red-800 dark:bg-[#B7654A]/45 dark:text-[#F5EEE4]',
    bloqueado: 'bg-amber-100 text-amber-800 dark:bg-[#B7654A]/30 dark:text-[#D08A70]'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Auditoría del Sistema</h2>
          <p className="text-sm text-muted-foreground">Registro de acciones y eventos del sistema</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Download size={20} />
          Exportar Logs
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total de Eventos</p>
            <Shield size={20} className="text-primary" />
          </div>
          <p className="text-2xl text-foreground">{logs.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Registrados hoy</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Exitosos</p>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <p className="text-2xl text-foreground">{logs.filter(l => l.resultado === 'exitoso').length}</p>
          <p className="text-xs text-muted-foreground mt-1">Acciones completadas</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Fallidos</p>
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          </div>
          <p className="text-2xl text-foreground">{logs.filter(l => l.resultado === 'fallido').length}</p>
          <p className="text-xs text-muted-foreground mt-1">Intentos sin éxito</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Bloqueados</p>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          </div>
          <p className="text-2xl text-foreground">{logs.filter(l => l.resultado === 'bloqueado').length}</p>
          <p className="text-xs text-muted-foreground mt-1">Accesos bloqueados</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por usuario o acción..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={filtroModulo}
            onChange={(e) => setFiltroModulo(e.target.value)}
            className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los módulos</option>
            {modulos.map(modulo => (
              <option key={modulo} value={modulo}>{modulo}</option>
            ))}
          </select>

          <select
            value={filtroResultado}
            onChange={(e) => setFiltroResultado(e.target.value as any)}
            className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los resultados</option>
            <option value="exitoso">Exitoso</option>
            <option value="fallido">Fallido</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </div>
      </div>

      {/* Tabla de Logs */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-4 text-sm text-muted-foreground">Fecha/Hora</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Usuario</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Rol</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Acción</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Módulo</th>
              <th className="text-left p-4 text-sm text-muted-foreground">IP</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Resultado</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {logsFiltrados.map((log) => (
              <tr key={log.id} className="border-t border-border hover:bg-secondary/50">
                <td className="p-4 text-sm text-foreground">
                  <div>
                    <p>{log.fecha}</p>
                    <p className="text-xs text-muted-foreground">{log.hora}</p>
                  </div>
                </td>
                <td className="p-4 text-sm">
                  <div>
                    <p className="text-foreground">{log.usuario}</p>
                    <p className="text-xs text-muted-foreground">{log.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs capitalize">
                    {log.rol}
                  </span>
                </td>
                <td className="p-4 text-sm text-foreground">{log.accion}</td>
                <td className="p-4 text-sm text-muted-foreground">{log.modulo}</td>
                <td className="p-4 text-xs text-muted-foreground font-mono">{log.ip}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${resultadoColors[log.resultado]}`}>
                    {log.resultado}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                    className="text-primary hover:underline flex items-center gap-1 text-sm"
                  >
                    <Eye size={14} />
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logsFiltrados.length === 0 && (
          <div className="p-12 text-center">
            <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No se encontraron registros con los filtros aplicados</p>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground">Detalles del Evento</h3>
              <button onClick={() => setShowDetails(null)} className="text-muted-foreground hover:text-foreground">
                <Shield size={20} />
              </button>
            </div>
            {logs.find(l => l.id === showDetails) && (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="text-muted-foreground mb-1">Fecha y Hora</p>
                    <p className="text-foreground">{logs.find(l => l.id === showDetails)?.fecha} {logs.find(l => l.id === showDetails)?.hora}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Módulo</p>
                    <p className="text-foreground">{logs.find(l => l.id === showDetails)?.modulo}</p>
                  </div>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-muted-foreground mb-2">Detalles Completos</p>
                  <p className="text-foreground">{logs.find(l => l.id === showDetails)?.detalles}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
