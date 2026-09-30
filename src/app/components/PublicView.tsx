import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Star } from 'lucide-react';
import PublicNavbar from './PublicNavbar';
import PublicCatalogo from './PublicCatalogo';
import PublicCarrito from './PublicCarrito';
import GestionRetazos from './GestionRetazos';
import MisPedidos from './MisPedidos';
import WhatsAppFloat from './WhatsAppFloat';

interface PublicViewProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface ProductoCarrito {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  color?: string;
  talla?: string;
}

export default function PublicView({ onLoginClick, onRegisterClick, darkMode, onToggleDarkMode }: PublicViewProps) {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [carrito, setCarrito] = useState<ProductoCarrito[]>(() => {
    const saved = localStorage.getItem('guestCarrito');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('guestCarrito', JSON.stringify(carrito));
  }, [carrito]);

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
        color: producto.color,
        talla: producto.tallas ? producto.tallas[0] : undefined
      };
      setCarrito([...carrito, nuevoItem]);
    }

    // Mostrar mensaje de éxito (opcional)
    alert('Producto agregado al carrito');
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

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar
        onNavigate={setCurrentSection}
        onLoginClick={onLoginClick}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        carritoCount={carrito.reduce((acc, item) => acc + item.cantidad, 0)}
        currentSection={currentSection}
      />

      {currentSection === 'home' && (
        <HomePage
          onNavigate={setCurrentSection}
          onAddToCart={handleAddToCart}
          carrito={carrito}
          onEliminarDelCarrito={handleEliminarDelCarrito}
        />
      )}
      {currentSection === 'telas' && <PublicCatalogo tipo="telas" onAddToCart={handleAddToCart} />}
      {currentSection === 'vestidos' && <PublicCatalogo tipo="vestidos" onAddToCart={handleAddToCart} />}
      {currentSection === 'camisas' && <PublicCatalogo tipo="camisas" onAddToCart={handleAddToCart} />}
      {currentSection === 'pantalones' && <PublicCatalogo tipo="pantalones" onAddToCart={handleAddToCart} />}
      {currentSection === 'faldas' && <PublicCatalogo tipo="faldas" onAddToCart={handleAddToCart} />}
      {currentSection === 'carrito' && (
        <PublicCarrito
          carrito={carrito}
          onUpdateCantidad={handleUpdateCantidad}
          onEliminar={handleEliminarDelCarrito}
          onLoginClick={onLoginClick}
          onRegisterClick={onRegisterClick}
        />
      )}
      {currentSection === 'retazos' && (
        <div className="max-w-6xl mx-auto px-4 py-16">
          <GestionRetazos />
        </div>
      )}
      {currentSection === 'pedidos' && <MisPedidos />}
      {currentSection === 'nosotros' && <NosotrosPage />}
      {currentSection === 'contacto' && <ContactoPage />}

      {/* WhatsApp Flotante */}
      <WhatsAppFloat
        phoneNumber="573001234567"
        message="Hola, estoy interesado en los productos de Yesmau Moda. ¿Podrían ayudarme?"
      />
    </div>
  );
}

interface HomePageProps {
  onNavigate: (section: string) => void;
  onAddToCart: (producto: any) => void;
  carrito: ProductoCarrito[];
  onEliminarDelCarrito: (id: string | number) => void;
}

