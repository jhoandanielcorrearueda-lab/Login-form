import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Package, X, CheckCircle } from 'lucide-react';

interface ProductoCarrito {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
  talla?: string;
  color?: string;
  imagen?: string;
}

interface CarritoProps {
  carrito?: ProductoCarrito[];
  onUpdateCantidad?: (id: string | number, nuevaCantidad: number) => void;
  onEliminar?: (id: string | number) => void;
}

export default function Carrito({ carrito: carritoExterno, onUpdateCantidad, onEliminar }: CarritoProps) {
  const [carritoLocal, setCarritoLocal] = useState<ProductoCarrito[]>([
    { id: '1', nombre: 'Vestido Floral Verano', precio: 89000, cantidad: 1, talla: 'M', color: 'Rosa' },
    { id: '2', nombre: 'Blusa Elegante Seda', precio: 65000, cantidad: 2, talla: 'S', color: 'Blanco' },
    { id: '3', nombre: 'Pantalón Casual Denim', precio: 75000, cantidad: 1, talla: 'L', color: 'Azul' }
  ]);

  const carrito = carritoExterno || carritoLocal;

  const [descuento, setDescuento] = useState(0);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [showModalPago, setShowModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'stripe' | 'tarjeta' | 'pse' | 'efectivo'>('stripe');
  const [showConfirmacion, setShowConfirmacion] = useState(false);

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
  const envio = 15000;
  const total = subtotal - descuentoValor + envio;

  const handleProcederPago = () => {
    if (carrito.length === 0) return;
    setShowModalPago(true);
  };

  const handleConfirmarCompra = () => {
    setShowModalPago(false);
    setShowConfirmacion(true);
  };

  const handleFinalizarCompra = () => {
    // Crear el pedido
    const metodosNombres = {
      stripe: 'Stripe',
      tarjeta: 'Tarjeta de Crédito/Débito',
      pse: 'PSE',
      efectivo: 'Efectivo'
    };

    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0].substring(0, 5);

    // Cargar pedidos existentes del localStorage
    const pedidosExistentes = localStorage.getItem('pedidosCliente');
    const pedidos = pedidosExistentes ? JSON.parse(pedidosExistentes) : [];

    // Calcular IVA (19%)
    const iva = subtotal * 0.19;
    const totalConIVA = subtotal + iva;

    // Crear nuevo pedido
    const nuevoPedido = {
      id: `PED-${String(pedidos.length + 1).padStart(3, '0')}`,
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
      total: totalConIVA,
      estadoActual: 'procesado' as const,
      historialEstados: [
        {
          estado: 'procesado' as const,
          fecha,
          hora
        }
      ],
      direccionEnvio: 'Dirección de ejemplo (se configurará en el futuro)',
      metodoPago: metodosNombres[metodoPago]
    };

    // Agregar el nuevo pedido a la lista
    pedidos.push(nuevoPedido);

    // Guardar en localStorage
    localStorage.setItem('pedidosCliente', JSON.stringify(pedidos));

    alert(`¡Compra realizada exitosamente!\nMétodo de pago: ${metodosNombres[metodoPago]}\nTotal: $${totalConIVA.toLocaleString()}\n\nPuedes hacer seguimiento de tu pedido en "Mis Pedidos"`);

    // Limpiar carrito (si usas estado local)
    if (!onEliminar) {
      setCarritoLocal([]);
    }

    setShowConfirmacion(false);
    setDescuento(0);
    setCodigoCupon('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Carrito de Compras</h2>
          <p className="text-sm text-muted-foreground">{carrito.length} producto(s) en tu carrito</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {carrito.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">Tu carrito está vacío</h3>
              <p className="text-muted-foreground">Agrega productos al carrito para continuar</p>
            </div>
          ) : (
            carrito.map((item) => (
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
                          className="w-8 h-8 rounded-lg border border-border hover:bg-secondary flex items-center justify-center transition-colors"
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
                      <p className="font-medium text-foreground">
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 sticky top-6 space-y-6">
            <h3 className="text-foreground">Resumen del Pedido</h3>

            {/* Cupón de descuento */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Código de cupón</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codigoCupon}
                  onChange={(e) => setCodigoCupon(e.target.value)}
                  placeholder="DESCUENTO10"
                  className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={aplicarCupon}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors"
                >
                  Aplicar
                </button>
              </div>
              {descuento > 0 && (
                <p className="text-xs text-primary mt-2">✓ Descuento del {descuento}% aplicado</p>
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toLocaleString()}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Descuento ({descuento}%)</span>
                  <span className="text-primary">-${descuentoValor.toLocaleString()}</span>
                </div>
              )}
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
              disabled={carrito.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard size={20} />
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

      {/* Modal de Selección de Método de Pago */}
      {showModalPago && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">Selecciona tu método de pago</h3>
              <button
                onClick={() => setShowModalPago(false)}
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Resumen de compra */}
              <div className="bg-secondary rounded-lg p-4">
                <h4 className="text-foreground font-medium mb-3">Resumen de tu compra</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Productos ({carrito.reduce((acc, item) => acc + item.cantidad, 0)})</span>
                    <span className="text-foreground">${subtotal.toLocaleString()}</span>
                  </div>
                  {descuento > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Descuento ({descuento}%)</span>
                      <span className="text-primary">-${descuentoValor.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-foreground">${envio.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-medium text-foreground">Total a pagar</span>
                    <span className="font-bold text-primary text-xl">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Métodos de pago */}
              <div>
                <h4 className="text-foreground font-medium mb-3">Método de pago</h4>
                <div className="space-y-3">
                  {/* Stripe */}
                  <button
                    onClick={() => setMetodoPago('stripe')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      metodoPago === 'stripe'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        metodoPago === 'stripe' ? 'border-primary' : 'border-border'
                      }`}>
                        {metodoPago === 'stripe' && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-foreground font-medium">Stripe</p>
                        <p className="text-sm text-muted-foreground">Pago seguro con tarjeta mediante Stripe</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          MC
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Tarjeta de crédito/débito */}
                  <button
                    onClick={() => setMetodoPago('tarjeta')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      metodoPago === 'tarjeta'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        metodoPago === 'tarjeta' ? 'border-primary' : 'border-border'
                      }`}>
                        {metodoPago === 'tarjeta' && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-foreground font-medium">Tarjeta de Crédito/Débito</p>
                        <p className="text-sm text-muted-foreground">Pago directo con tarjeta</p>
                      </div>
                      <CreditCard className="text-muted-foreground" size={24} />
                    </div>
                  </button>

                  {/* PSE */}
                  <button
                    onClick={() => setMetodoPago('pse')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      metodoPago === 'pse'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        metodoPago === 'pse' ? 'border-primary' : 'border-border'
                      }`}>
                        {metodoPago === 'pse' && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-foreground font-medium">PSE</p>
                        <p className="text-sm text-muted-foreground">Pago a través de tu banco</p>
                      </div>
                      <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        PSE
                      </div>
                    </div>
                  </button>

                  {/* Efectivo */}
                  <button
                    onClick={() => setMetodoPago('efectivo')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      metodoPago === 'efectivo'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        metodoPago === 'efectivo' ? 'border-primary' : 'border-border'
                      }`}>
                        {metodoPago === 'efectivo' && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-foreground font-medium">Pago en Efectivo</p>
                        <p className="text-sm text-muted-foreground">Paga al recibir tu pedido</p>
                      </div>
                      <Package className="text-muted-foreground" size={24} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Información de seguridad */}
              <div className="bg-green-50 dark:bg-[#24545A]/50 dark:bg-green-900/20 border border-green-200 dark:border-[#5E8587]/60 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle className="text-green-600 dark:text-[#5E8587] flex-shrink-0" size={20} />
                  <div className="text-sm">
                    <p className="text-green-800 dark:text-[#D8C2A8] font-medium mb-1">Pago 100% seguro</p>
                    <p className="text-green-700 dark:text-[#5E8587]">
                      Tus datos están protegidos con encriptación SSL de última generación
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModalPago(false)}
                  className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarCompra}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmacion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full">
            <div className="p-6 text-center">
              <div className="inline-flex p-4 bg-amber-100 dark:bg-[#B7654A]/30 rounded-full mb-4">
                <ShoppingCart className="text-amber-600 dark:text-[#D08A70]" size={48} />
              </div>
              <h3 className="text-2xl text-foreground mb-3">¿Seguro que quieres hacer esta compra?</h3>
              <div className="bg-secondary rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total a pagar:</span>
                    <span className="text-foreground font-bold text-lg">${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método de pago:</span>
                    <span className="text-foreground">
                      {metodoPago === 'stripe' && 'Stripe'}
                      {metodoPago === 'tarjeta' && 'Tarjeta'}
                      {metodoPago === 'pse' && 'PSE'}
                      {metodoPago === 'efectivo' && 'Efectivo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Productos:</span>
                    <span className="text-foreground">{carrito.reduce((acc, item) => acc + item.cantidad, 0)} artículo(s)</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Esta acción procesará tu pago y generará tu pedido. Recibirás un correo de confirmación.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmacion(false)}
                  className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinalizarCompra}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium"
                >
                  Sí, confirmar compra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
