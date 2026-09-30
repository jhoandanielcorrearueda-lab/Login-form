import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, Edit2, X, Check, Plus } from 'lucide-react';
import { crearNotificacionCambioEstado } from './Notificaciones';

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

export default function GestionPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null);
  const [pedidoEditando, setPedidoEditando] = useState<string | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoEnvio>('procesado');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({
    direccionEnvio: '',
    metodoPago: 'efectivo' as const,
    subtotal: 0,
    clienteEmail: ''
  });

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = () => {
    const saved = localStorage.getItem('pedidosCliente');
    if (saved) {
      setPedidos(JSON.parse(saved));
    }
  };

  const togglePedido = (pedidoId: string) => {
    setPedidoExpandido(pedidoExpandido === pedidoId ? null : pedidoId);
  };

  const iniciarEdicion = (pedidoId: string, estadoActual: EstadoEnvio) => {
    setPedidoEditando(pedidoId);
    setNuevoEstado(estadoActual);
  };

  const cancelarEdicion = () => {
    setPedidoEditando(null);
  };

  const actualizarEstado = (pedidoId: string) => {
    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0].substring(0, 5);

    const pedidosActualizados = pedidos.map(pedido => {
      if (pedido.id === pedidoId) {
        // Verificar si ya existe este estado en el historial
        const existeEstado = pedido.historialEstados.some(h => h.estado === nuevoEstado);

        let nuevoHistorial = [...pedido.historialEstados];

        if (!existeEstado) {
          // Agregar nuevo cambio de estado al historial
          nuevoHistorial.push({
            estado: nuevoEstado,
            fecha,
            hora
          });
        }

        return {
          ...pedido,
          estadoActual: nuevoEstado,
          historialEstados: nuevoHistorial
        };
      }
      return pedido;
    });

    setPedidos(pedidosActualizados);
    localStorage.setItem('pedidosCliente', JSON.stringify(pedidosActualizados));

    // Crear notificación para el cliente
    crearNotificacionCambioEstado(pedidoId, nuevoEstado);

    setPedidoEditando(null);
    alert('Estado actualizado exitosamente y se ha notificado al cliente');
  };

  const crearPedido = () => {
    if (!nuevoPedido.direccionEnvio.trim()) {
      alert('Por favor ingresa la dirección de envío');
      return;
    }
    if (!nuevoPedido.clienteEmail.trim()) {
      alert('Por favor ingresa el email del cliente');
      return;
    }
    if (nuevoPedido.subtotal <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0].substring(0, 5);

    const iva = nuevoPedido.subtotal * 0.19;
    const total = nuevoPedido.subtotal + iva;

    const pedido: Pedido = {
      id: `PED-${String(pedidos.length + 1).padStart(3, '0')}`,
      fecha,
      hora,
      productos: [], // Pedido manual sin productos específicos
      subtotal: nuevoPedido.subtotal,
      iva,
      total,
      estadoActual: 'procesado',
      historialEstados: [{ estado: 'procesado', fecha, hora }],
      direccionEnvio: nuevoPedido.direccionEnvio,
      metodoPago: nuevoPedido.metodoPago
    };

    const nuevaLista = [pedido, ...pedidos];
    setPedidos(nuevaLista);
    localStorage.setItem('pedidosCliente', JSON.stringify(nuevaLista));

    // Crear notificación para el cliente
    crearNotificacionCambioEstado(pedido.id, 'procesado');

    setNuevoPedido({
      direccionEnvio: '',
      metodoPago: 'efectivo',
      subtotal: 0,
      clienteEmail: ''
    });
    setShowCrearModal(false);
    alert('Pedido creado exitosamente');
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

  const filtrarPorEstado = (estado: EstadoEnvio | 'todos') => {
    if (estado === 'todos') return pedidos;
    return pedidos.filter(p => p.estadoActual === estado);
  };

  const [filtroEstado, setFiltroEstado] = useState<EstadoEnvio | 'todos'>('todos');
  const pedidosFiltrados = filtrarPorEstado(filtroEstado);

  const estadisticas = {
    total: pedidos.length,
    procesado: pedidos.filter(p => p.estadoActual === 'procesado').length,
    enviado: pedidos.filter(p => p.estadoActual === 'enviado').length,
    entregado: pedidos.filter(p => p.estadoActual === 'entregado').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-foreground mb-2">Gestión de Pedidos</h2>
          <p className="text-muted-foreground">
            Administra y actualiza el estado de los pedidos de clientes
          </p>
        </div>
        <button
          onClick={() => setShowCrearModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Crear Nuevo Pedido
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Pedidos</p>
              <p className="text-2xl text-foreground">{estadisticas.total}</p>
            </div>
            <Package size={32} className="text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Procesados</p>
              <p className="text-2xl text-blue-500">{estadisticas.procesado}</p>
            </div>
            <Clock size={32} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Enviados</p>
              <p className="text-2xl text-orange-500">{estadisticas.enviado}</p>
            </div>
            <Truck size={32} className="text-orange-500" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Entregados</p>
              <p className="text-2xl text-green-500">{estadisticas.entregado}</p>
            </div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroEstado('todos')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtroEstado === 'todos'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            Todos ({estadisticas.total})
          </button>
          <button
            onClick={() => setFiltroEstado('procesado')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtroEstado === 'procesado'
                ? 'bg-blue-500 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            Procesados ({estadisticas.procesado})
          </button>
          <button
            onClick={() => setFiltroEstado('enviado')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtroEstado === 'enviado'
                ? 'bg-orange-500 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            Enviados ({estadisticas.enviado})
          </button>
          <button
            onClick={() => setFiltroEstado('entregado')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtroEstado === 'entregado'
                ? 'bg-green-500 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            Entregados ({estadisticas.entregado})
          </button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Package size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-foreground mb-2">No hay pedidos</h3>
          <p className="text-muted-foreground">
            {filtroEstado === 'todos'
              ? 'No se han registrado pedidos aún'
              : `No hay pedidos con estado "${filtroEstado}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido) => {
            const estadoInfo = getEstadoInfo(pedido.estadoActual);
            const progreso = getEstadoProgreso(pedido.estadoActual);
            const expandido = pedidoExpandido === pedido.id;
            const editando = pedidoEditando === pedido.id;

            return (
              <div key={pedido.id} className="bg-card rounded-lg border border-border overflow-hidden">
                {/* Header del Pedido */}
                <div className="p-6">
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
                      <button
                        onClick={() => togglePedido(pedido.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      >
                        {expandido ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Estado Actual con opción de editar */}
                  <div className="flex items-center justify-between mb-2">
                    {editando ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={nuevoEstado}
                          onChange={(e) => setNuevoEstado(e.target.value as EstadoEnvio)}
                          className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="procesado">Procesado</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                        </select>
                        <button
                          onClick={() => actualizarEstado(pedido.id)}
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          title="Guardar"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelarEdicion}
                          className="p-2 bg-secondary hover:bg-accent text-foreground rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`${estadoInfo.color} px-3 py-1 rounded-full text-sm ${estadoInfo.bgColor} border ${estadoInfo.borderColor}`}>
                          {estadoInfo.label}
                        </span>
                        <button
                          onClick={() => iniciarEdicion(pedido.id, pedido.estadoActual)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          title="Cambiar estado"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    )}
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
                                {pedido.estadoActual === cambio.estado && index === pedido.historialEstados.length - 1 && (
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

                    {/* Información del Pedido */}
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

      {/* Modal Crear Nuevo Pedido */}
      {showCrearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Crear Nuevo Pedido</h3>
              <button
                onClick={() => setShowCrearModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Email del Cliente *
                </label>
                <input
                  type="email"
                  value={nuevoPedido.clienteEmail}
                  onChange={(e) => setNuevoPedido({ ...nuevoPedido, clienteEmail: e.target.value })}
                  placeholder="cliente@ejemplo.com"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Dirección de Envío *
                </label>
                <textarea
                  value={nuevoPedido.direccionEnvio}
                  onChange={(e) => setNuevoPedido({ ...nuevoPedido, direccionEnvio: e.target.value })}
                  placeholder="Calle, número, ciudad..."
                  rows={3}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Monto Subtotal (COP) *
                </label>
                <input
                  type="number"
                  value={nuevoPedido.subtotal || ''}
                  onChange={(e) => setNuevoPedido({ ...nuevoPedido, subtotal: parseFloat(e.target.value) || 0 })}
                  placeholder="150000"
                  min="0"
                  step="1000"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Método de Pago
                </label>
                <select
                  value={nuevoPedido.metodoPago}
                  onChange={(e) => setNuevoPedido({ ...nuevoPedido, metodoPago: e.target.value as any })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="pse">PSE</option>
                </select>
              </div>

              {nuevoPedido.subtotal > 0 && (
                <div className="bg-secondary p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>${nuevoPedido.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>IVA (19%):</span>
                    <span>${(nuevoPedido.subtotal * 0.19).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground pt-2 border-t border-border">
                    <span>Total:</span>
                    <span className="text-primary">${(nuevoPedido.subtotal * 1.19).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={crearPedido}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Crear Pedido
                </button>
                <button
                  onClick={() => setShowCrearModal(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
