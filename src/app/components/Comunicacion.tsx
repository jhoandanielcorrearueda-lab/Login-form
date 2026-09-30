import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Eye, Search, Filter } from 'lucide-react';

interface Pedido {
  id: number;
  numeroPedido: string;
  fecha: string;
  cliente: string;
  productos: string[];
  total: number;
  estadoPedido: 'preparacion' | 'empacado' | 'enviado' | 'entregado' | 'cancelado';
  estadoEnvio?: {
    numeroGuia: string;
    transportadora: string;
    fechaEnvio: string;
    fechaEstimada: string;
    ubicacionActual: string;
    historial: {
      fecha: string;
      ubicacion: string;
      estado: string;
      descripcion: string;
    }[];
  };
}

export default function Comunicacion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1,
      numeroPedido: 'PED-2026-001',
      fecha: '2026-04-23 10:30',
      cliente: 'María García',
      productos: ['Algodón Rojo - 5m', 'Vestido Midi Floral'],
      total: 235,
      estadoPedido: 'entregado',
      estadoEnvio: {
        numeroGuia: 'SER123456789',
        transportadora: 'Servientrega',
        fechaEnvio: '2026-04-23',
        fechaEstimada: '2026-04-24',
        ubicacionActual: 'Entregado',
        historial: [
          {
            fecha: '2026-04-24 14:30',
            ubicacion: 'Bogotá - Dirección del cliente',
            estado: 'Entregado',
            descripcion: 'Paquete entregado exitosamente. Recibido por: María García'
          },
          {
            fecha: '2026-04-24 09:15',
            ubicacion: 'Bogotá - Centro de distribución',
            estado: 'En reparto',
            descripcion: 'Paquete en camino para entrega'
          },
          {
            fecha: '2026-04-23 16:00',
            ubicacion: 'Bogotá - Bodega principal',
            estado: 'En tránsito',
            descripcion: 'Paquete en bodega de la transportadora'
          },
          {
            fecha: '2026-04-23 12:00',
            ubicacion: 'Yesmau Moda - Tienda',
            estado: 'Despachado',
            descripcion: 'Paquete recolectado por transportadora'
          }
        ]
      }
    },
    {
      id: 2,
      numeroPedido: 'PED-2026-002',
      fecha: '2026-04-23 11:45',
      cliente: 'Carlos Rodríguez',
      productos: ['Seda Azul - 3m', 'Camisa Clásica x2'],
      total: 265,
      estadoPedido: 'enviado',
      estadoEnvio: {
        numeroGuia: 'INT987654321',
        transportadora: 'Interrapidísimo',
        fechaEnvio: '2026-04-23',
        fechaEstimada: '2026-04-25',
        ubicacionActual: 'Medellín - Centro de distribución',
        historial: [
          {
            fecha: '2026-04-23 18:00',
            ubicacion: 'Medellín - Centro de distribución',
            estado: 'En tránsito',
            descripcion: 'Paquete llegó a centro de distribución de Medellín'
          },
          {
            fecha: '2026-04-23 14:30',
            ubicacion: 'Bogotá - Terminal de carga',
            estado: 'En tránsito',
            descripcion: 'Paquete en ruta hacia Medellín'
          },
          {
            fecha: '2026-04-23 12:30',
            ubicacion: 'Yesmau Moda - Tienda',
            estado: 'Despachado',
            descripcion: 'Paquete recolectado por transportadora'
          }
        ]
      }
    },
    {
      id: 3,
      numeroPedido: 'PED-2026-003',
      fecha: '2026-04-23 14:20',
      cliente: 'Ana López',
      productos: ['Lino Verde - 8m'],
      total: 225,
      estadoPedido: 'empacado',
      estadoEnvio: {
        numeroGuia: 'COORD789456',
        transportadora: 'Coordinadora',
        fechaEnvio: '2026-04-24',
        fechaEstimada: '2026-04-26',
        ubicacionActual: 'Preparando envío',
        historial: [
          {
            fecha: '2026-04-23 16:00',
            ubicacion: 'Yesmau Moda - Tienda',
            estado: 'Empacado',
            descripcion: 'Pedido empacado y listo para recolección'
          }
        ]
      }
    },
    {
      id: 4,
      numeroPedido: 'PED-2026-004',
      fecha: '2026-04-23 15:10',
      cliente: 'Pedro Martínez',
      productos: ['Pantalón Recto', 'Blusa Básica'],
      total: 180,
      estadoPedido: 'preparacion'
    },
    {
      id: 5,
      numeroPedido: 'PED-2026-005',
      fecha: '2026-04-22 09:00',
      cliente: 'Laura Sánchez',
      productos: ['Vestido Cóctel', 'Falda Midi'],
      total: 320,
      estadoPedido: 'cancelado'
    }
  ]);

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.numeroPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.estadoEnvio?.numeroGuia.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !filterEstado || pedido.estadoPedido === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#5E8587]';
      case 'enviado':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-[#5E8587]';
      case 'empacado':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-[#D8C2A8]';
      case 'preparacion':
        return 'bg-amber-100 dark:bg-[#B7654A]/30 text-amber-700 dark:text-[#D08A70]';
      case 'cancelado':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#D08A70]';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return <CheckCircle size={18} />;
      case 'enviado':
        return <Truck size={18} />;
      case 'empacado':
        return <Package size={18} />;
      case 'preparacion':
        return <Clock size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  const pedidosEntregados = pedidos.filter(p => p.estadoPedido === 'entregado').length;
  const pedidosEnvio = pedidos.filter(p => p.estadoPedido === 'enviado').length;
  const pedidosPendientes = pedidos.filter(p => p.estadoPedido === 'preparacion' || p.estadoPedido === 'empacado').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-foreground mb-2">Historial de Pedidos y Seguimiento</h2>
        <p className="text-muted-foreground">Gestiona el historial y seguimiento de envíos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#24545A]/50 dark:to-[#24545A]/30 rounded-lg p-6 border border-blue-200 dark:border-[#5E8587]/40">
          <div className="flex items-center gap-3">
            <Package className="text-blue-600 dark:text-[#5E8587]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{pedidos.length}</p>
              <p className="text-sm text-muted-foreground">Total Pedidos</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-[#24545A]/70 dark:to-[#24545A]/50 rounded-lg p-6 border border-green-200 dark:border-[#5E8587]/60">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600 dark:text-[#5E8587]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{pedidosEntregados}</p>
              <p className="text-sm text-muted-foreground">Entregados</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-[#A98255]/25 dark:to-[#A98255]/10 rounded-lg p-6 border border-purple-200 dark:border-[#A98255]/40">
          <div className="flex items-center gap-3">
            <Truck className="text-purple-600 dark:text-[#D8C2A8]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{pedidosEnvio}</p>
              <p className="text-sm text-muted-foreground">En Envío</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-[#B7654A]/25 dark:to-[#B7654A]/10 rounded-lg p-6 border border-amber-200 dark:border-[#B7654A]/40">
          <div className="flex items-center gap-3">
            <Clock className="text-amber-600 dark:text-[#D08A70]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{pedidosPendientes}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detalle del Pedido */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl text-foreground mb-2">Seguimiento de Pedido</h2>
                  <p className="text-muted-foreground">{pedidoSeleccionado.numeroPedido}</p>
                </div>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getEstadoColor(pedidoSeleccionado.estadoPedido)}`}>
                  {getEstadoIcon(pedidoSeleccionado.estadoPedido)}
                  {pedidoSeleccionado.estadoPedido}
                </span>
              </div>

              {/* Información del Pedido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-secondary rounded-lg p-4">
                  <h3 className="text-foreground mb-3">Información del Pedido</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="text-foreground">{pedidoSeleccionado.cliente}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="text-foreground">{pedidoSeleccionado.fecha}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="text-primary font-medium">${pedidoSeleccionado.total}</span>
                    </div>
                  </div>
                </div>

                {pedidoSeleccionado.estadoEnvio && (
                  <div className="bg-secondary rounded-lg p-4">
                    <h3 className="text-foreground mb-3">Información de Envío</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guía:</span>
                        <span className="text-foreground font-mono">{pedidoSeleccionado.estadoEnvio.numeroGuia}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transportadora:</span>
                        <span className="text-foreground">{pedidoSeleccionado.estadoEnvio.transportadora}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha estimada:</span>
                        <span className="text-foreground">{pedidoSeleccionado.estadoEnvio.fechaEstimada}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Productos */}
              <div className="mb-6">
                <h3 className="text-foreground mb-3">Productos</h3>
                <div className="bg-secondary rounded-lg p-4">
                  <ul className="space-y-2">
                    {pedidoSeleccionado.productos.map((producto, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-foreground">
                        <Package size={16} className="text-muted-foreground" />
                        {producto}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timeline de Seguimiento */}
              {pedidoSeleccionado.estadoEnvio && (
                <div className="mb-6">
                  <h3 className="text-foreground mb-4">Historial de Seguimiento</h3>
                  <div className="relative">
                    {pedidoSeleccionado.estadoEnvio.historial.map((evento, idx) => (
                      <div key={idx} className="flex gap-4 pb-8 last:pb-0">
                        <div className="relative flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            idx === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                          }`}>
                            <MapPin size={20} />
                          </div>
                          {idx < pedidoSeleccionado.estadoEnvio!.historial.length - 1 && (
                            <div className="w-0.5 h-full bg-border absolute top-10"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="bg-secondary rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-foreground font-medium">{evento.estado}</h4>
                              <span className="text-sm text-muted-foreground">{evento.fecha}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{evento.ubicacion}</p>
                            <p className="text-sm text-foreground">{evento.descripcion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar por número de pedido, cliente o guía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los estados</option>
          <option value="preparacion">En Preparación</option>
          <option value="empacado">Empacado</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3 text-foreground">Número</th>
              <th className="text-left px-6 py-3 text-foreground">Fecha</th>
              <th className="text-left px-6 py-3 text-foreground">Cliente</th>
              <th className="text-left px-6 py-3 text-foreground">Productos</th>
              <th className="text-left px-6 py-3 text-foreground">Total</th>
              <th className="text-left px-6 py-3 text-foreground">Estado</th>
              <th className="text-left px-6 py-3 text-foreground">Guía</th>
              <th className="text-left px-6 py-3 text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map((pedido) => (
              <tr key={pedido.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-6 py-4 text-foreground font-medium">{pedido.numeroPedido}</td>
                <td className="px-6 py-4 text-muted-foreground">{pedido.fecha}</td>
                <td className="px-6 py-4 text-foreground">{pedido.cliente}</td>
                <td className="px-6 py-4 text-muted-foreground">{pedido.productos.length} items</td>
                <td className="px-6 py-4 text-primary">${pedido.total}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getEstadoColor(pedido.estadoPedido)}`}>
                    {getEstadoIcon(pedido.estadoPedido)}
                    {pedido.estadoPedido}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {pedido.estadoEnvio ? (
                    <span className="text-sm font-mono text-muted-foreground">{pedido.estadoEnvio.numeroGuia}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setPedidoSeleccionado(pedido)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye size={18} className="text-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
