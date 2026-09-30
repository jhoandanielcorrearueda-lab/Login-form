import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, X, LogIn, UserPlus } from 'lucide-react';

interface ProductoCarrito {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  color?: string;
  talla?: string;
}

interface PublicCarritoProps {
  carrito: ProductoCarrito[];
  onUpdateCantidad: (id: string | number, nuevaCantidad: number) => void;
  onEliminar: (id: string | number) => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function PublicCarrito({ carrito, onUpdateCantidad, onEliminar, onLoginClick, onRegisterClick }: PublicCarritoProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const envio = carrito.length > 0 ? 15000 : 0;
  const total = subtotal + envio;

  const handleProcederCompra = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-foreground mb-6">Carrito de Compras</h1>

      {carrito.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <ShoppingCart size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">Tu carrito está vacío</h3>
          <p className="text-muted-foreground mb-6">Explora nuestro catálogo y agrega productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {carrito.map((item) => (
              <div key={item.id} className="bg-card rounded-lg border border-border p-6">
                <div className="flex gap-4">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-foreground mb-1">{item.nombre}</h3>
                        {item.color && (
                          <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                        )}
                        {item.talla && (
                          <p className="text-sm text-muted-foreground">Talla: {item.talla}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onEliminar(item.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUpdateCantidad(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          className="w-8 h-8 rounded-lg border border-border hover:bg-secondary flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-medium">{item.cantidad}</span>
                        <button
                          onClick={() => onUpdateCantidad(item.id, item.cantidad + 1)}
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
                onClick={handleProcederCompra}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors mb-4"
              >
                Proceder a Comprar
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

      {/* Modal de Login/Registro */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Inicia Sesión para Continuar</h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center mb-8">
              <ShoppingCart size={48} className="mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">
                Para completar tu compra necesitas tener una cuenta en Yesmau.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  onLoginClick();
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Iniciar Sesión
              </button>

              <button
                onClick={() => {
                  setShowLoginModal(false);
                  onRegisterClick();
                }}
                className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
                Crear Cuenta Nueva
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Al crear una cuenta podrás realizar compras, hacer seguimiento de tus pedidos y recibir ofertas exclusivas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
