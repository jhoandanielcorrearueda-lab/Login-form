import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Package, X, CheckCircle, Clock, Truck, ChevronDown, ChevronUp, RotateCcw, AlertCircle } from 'lucide-react';
import { crearNotificacionCambioEstado } from './Notificaciones';

type EstadoEnvio = 'procesado' | 'enviado' | 'entregado';
type EstadoDevolucion = 'solicitada' | 'aprobada' | 'rechazada' | 'completada';

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

interface Devolucion {
  id: string;
  pedidoId: string;
  fecha: string;
  hora: string;
  productos: ProductoPedido[];
  motivo: string;
  estado: EstadoDevolucion;
  observaciones?: string;
  fechaRespuesta?: string;
  montoDevolucion: number;
}

interface ProductoCarrito {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
  talla?: string;
  color?: string;
  imagen?: string;
}

interface CarritoConSeguimientoProps {
  carrito?: ProductoCarrito[];
  onUpdateCantidad?: (id: string | number, nuevaCantidad: number) => void;
  onEliminar?: (id: string | number) => void;
}

export default function CarritoConSeguimiento({ carrito: carritoExterno, onUpdateCantidad, onEliminar }: CarritoConSeguimientoProps) {
  const [activeTab, setActiveTab] = useState<'carrito' | 'pedidos' | 'devoluciones'>('carrito');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null);
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [showModalDevolucion, setShowModalDevolucion] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [motivoDevolucion, setMotivoDevolucion] = useState('');
  const [productosDevolucion, setProductosDevolucion] = useState<string[]>([]);
  const [pasoDevolucion, setPasoDevolucion] = useState<'seleccion-pedido' | 'seleccion-productos'>(
    'seleccion-pedido'
  );

  const [carritoLocal, setCarritoLocal] = useState<ProductoCarrito[]>([]);
  const carrito = carritoExterno || carritoLocal;

  const [descuento, setDescuento] = useState(0);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [showModalPago, setShowModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'stripe' | 'tarjeta' | 'pse' | 'efectivo'>('stripe');
  const [showConfirmacion, setShowConfirmacion] = useState(false);

  useEffect(() => {
    cargarPedidos();
    cargarDevoluciones();
  }, []);

  const cargarPedidos = () => {
    const saved = localStorage.getItem('pedidosCliente');
    if (saved) {
      setPedidos(JSON.parse(saved));
    }
  };

  const cargarDevoluciones = () => {
    const saved = localStorage.getItem('devolucionesCliente');
    if (saved) {
      setDevoluciones(JSON.parse(saved));
    }
  };

  const actualizarCantidad = (id: string | number, nuevaCantidad: number) => {
    if (onUpdateCantidad) {
      onUpdateCantidad(id, nuevaCantidad);
    } else {
      if (nuevaCantidad < 1) return;
      setCarritoLocal(carritoLocal.map(item =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      ));
    }
  };

  const eliminarProducto = (id: string | number) => {
    if (onEliminar) {
      onEliminar(id);
    } else {
      setCarritoLocal(carritoLocal.filter(item => item.id !== id));
    }
  };

  const aplicarCupon = () => {
    if (codigoCupon === 'DESCUENTO10') {
      setDescuento(10);
    } else if (codigoCupon === 'DESCUENTO20') {
      setDescuento(20);
    } else {
      alert('Cupón inválido');
    }
  };

  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const descuentoValor = (subtotal * descuento) / 100;
  const iva = subtotal * 0.19;
  const envio = 15000;
  const total = subtotal - descuentoValor + iva + envio;

  const handleProcederPago = () => {
    if (carrito.length === 0) return;
    setShowModalPago(true);
  };

  const handleConfirmarCompra = () => {
    setShowModalPago(false);
    setShowConfirmacion(true);
  };

  const handleFinalizarCompra = () => {
    const metodosNombres = {
      stripe: 'Stripe',
      tarjeta: 'Tarjeta de Crédito/Débito',
      pse: 'PSE',
      efectivo: 'Efectivo'
    };

    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0].substring(0, 5);

    const pedidosExistentes = localStorage.getItem('pedidosCliente');
    const pedidosList = pedidosExistentes ? JSON.parse(pedidosExistentes) : [];

    const nuevoPedido: Pedido = {
      id: `PED-${String(pedidosList.length + 1).padStart(3, '0')}`,
      fecha,
      hora,
      productos: carrito.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagen: item.imagen || 'https://images.unsplash.com/photo-1558769132-cb1aea1c4c9a?w=400',
        color: item.color,
        talla: item.talla
      })),
      subtotal,
      iva,
      total,
      estadoActual: 'procesado',
      historialEstados: [
        {
          estado: 'procesado',
          fecha,
          hora
        }
      ],
      direccionEnvio: 'Dirección de ejemplo (se configurará en el futuro)',
      metodoPago: metodosNombres[metodoPago]
    };

    pedidosList.push(nuevoPedido);
    localStorage.setItem('pedidosCliente', JSON.stringify(pedidosList));
    crearNotificacionCambioEstado(nuevoPedido.id, 'procesado');

    alert(`¡Compra realizada exitosamente!\n\nPedido #${nuevoPedido.id}\nEstado: Procesado ✓\n\nPuedes hacer seguimiento en la pestaña "Mis Pedidos"`);

    if (!onEliminar) {
      setCarritoLocal([]);
    } else {
      carrito.forEach(item => onEliminar(item.id));
    }

    setShowConfirmacion(false);
    setShowModalPago(false);
    setActiveTab('pedidos');
    cargarPedidos();
  };

  const togglePedido = (pedidoId: string) => {
    setPedidoExpandido(pedidoExpandido === pedidoId ? null : pedidoId);
  };

  const abrirModalDevolucion = (pedido?: Pedido) => {
    if (pedido) {
      // Si viene un pedido específico, ir directo a selección de productos
      setPedidoSeleccionado(pedido);
      setPasoDevolucion('seleccion-productos');
    } else {
      // Si no, empezar desde selección de pedido
      setPedidoSeleccionado(null);
      setPasoDevolucion('seleccion-pedido');
    }
    setProductosDevolucion([]);
    setMotivoDevolucion('');
    setShowModalDevolucion(true);
  };

  const seleccionarPedidoParaDevolucion = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setPasoDevolucion('seleccion-productos');
  };

  const volverASeleccionPedido = () => {
    setPedidoSeleccionado(null);
    setProductosDevolucion([]);
    setMotivoDevolucion('');
    setPasoDevolucion('seleccion-pedido');
  };

  const toggleProductoDevolucion = (productoId: string) => {
    if (productosDevolucion.includes(productoId)) {
      setProductosDevolucion(productosDevolucion.filter(id => id !== productoId));
    } else {
      setProductosDevolucion([...productosDevolucion, productoId]);
    }
  };

  const solicitarDevolucion = () => {
    if (!pedidoSeleccionado) return;

    if (productosDevolucion.length === 0) {
      alert('Selecciona al menos un producto para devolver');
      return;
    }

    if (!motivoDevolucion.trim()) {
      alert('Ingresa el motivo de la devolución');
      return;
    }

    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0].substring(0, 5);

    const productosADevolver = pedidoSeleccionado.productos.filter(p =>
      productosDevolucion.includes(String(p.id))
    );

    const montoDevolucion = productosADevolver.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    const devolucionesExistentes = localStorage.getItem('devolucionesCliente');
    const devolucionesList: Devolucion[] = devolucionesExistentes ? JSON.parse(devolucionesExistentes) : [];

    const nuevaDevolucion: Devolucion = {
      id: `DEV-${String(devolucionesList.length + 1).padStart(3, '0')}`,
      pedidoId: pedidoSeleccionado.id,
      fecha,
      hora,
      productos: productosADevolver,
      motivo: motivoDevolucion,
      estado: 'solicitada',
      montoDevolucion
    };

    devolucionesList.push(nuevaDevolucion);
    localStorage.setItem('devolucionesCliente', JSON.stringify(devolucionesList));

    setDevoluciones(devolucionesList);
    setShowModalDevolucion(false);
    setPedidoSeleccionado(null);
    setMotivoDevolucion('');
    setProductosDevolucion([]);
    setPasoDevolucion('seleccion-pedido');

    alert(`¡Devolución solicitada exitosamente!\n\nDevolución #${nuevaDevolucion.id}\nEstado: Solicitada\n\nSerá revisada por nuestro equipo.`);
    setActiveTab('devoluciones');
  };

  const getEstadoDevolucionInfo = (estado: EstadoDevolucion) => {
    switch (estado) {
      case 'solicitada':
        return {
          label: 'Solicitada',
          icon: <Clock size={20} />,
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500'
        };
      case 'aprobada':
        return {
          label: 'Aprobada',
          icon: <CheckCircle size={20} />,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500'
        };
      case 'rechazada':
        return {
          label: 'Rechazada',
          icon: <X size={20} />,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500'
        };
      case 'completada':
        return {
          label: 'Completada',
          icon: <CheckCircle size={20} />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500'
        };
    }
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
    <div className="space-y-6">
      {/* Header con Tabs */}
      <div>
        <h2 className="text-foreground mb-2">Mi Carrito</h2>
        <p className="text-muted-foreground mb-4">Gestiona tus compras y haz seguimiento de tus pedidos</p>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('carrito')}
              className={`px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'carrito'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} />
                Carrito Actual
                {carrito.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {carrito.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'pedidos'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package size={18} />
                Mis Pedidos
                {pedidos.length > 0 && (
                  <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                    {pedidos.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('devoluciones')}
              className={`px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'devoluciones'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <RotateCcw size={18} />
                Devoluciones
                {devoluciones.length > 0 && (
                  <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                    {devoluciones.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido del Tab Carrito */}
      {activeTab === 'carrito' && (
        <>
          {/* Vista del carrito existente */}
          {carrito.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">Tu carrito está vacío</h3>
              <p className="text-muted-foreground">Agrega productos al carrito para continuar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de productos */}
              <div className="lg:col-span-2 space-y-4">
                {carrito.map((item) => (
                  <div key={item.id} className="bg-card rounded-lg border border-border p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center">
                        {item.imagen ? (
                          <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package size={32} className="text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-foreground mb-1">{item.nombre}</h3>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              {item.talla && <span>Talla: {item.talla}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => eliminarProducto(item.id)}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                              disabled={item.cantidad <= 1}
                              className="w-8 h-8 rounded-lg border border-border hover:bg-secondary flex items-center justify-center transition-colors disabled:opacity-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-medium">{item.cantidad}</span>
                            <button
                              onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                              className="w-8 h-8 rounded-lg border border-border hover:bg-secondary flex items-center justify-center transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <p className="font-medium text-foreground text-lg">
                            ${(item.precio * item.cantidad).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen del pedido */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-6">
                  <h3 className="text-foreground mb-6">Resumen del Pedido</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({carrito.reduce((acc, item) => acc + item.cantidad, 0)} productos)</span>
                      <span className="text-foreground">${subtotal.toLocaleString()}</span>
                    </div>
                    {descuento > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Descuento ({descuento}%)</span>
                        <span>-${descuentoValor.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IVA (19%)</span>
                      <span className="text-foreground">${iva.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-foreground">${envio.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="font-bold text-primary text-xl">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProcederPago}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors mb-4"
                  >
                    Proceder al Pago
                  </button>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>✓ Envío gratis en compras mayores a $150.000</p>
                    <p>✓ Devoluciones gratis dentro de 30 días</p>
                    <p>✓ Pago seguro con SSL</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Pago */}
          {showModalPago && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-foreground">Seleccionar Método de Pago</h3>
                  <button onClick={() => setShowModalPago(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  {['stripe', 'tarjeta', 'pse', 'efectivo'].map((metodo) => (
                    <button
                      key={metodo}
                      onClick={() => setMetodoPago(metodo as typeof metodoPago)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        metodoPago === metodo
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          metodoPago === metodo ? 'border-primary' : 'border-border'
                        }`}>
                          {metodoPago === metodo && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                        <span className="text-foreground font-medium capitalize">{metodo}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConfirmarCompra}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Modal de Confirmación */}
          {showConfirmacion && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-lg border border-border p-8 max-w-md w-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-primary" />
                  </div>
                  <h3 className="text-foreground text-xl mb-2">¿Seguro que quieres hacer esta compra?</h3>
                  <p className="text-muted-foreground mb-4">Total: ${total.toLocaleString()}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmacion(false)}
                    className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-3 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleFinalizarCompra}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors"
                  >
                    Sí, confirmar compra
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Contenido del Tab Mis Pedidos */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4">
          {pedidos.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Package size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-foreground mb-2">No tienes pedidos</h3>
              <p className="text-muted-foreground">
                Tus pedidos aparecerán aquí una vez que realices una compra
              </p>
            </div>
          ) : (
            pedidos.map((pedido) => {
              const estadoInfo = getEstadoInfo(pedido.estadoActual);
              const progreso = getEstadoProgreso(pedido.estadoActual);
              const expandido = pedidoExpandido === pedido.id;

              return (
                <div key={pedido.id} className="bg-card rounded-lg border border-border overflow-hidden">
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

                    <div className="flex items-center justify-between mb-2">
                      <span className={`${estadoInfo.color} px-3 py-1 rounded-full text-sm ${estadoInfo.bgColor} border ${estadoInfo.borderColor}`}>
                        {estadoInfo.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {pedido.productos.length} producto{pedido.productos.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${estadoInfo.color === 'text-blue-500' ? 'bg-blue-500' : estadoInfo.color === 'text-orange-500' ? 'bg-orange-500' : 'bg-green-500'} transition-all duration-500`}
                        style={{ width: `${progreso}%` }}
                      ></div>
                    </div>
                  </div>

                  {expandido && (
                    <div className="border-t border-border p-6 bg-secondary/30">
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
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

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

                      {/* Botón Solicitar Devolución - solo para pedidos entregados */}
                      {pedido.estadoActual === 'entregado' && (
                        <div className="pt-4 border-t border-border">
                          <button
                            onClick={() => abrirModalDevolucion(pedido)}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <RotateCcw size={18} />
                            Solicitar Devolución
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Contenido del Tab Devoluciones */}
      {activeTab === 'devoluciones' && (
        <div className="space-y-4">
          {/* Header con botón */}
          <div className="flex items-center justify-between">
            <div className="bg-blue-50 dark:bg-[#24545A]/40 dark:bg-blue-900/20 border border-blue-200 dark:border-[#5E8587]/40 rounded-lg p-4 flex-1">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 dark:text-[#5E8587] flex-shrink-0" size={20} />
                <div className="text-sm text-blue-800 dark:text-[#5E8587]">
                  <p className="font-medium mb-1">Política de Devoluciones</p>
                  <p>Puedes solicitar la devolución de productos dentro de los 30 días posteriores a la entrega. Solo se aceptan devoluciones de pedidos con estado "Entregado".</p>
                </div>
              </div>
            </div>
            {pedidos.filter(p => p.estadoActual === 'entregado').length > 0 && (
              <button
                onClick={() => abrirModalDevolucion()}
                className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <RotateCcw size={20} />
                Registrar Devolución
              </button>
            )}
          </div>

          {devoluciones.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <RotateCcw size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-foreground mb-2">No hay devoluciones</h3>
              <p className="text-muted-foreground mb-6">
                No has solicitado ninguna devolución aún
              </p>
              <button
                onClick={() => setActiveTab('pedidos')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-colors"
              >
                Ver Mis Pedidos
              </button>
            </div>
          ) : (
            devoluciones.map((devolucion) => {
              const estadoInfo = getEstadoDevolucionInfo(devolucion.estado);

              return (
                <div key={devolucion.id} className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`${estadoInfo.bgColor} ${estadoInfo.color} p-3 rounded-lg`}>
                          {estadoInfo.icon}
                        </div>
                        <div>
                          <h3 className="text-foreground text-lg">Devolución #{devolucion.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            Pedido #{devolucion.pedidoId} | {devolucion.fecha} a las {devolucion.hora}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Monto a Devolver</p>
                        <p className="text-xl text-primary">${devolucion.montoDevolucion.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className={`${estadoInfo.color} px-3 py-1 rounded-full text-sm ${estadoInfo.bgColor} border ${estadoInfo.borderColor}`}>
                        {estadoInfo.label}
                      </span>
                    </div>

                    {/* Productos a devolver */}
                    <div className="mb-4">
                      <h4 className="text-foreground text-sm mb-3">Productos a Devolver</h4>
                      <div className="space-y-2">
                        {devolucion.productos.map((producto, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg">
                            <img
                              src={producto.imagen}
                              alt={producto.nombre}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-foreground text-sm">{producto.nombre}</p>
                              <p className="text-xs text-muted-foreground">
                                Cantidad: {producto.cantidad} | ${producto.precio.toLocaleString()} c/u
                              </p>
                            </div>
                            <p className="text-sm text-primary">${(producto.precio * producto.cantidad).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Motivo */}
                    <div className="bg-secondary/30 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Motivo de Devolución</p>
                      <p className="text-sm text-foreground">{devolucion.motivo}</p>
                    </div>

                    {/* Observaciones del admin si existe */}
                    {devolucion.observaciones && (
                      <div className="mt-4 bg-amber-50 dark:bg-[#B7654A]/25 dark:bg-amber-900/20 border border-amber-200 dark:border-[#B7654A]/40 p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Observaciones</p>
                        <p className="text-sm text-amber-800 dark:text-[#D08A70]">{devolucion.observaciones}</p>
                        {devolucion.fechaRespuesta && (
                          <p className="text-xs text-muted-foreground mt-2">Respondido el: {devolucion.fechaRespuesta}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

        </div>
      )}

      {/* Modal Solicitar Devolución */}
      {showModalDevolucion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-lg">
                  {pasoDevolucion === 'seleccion-pedido' ? 'Seleccionar Pedido' : 'Solicitar Devolución'}
                </h3>
                {pedidoSeleccionado && (
                  <p className="text-sm text-muted-foreground">Pedido #{pedidoSeleccionado.id}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowModalDevolucion(false);
                  setPasoDevolucion('seleccion-pedido');
                  setPedidoSeleccionado(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Paso 1: Selección de Pedido */}
              {pasoDevolucion === 'seleccion-pedido' && (
                <>
                  <p className="text-muted-foreground">
                    Selecciona el pedido del cual deseas devolver productos
                  </p>

                  <div className="space-y-3">
                    {pedidos.filter(p => p.estadoActual === 'entregado').length === 0 ? (
                      <div className="text-center py-8">
                        <Package size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                        <p className="text-muted-foreground">No tienes pedidos entregados para devolver</p>
                      </div>
                    ) : (
                      pedidos
                        .filter(p => p.estadoActual === 'entregado')
                        .map((pedido) => (
                          <div
                            key={pedido.id}
                            onClick={() => seleccionarPedidoParaDevolucion(pedido)}
                            className="p-4 border-2 border-border hover:border-primary bg-secondary/30 hover:bg-primary/5 rounded-lg cursor-pointer transition-all"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-foreground font-medium">Pedido #{pedido.id}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {pedido.fecha} - {pedido.productos.length} producto{pedido.productos.length > 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg text-primary font-medium">${pedido.total.toLocaleString()}</p>
                                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                                  Entregado
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {pedido.productos.slice(0, 3).map((producto, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-card px-3 py-1 rounded-lg text-xs">
                                  <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="w-6 h-6 object-cover rounded"
                                  />
                                  <span className="text-muted-foreground">{producto.nombre}</span>
                                </div>
                              ))}
                              {pedido.productos.length > 3 && (
                                <span className="text-xs text-muted-foreground px-2 py-1">
                                  +{pedido.productos.length - 3} más
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </>
              )}

              {/* Paso 2: Selección de productos */}
              {pasoDevolucion === 'seleccion-productos' && pedidoSeleccionado && (
                <>
                  {/* Botón volver */}
                  <button
                    onClick={volverASeleccionPedido}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    ← Volver a selección de pedido
                  </button>

                  <div>
                    <label className="block text-foreground mb-3">Selecciona los productos a devolver</label>
                    <div className="space-y-2">
                      {pedidoSeleccionado.productos.map((producto) => (
                        <div
                          key={producto.id}
                          onClick={() => toggleProductoDevolucion(String(producto.id))}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            productosDevolucion.includes(String(producto.id))
                              ? 'border-primary bg-primary/5'
                              : 'border-border bg-secondary/30 hover:border-primary/50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            productosDevolucion.includes(String(producto.id))
                              ? 'border-primary bg-primary'
                              : 'border-border'
                          }`}>
                            {productosDevolucion.includes(String(producto.id)) && (
                              <CheckCircle size={16} className="text-white" />
                            )}
                          </div>
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-foreground">{producto.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              Cantidad: {producto.cantidad} | ${producto.precio.toLocaleString()} c/u
                            </p>
                          </div>
                          <p className="text-foreground font-medium">${(producto.precio * producto.cantidad).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Motivo de devolución */}
                  <div>
                    <label className="block text-foreground mb-2">Motivo de la devolución *</label>
                    <textarea
                      value={motivoDevolucion}
                      onChange={(e) => setMotivoDevolucion(e.target.value)}
                      placeholder="Describe el motivo de la devolución..."
                      rows={4}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Total a devolver */}
                  {productosDevolucion.length > 0 && (
                    <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground">Total a Devolver:</span>
                        <span className="text-2xl text-primary font-medium">
                          ${pedidoSeleccionado.productos
                            .filter(p => productosDevolucion.includes(String(p.id)))
                            .reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {productosDevolucion.length} producto{productosDevolucion.length > 1 ? 's' : ''} seleccionado{productosDevolucion.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex gap-3 border-t border-border pt-4">
                    <button
                      onClick={() => {
                        setShowModalDevolucion(false);
                        setPasoDevolucion('seleccion-pedido');
                        setPedidoSeleccionado(null);
                      }}
                      className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-3 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={solicitarDevolucion}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Solicitar Devolución
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
