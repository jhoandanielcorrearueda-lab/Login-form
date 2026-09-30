import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

type EstadoEnvio = 'procesado' | 'enviado' | 'entregado';

interface CambioEstado {
  estado: EstadoEnvio;
  fecha: string;
  hora: string;
}

interface ProductoPedido {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  color?: string;
  talla?: string;
}

interface Pedido {
  id: string;
  fecha: string;
  hora: string;
  productos: ProductoPedido[];
  subtotal: number;
  iva: number;
  total: number;
  estadoActual: EstadoEnvio;
  historialEstados: CambioEstado[];
  direccionEnvio: string;
  metodoPago: string;
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    // Cargar pedidos del localStorage o generar datos de ejemplo
    const saved = localStorage.getItem('pedidosCliente');
    if (saved) {
      return JSON.parse(saved);
    }

    // Datos de ejemplo
    return [
      {
        id: 'PED-001',
        fecha: '2026-05-05',
        hora: '14:30',
        productos: [
          {
            id: 1,
            nombre: 'Vestido Floral Elegante',
            precio: 89000,
            cantidad: 1,
            imagen: 'https://images.unsplash.com/photo-1637690048998-1e41c61c254d?w=400',
            color: 'Rosa',
            talla: 'M'
          },
          {
            id: 2,
            nombre: 'Blusa Seda Premium',
            precio: 65000,
            cantidad: 2,
            imagen: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
            color: 'Blanco',
            talla: 'S'
          }
        ],
        subtotal: 219000,
        iva: 41610,
        total: 260610,
        estadoActual: 'entregado',
        historialEstados: [
          { estado: 'procesado', fecha: '2026-05-05', hora: '14:35' },
          { estado: 'enviado', fecha: '2026-05-06', hora: '09:15' },
          { estado: 'entregado', fecha: '2026-05-07', hora: '16:20' }
        ],
        direccionEnvio: 'Calle 123 #45-67, Bogotá, Colombia',
        metodoPago: 'Stripe'
      },
      {
        id: 'PED-002',
        fecha: '2026-05-06',
        hora: '10:15',
        productos: [
          {
            id: 3,
            nombre: 'Pantalón Denim Clásico',
            precio: 75000,
            cantidad: 1,
            imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
            color: 'Azul',
            talla: '32'
          }
        ],
        subtotal: 75000,
        iva: 14250,
        total: 89250,
        estadoActual: 'enviado',
        historialEstados: [
          { estado: 'procesado', fecha: '2026-05-06', hora: '10:20' },
          { estado: 'enviado', fecha: '2026-05-07', hora: '08:45' }
        ],
        direccionEnvio: 'Carrera 45 #12-34, Medellín, Colombia',
        metodoPago: 'Tarjeta de Crédito'
      },
      {
        id: 'PED-003',
        fecha: '2026-05-07',
        hora: '11:00',
        productos: [
          {
            id: 4,
            nombre: 'Falda Midi Plisada',
            precio: 55000,
            cantidad: 1,
            imagen: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
            color: 'Negro',
            talla: 'M'
          }
        ],
        subtotal: 55000,
        iva: 10450,
        total: 65450,
        estadoActual: 'procesado',
        historialEstados: [
          { estado: 'procesado', fecha: '2026-05-07', hora: '11:05' }
        ],
        direccionEnvio: 'Avenida 68 #23-45, Bogotá, Colombia',
        metodoPago: 'PSE'
      }
    ];
  });

  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('pedidosCliente', JSON.stringify(pedidos));
  }, [pedidos]);

  const togglePedido = (pedidoId: string) => {
    setPedidoExpandido(pedidoExpandido === pedidoId ? null : pedidoId);
  };

  const getEstadoInfo = (estado: EstadoEnvio) => {
    switch (estado) {
      case 'procesado':
        return {
          label: 'Procesado',
          icon: <Clock size={20} />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500'
        };
      case 'enviado':
        return {
          label: 'Enviado',
          icon: <Truck size={20} />,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500'
        };
      case 'entregado':
        return {
          label: 'Entregado',
          icon: <CheckCircle size={20} />,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500'
        };
    }
  };

  const getEstadoProgreso = (estado: EstadoEnvio) => {
    switch (estado) {
      case 'procesado': return 33;
      case 'enviado': return 66;
      case 'entregado': return 100;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl text-foreground mb-2">Mis Pedidos</h1>
          <p className="text-lg text-muted-foreground">
            Seguimiento de tus compras y estados de envío
          </p>
        </div>

        {pedidos.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Package size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-foreground mb-2">No tienes pedidos</h3>
            <p className="text-muted-foreground">
              Tus pedidos aparecerán aquí una vez que realices una compra
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => {
              const estadoInfo = getEstadoInfo(pedido.estadoActual);
              const progreso = getEstadoProgreso(pedido.estadoActual);
              const expandido = pedidoExpandido === pedido.id;

              return (
                <div key={pedido.id} className="bg-card rounded-lg border border-border overflow-hidden">
                  {/* Header del Pedido */}
                  <div
                    onClick={() => togglePedido(pedido.id)}
                    className="p-6 cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`${estadoInfo.bgColor} ${estadoInfo.color} p-3 rounded-lg`}>
                          {estadoInfo.icon}
                        </div>
                        <div>
                          <h3 className="text-foreground text-lg">Pedido #{pedido.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pedido.fecha} a las {pedido.hora}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl text-primary">${pedido.total.toLocaleString()}</p>
                        </div>
                        {expandido ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {/* Estado Actual */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`${estadoInfo.color} px-3 py-1 rounded-full text-sm ${estadoInfo.bgColor} border ${estadoInfo.borderColor}`}>
                        {estadoInfo.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {pedido.productos.length} producto{pedido.productos.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${estadoInfo.color === 'text-blue-500' ? 'bg-blue-500' : estadoInfo.color === 'text-orange-500' ? 'bg-orange-500' : 'bg-green-500'} transition-all duration-500`}
                        style={{ width: `${progreso}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Detalles del Pedido (expandible) */}
                  {expandido && (
                    <div className="border-t border-border p-6 bg-secondary/30">
                      {/* Historial de Estados */}
                      <div className="mb-6">
                        <h4 className="text-foreground mb-4">Historial de Envío</h4>
                        <div className="space-y-3">
                          {pedido.historialEstados.map((cambio, index) => {
                            const cambioInfo = getEstadoInfo(cambio.estado);
                            return (
                              <div key={index} className="flex items-start gap-3">
                                <div className={`${cambioInfo.bgColor} ${cambioInfo.color} p-2 rounded-lg`}>
                                  {cambioInfo.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-foreground">{cambioInfo.label}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {cambio.fecha} - {cambio.hora}
                                    </p>
                                  </div>
                                  {index === 0 && pedido.estadoActual === cambio.estado && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Estado actual del pedido
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Productos */}
                      <div className="mb-6">
                        <h4 className="text-foreground mb-4">Productos</h4>
                        <div className="space-y-3">
                          {pedido.productos.map((producto, index) => (
                            <div key={index} className="flex items-center gap-4 bg-card p-3 rounded-lg border border-border">
                              <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-foreground">{producto.nombre}</p>
                                <p className="text-sm text-muted-foreground">
                                  {producto.color && `Color: ${producto.color}`}
                                  {producto.talla && ` | Talla: ${producto.talla}`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-foreground">x{producto.cantidad}</p>
                                <p className="text-sm text-primary">${producto.precio.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resumen del Pedido */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-foreground mb-3">Dirección de Envío</h4>
                          <p className="text-muted-foreground">{pedido.direccionEnvio}</p>
                        </div>
                        <div>
                          <h4 className="text-foreground mb-3">Método de Pago</h4>
                          <p className="text-muted-foreground">{pedido.metodoPago}</p>
                        </div>
                      </div>

                      {/* Totales */}
                      <div className="mt-6 pt-6 border-t border-border">
                        <div className="space-y-2 max-w-xs ml-auto">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal:</span>
                            <span>${pedido.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>IVA (19%):</span>
                            <span>${pedido.iva.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-foreground text-lg pt-2 border-t border-border">
                            <span>Total:</span>
                            <span className="text-primary">${pedido.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
