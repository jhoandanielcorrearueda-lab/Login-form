import { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Search, Calendar, DollarSign, User, Package } from 'lucide-react';

interface ProductoVenta {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  tipo: 'tela' | 'prenda';
  unidad: string;
}

interface Venta {
  id: number;
  fecha: string;
  cliente: string;
  productos: ProductoVenta[];
  subtotal: number;
  descuento: number;
  total: number;
  metodoPago: string;
  estado: 'completada' | 'pendiente' | 'cancelada';
}

export default function Ventas() {
  const [showNuevaVenta, setShowNuevaVenta] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('');

  // Productos en el carrito actual
  const [carritoActual, setCarritoActual] = useState<ProductoVenta[]>([]);
  const [clienteActual, setClienteActual] = useState('');
  const [metodoPagoActual, setMetodoPagoActual] = useState('efectivo');
  const [descuentoActual, setDescuentoActual] = useState(0);

  // Nuevo producto a agregar
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: 0,
    cantidad: 1,
    tipo: 'tela' as 'tela' | 'prenda',
    unidad: 'metros'
  });

  const [ventas, setVentas] = useState<Venta[]>([
    {
      id: 1,
      fecha: '2026-04-23 10:30',
      cliente: 'María García',
      productos: [
        { id: 1, nombre: 'Algodón Rojo', precio: 25, cantidad: 5, tipo: 'tela', unidad: 'metros' },
        { id: 2, nombre: 'Vestido Midi Floral', precio: 120, cantidad: 1, tipo: 'prenda', unidad: 'unidad' }
      ],
      subtotal: 245,
      descuento: 10,
      total: 235,
      metodoPago: 'tarjeta',
      estado: 'completada'
    },
    {
      id: 2,
      fecha: '2026-04-23 11:45',
      cliente: 'Carlos Rodríguez',
      productos: [
        { id: 3, nombre: 'Seda Azul', precio: 45, cantidad: 3, tipo: 'tela', unidad: 'metros' },
        { id: 4, nombre: 'Camisa Clásica', precio: 65, cantidad: 2, tipo: 'prenda', unidad: 'unidad' }
      ],
      subtotal: 265,
      descuento: 0,
      total: 265,
      metodoPago: 'efectivo',
      estado: 'completada'
    },
    {
      id: 3,
      fecha: '2026-04-23 14:20',
      cliente: 'Ana López',
      productos: [
        { id: 5, nombre: 'Lino Verde', precio: 30, cantidad: 8, tipo: 'tela', unidad: 'metros' }
      ],
      subtotal: 240,
      descuento: 15,
      total: 225,
      metodoPago: 'transferencia',
      estado: 'pendiente'
    }
  ]);

  const agregarProducto = () => {
    if (nuevoProducto.nombre && nuevoProducto.precio > 0 && nuevoProducto.cantidad > 0) {
      setCarritoActual([...carritoActual, {
        id: Date.now(),
        ...nuevoProducto
      }]);
      setNuevoProducto({
        nombre: '',
        precio: 0,
        cantidad: 1,
        tipo: 'tela',
        unidad: 'metros'
      });
    }
  };

  const eliminarProducto = (id: number) => {
    setCarritoActual(carritoActual.filter(p => p.id !== id));
  };

  const calcularSubtotal = () => {
    return carritoActual.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    return subtotal - descuentoActual;
  };

  const registrarVenta = () => {
    if (carritoActual.length === 0 || !clienteActual) {
      alert('Debe agregar productos y especificar el cliente');
      return;
    }

    const nuevaVenta: Venta = {
      id: ventas.length + 1,
      fecha: new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      cliente: clienteActual,
      productos: carritoActual,
      subtotal: calcularSubtotal(),
      descuento: descuentoActual,
      total: calcularTotal(),
      metodoPago: metodoPagoActual,
      estado: 'completada'
    };

    setVentas([nuevaVenta, ...ventas]);

    // Limpiar formulario
    setCarritoActual([]);
    setClienteActual('');
    setDescuentoActual(0);
    setShowNuevaVenta(false);

    alert('Venta registrada exitosamente');
  };

  const filteredVentas = ventas.filter(venta => {
    const matchesSearch = venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venta.id.toString().includes(searchTerm);
    const matchesEstado = !filterEstado || venta.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
  const ventasHoy = ventas.filter(v => v.fecha.startsWith(new Date().toISOString().split('T')[0])).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Módulo de Ventas</h2>
          <p className="text-muted-foreground">Registra y gestiona las ventas del negocio</p>
        </div>
        <button
          onClick={() => setShowNuevaVenta(!showNuevaVenta)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus size={20} />
          Nueva Venta
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#24545A]/50 dark:to-[#24545A]/30 rounded-lg p-6 border border-blue-200 dark:border-[#5E8587]/40">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-blue-600 dark:text-[#5E8587]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{ventas.length}</p>
              <p className="text-sm text-muted-foreground">Total Ventas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-[#24545A]/70 dark:to-[#24545A]/50 rounded-lg p-6 border border-green-200 dark:border-[#5E8587]/60">
          <div className="flex items-center gap-3">
            <Calendar className="text-green-600 dark:text-[#5E8587]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{ventasHoy}</p>
              <p className="text-sm text-muted-foreground">Ventas Hoy</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-[#A98255]/25 dark:to-[#A98255]/10 rounded-lg p-6 border border-purple-200 dark:border-[#A98255]/40">
          <div className="flex items-center gap-3">
            <DollarSign className="text-purple-600 dark:text-[#D8C2A8]" size={32} />
            <div>
              <p className="text-2xl text-foreground">${totalVentas.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Ingresos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario Nueva Venta */}
      {showNuevaVenta && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-foreground mb-4">Registrar Nueva Venta</h3>

          {/* Datos del Cliente */}
          <div className="mb-6">
            <label className="block text-foreground mb-2">Cliente</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={clienteActual}
                onChange={(e) => setClienteActual(e.target.value)}
                placeholder="Nombre del cliente"
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Agregar Productos */}
          <div className="mb-6">
            <h4 className="text-foreground mb-3">Agregar Productos</h4>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                className="md:col-span-2 px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={nuevoProducto.tipo}
                onChange={(e) => setNuevoProducto({
                  ...nuevoProducto,
                  tipo: e.target.value as 'tela' | 'prenda',
                  unidad: e.target.value === 'tela' ? 'metros' : 'unidad'
                })}
                className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="tela">Tela</option>
                <option value="prenda">Prenda</option>
              </select>
              <input
                type="number"
                placeholder="Precio"
                value={nuevoProducto.precio || ''}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: Number(e.target.value) })}
                className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={nuevoProducto.cantidad}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: Number(e.target.value) })}
                className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={agregarProducto}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Lista de Productos en Carrito */}
            {carritoActual.length > 0 && (
              <div className="bg-secondary rounded-lg p-4 mt-4">
                <h5 className="text-foreground mb-3">Productos en la venta:</h5>
                <div className="space-y-2">
                  {carritoActual.map((producto) => (
                    <div key={producto.id} className="flex items-center justify-between bg-card p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-foreground">{producto.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {producto.cantidad} {producto.unidad} × ${producto.precio}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-primary font-medium">${(producto.precio * producto.cantidad).toFixed(2)}</p>
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cálculos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-foreground mb-2">Método de Pago</label>
              <select
                value={metodoPagoActual}
                onChange={(e) => setMetodoPagoActual(e.target.value)}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="credito">Crédito</option>
              </select>
            </div>
            <div>
              <label className="block text-foreground mb-2">Descuento ($)</label>
              <input
                type="number"
                value={descuentoActual || ''}
                onChange={(e) => setDescuentoActual(Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Totales */}
          <div className="bg-secondary rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="text-foreground">${calcularSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Descuento:</span>
              <span className="text-foreground">-${descuentoActual.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-foreground font-medium">Total:</span>
              <span className="text-primary text-xl font-medium">${calcularTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={registrarVenta}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90"
            >
              Registrar Venta
            </button>
            <button
              onClick={() => {
                setShowNuevaVenta(false);
                setCarritoActual([]);
                setClienteActual('');
                setDescuentoActual(0);
              }}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente o ID de venta..."
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
          <option value="completada">Completadas</option>
          <option value="pendiente">Pendientes</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {/* Lista de Ventas */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3 text-foreground">ID</th>
              <th className="text-left px-6 py-3 text-foreground">Fecha</th>
              <th className="text-left px-6 py-3 text-foreground">Cliente</th>
              <th className="text-left px-6 py-3 text-foreground">Productos</th>
              <th className="text-left px-6 py-3 text-foreground">Total</th>
              <th className="text-left px-6 py-3 text-foreground">Método Pago</th>
              <th className="text-left px-6 py-3 text-foreground">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentas.map((venta) => (
              <tr key={venta.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-6 py-4 text-foreground">#{venta.id}</td>
                <td className="px-6 py-4 text-muted-foreground">{venta.fecha}</td>
                <td className="px-6 py-4 text-foreground">{venta.cliente}</td>
                <td className="px-6 py-4 text-muted-foreground">{venta.productos.length} items</td>
                <td className="px-6 py-4 text-primary font-medium">${venta.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-muted-foreground capitalize">{venta.metodoPago}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    venta.estado === 'completada' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#5E8587]' :
                    venta.estado === 'pendiente' ? 'bg-amber-100 dark:bg-[#B7654A]/30 text-amber-700 dark:text-[#D08A70]' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#D08A70]'
                  }`}>
                    {venta.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