function HomePage({ onNavigate, onAddToCart, carrito, onEliminarDelCarrito }: HomePageProps) {
  return (
    <div className="space-y-0">
      {/* Hero Section - Más moderno y visual */}
      <section className="relative h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="grid grid-cols-2 h-full">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1753162658653-d33c53910d9e?w=1000"
                alt="Fashion Design"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1771098403201-8d0d32e2a062?w=1000"
                alt="Fabric Collection"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2527]/92 via-[#173A3E]/78 to-[#24545A]/30"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-6xl md:text-7xl text-white mb-6 leading-tight drop-shadow-lg">
                YESMAU<br/>MODA
              </h1>
              <p className="text-2xl text-[#F5EEE4] mb-8 leading-relaxed drop-shadow">
                Telas premium, moda exclusiva y herramientas inteligentes
                para dar vida a tus creaciones
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('telas')}
                  className="bg-primary text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all text-lg shadow-lg hover:shadow-xl"
                >
                  Explorar Catálogo
                </button>
                <button
                  onClick={() => onNavigate('retazos')}
                  className="bg-card/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-xl hover:bg-card/30 transition-all text-lg"
                >
                  Retazos Sostenibles
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Retazos Sostenibles - Banner */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-foreground mb-4">Moda Sostenible</h2>
            <p className="text-xl text-muted-foreground">Recicla, reutiliza y crea con propósito</p>
          </div>
          <button
            onClick={() => onNavigate('retazos')}
            className="group relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1650324371896-f0b4bc2238dd?w=1200"
              alt="Gestión de Retazos"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F2527]/95 via-[#173A3E]/80 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-center p-12 max-w-2xl">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                <span className="text-4xl">♻️</span>
              </div>
              <h3 className="text-3xl mb-3 text-white drop-shadow">Gestión Inteligente de Retazos</h3>
              <p className="text-[#F5EEE4] text-lg mb-6 drop-shadow">
                Recicla y reutiliza. Dona tus retazos, descubre nuevos usos o compra
                materiales sostenibles para proyectos creativos.
              </p>
              <div className="flex items-center gap-2 text-[#D8C2A8] font-medium">
                <span>Explorar retazos</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Categorías - Rediseñadas */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-foreground mb-4">Explora Nuestro Catálogo</h2>
            <p className="text-xl text-muted-foreground">Más de 1000 productos disponibles</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { id: 'telas', nombre: 'Telas', cantidad: '60+ tipos', imagen: 'https://images.unsplash.com/photo-1771098206944-ac1633b8276d?w=400', color: 'from-blue-500/80' },
              { id: 'vestidos', nombre: 'Vestidos', cantidad: '20 modelos', imagen: 'https://images.unsplash.com/photo-1637690048998-1e41c61c254d?w=400', color: 'from-pink-500/80' },
              { id: 'camisas', nombre: 'Camisas', cantidad: '15 estilos', imagen: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', color: 'from-purple-500/80' },
              { id: 'pantalones', nombre: 'Pantalones', cantidad: '15 modelos', imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', color: 'from-indigo-500/80' },
              { id: 'faldas', nombre: 'Faldas', cantidad: '15 diseños', imagen: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400', color: 'from-rose-500/80' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate(cat.id)}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
              >
                <img
                  src={cat.imagen}
                  alt={cat.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`}></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <p className="text-sm text-white/80 mb-1">{cat.cantidad}</p>
                  <h3 className="text-2xl mb-2">{cat.nombre}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm">Ver todo</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados con Carrito */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-foreground mb-4">Productos Destacados</h2>
            <p className="text-xl text-muted-foreground">Las mejores piezas de nuestra colección</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getProductosDestacados().map((producto) => {
              const enCarrito = carrito.find(item => item.id === producto.id);

              return (
                <div key={producto.id} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={producto.imagen} alt={producto.nombre} className="w-full h-64 object-cover" />
                    {enCarrito && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <ShoppingCart size={12} />
                        {enCarrito.cantidad}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-foreground mb-1">{producto.nombre}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < 4 ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-300'}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
                    </div>
                    <p className="text-xl text-primary mb-3">${producto.precio.toLocaleString()}</p>

                    {enCarrito ? (
                      <button
                        onClick={() => onEliminarDelCarrito(producto.id)}
                        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} />
                        Quitar del Carrito
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddToCart(producto)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        Agregar al Carrito
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-[#173A3E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl mb-2">+5,000</div>
              <p className="text-white/80">Clientes Felices</p>
            </div>
            <div>
              <div className="text-5xl mb-2">100+</div>
              <p className="text-white/80">Tipos de Telas</p>
            </div>
            <div>
              <div className="text-5xl mb-2">100%</div>
              <p className="text-white/80">Calidad Premium</p>
            </div>
            <div>
              <div className="text-5xl mb-2">24/7</div>
              <p className="text-white/80">Atención al Cliente</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl text-foreground mb-6">¿Listo para crear algo único?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Únete a miles de diseñadores y creadores que confían en Yesmau Moda
          </p>
          <button
            onClick={() => onNavigate('telas')}
            className="bg-primary text-white px-12 py-4 rounded-xl hover:opacity-90 transition-all text-lg shadow-lg inline-flex items-center gap-3"
          >
            <span>Comenzar Ahora</span>
            <span>→</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function getProductosDestacados() {
  return [
    {
      id: 'dest-1',
      nombre: 'Vestido Floral Elegante',
      precio: 89000,
      imagen: 'https://images.unsplash.com/photo-1637690048998-1e41c61c254d?w=400',
      color: 'Rosa'
    },
    {
      id: 'dest-2',
      nombre: 'Blusa Seda Premium',
      precio: 65000,
      imagen: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
      color: 'Blanco'
    },
    {
      id: 'dest-3',
      nombre: 'Pantalón Denim Clásico',
      precio: 75000,
      imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
      color: 'Azul'
    },
    {
      id: 'dest-4',
      nombre: 'Falda Midi Plisada',
      precio: 55000,
      imagen: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
      color: 'Negro'
    }
  ];
}

function NosotrosPage() {
  return (
    <div className="space-y-0">
      <section className="relative h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1753162659461-38d8ea5b15ab?w=1920"
          alt="Nuestro equipo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl text-white mb-4">Sobre Nosotros</h1>
            <p className="text-xl text-white/90">Pasión por la moda y compromiso con la calidad</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl text-foreground mb-4">Nuestra Historia</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Yesmau Moda nació de la pasión por las telas y el diseño. Con más de 10 años
                de experiencia, nos hemos consolidado como referentes en la industria textil,
                ofreciendo productos de la más alta calidad y un servicio excepcional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
              <div className="text-center">
                <div className="text-4xl text-primary mb-2">10+</div>
                <p className="text-muted-foreground">Años de experiencia</p>
              </div>
              <div className="text-center">
                <div className="text-4xl text-primary mb-2">5,000+</div>
                <p className="text-muted-foreground">Clientes satisfechos</p>
              </div>
              <div className="text-center">
                <div className="text-4xl text-primary mb-2">100%</div>
                <p className="text-muted-foreground">Compromiso con calidad</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl text-foreground mb-4">Nuestra Misión</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Proporcionar a diseñadores, modistas y creativos las mejores telas y herramientas
                para que puedan materializar sus ideas. Creemos en la sostenibilidad, la innovación
                y el poder transformador de la moda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactoPage() {
  return (
    <div className="space-y-0">
      <section className="relative h-80 overflow-hidden bg-gradient-to-r from-primary to-[#173A3E]">
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 className="text-5xl text-white mb-4">Contáctanos</h1>
            <p className="text-xl text-white/90">Estamos aquí para ayudarte</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl text-foreground mb-6">Información de Contacto</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h4 className="text-foreground mb-1">Dirección</h4>
                    <p className="text-muted-foreground">Calle 123 #45-67, Bogotá, Colombia</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <h4 className="text-foreground mb-1">Teléfono</h4>
                    <p className="text-muted-foreground">+57 300 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✉️</span>
                  </div>
                  <div>
                    <h4 className="text-foreground mb-1">Email</h4>
                    <p className="text-muted-foreground">contacto@yesmaumoda.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🕐</span>
                  </div>
                  <div>
                    <h4 className="text-foreground mb-1">Horario</h4>
                    <p className="text-muted-foreground">
                      Lunes - Sábado: 9:00 AM - 6:00 PM<br/>
                      Domingo: Cerrado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-8">
              <h3 className="text-2xl text-foreground mb-6">Envíanos un mensaje</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-foreground mb-2">Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Juan Pérez"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="tu@ejemplo.com"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">Asunto</label>
                  <input
                    type="text"
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">Mensaje</label>
                  <textarea
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
