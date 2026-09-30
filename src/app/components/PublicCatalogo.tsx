import { useState } from 'react';
import { Star, Search, ShoppingCart } from 'lucide-react';

type ProductType = 'telas' | 'vestidos' | 'camisas' | 'pantalones' | 'faldas';

interface PublicCatalogoProps {
  tipo: ProductType;
  onAddToCart?: (producto: any) => void;
}

export default function PublicCatalogo({ tipo, onAddToCart }: PublicCatalogoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const catalogos = {
    telas: getTelas(),
    vestidos: getVestidos(),
    camisas: getCamisas(),
    pantalones: getPantalones(),
    faldas: getFaldas()
  };

  const colores = [
    'Rojo', 'Azul', 'Verde', 'Rosa', 'Negro', 'Blanco',
    'Beige', 'Morado', 'Amarillo', 'Gris'
  ];

  const productos = catalogos[tipo];
  const filteredProductos = productos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColor = !selectedColor || p.color?.includes(selectedColor);
    return matchesSearch && matchesColor;
  });

  const titles = {
    telas: 'Catálogo de Telas',
    vestidos: 'Catálogo de Vestidos',
    camisas: 'Catálogo de Camisas',
    pantalones: 'Catálogo de Pantalones',
    faldas: 'Catálogo de Faldas'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-foreground mb-6">{titles[tipo]}</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los colores</option>
          {colores.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProductos.map(producto => (
          <div key={producto.id} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-64 object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-foreground mb-2">{producto.nombre}</h3>
              {producto.color && (
                <p className="text-sm text-muted-foreground mb-2">{producto.color}</p>
              )}
              <p className="text-xl text-primary mb-2">${producto.precio}</p>
              {producto.detalles && (
                <p className="text-sm text-muted-foreground">{producto.detalles}</p>
              )}
              {producto.tallas && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Tallas:</p>
                  <div className="flex gap-2 flex-wrap">
                    {producto.tallas.map((talla, idx) => (
                      <span key={idx} className="px-2 py-1 bg-secondary text-sm rounded">
                        {talla}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(producto)}
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Agregar al Carrito
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTelas() {
  const tipos = [
    'Algodón', 'Seda', 'Lino', 'Satén', 'Tul', 'Gasa', 'Terciopelo', 'Denim',
    'Jersey', 'Lycra', 'Encaje', 'Organza', 'Chiffon', 'Crepe'
  ];

  const colores = ['Rojo', 'Azul', 'Verde', 'Rosa', 'Negro', 'Blanco', 'Beige', 'Morado'];
  const imagenes = [
    'https://images.unsplash.com/photo-1771098206944-ac1633b8276d?w=400',
    'https://images.unsplash.com/photo-1771128264920-a06ef7462da7?w=400',
    'https://images.unsplash.com/photo-1600024512646-5ef7b23d3bfa?w=400',
    'https://images.unsplash.com/photo-1771098403201-8d0d32e2a062?w=400'
  ];

  return tipos.flatMap((tipo, idx) =>
    colores.slice(0, Math.min(4, colores.length)).map((color, cidx) => ({
      id: idx * 10 + cidx,
      nombre: `${tipo} ${color}`,
      color: color,
      precio: Math.floor(Math.random() * 50 + 15),
      detalles: `${Math.floor(Math.random() * 500 + 50)}m disponibles`,
      imagen: imagenes[idx % imagenes.length]
    }))
  ).slice(0, 60);
}

function getVestidos() {
  const modelos = [
    'Vestido Cóctel', 'Vestido Midi Floral', 'Vestido Maxi Boho', 'Vestido Casual',
    'Vestido Elegante', 'Vestido Cruzado', 'Vestido Camisero', 'Vestido Tirantes',
    'Vestido Palabra de Honor', 'Vestido Espalda Descubierta', 'Vestido Asimétrico',
    'Vestido Plisado', 'Vestido con Volantes', 'Vestido Animal Print', 'Vestido Lentejuelas',
    'Vestido Cut-Out', 'Vestido Satinado', 'Vestido Denim', 'Vestido Tejido', 'Vestido Slip'
  ];

  const imagenes = [
    'https://images.unsplash.com/photo-1637690048998-1e41c61c254d?w=400',
    'https://images.unsplash.com/photo-1765229276796-c93c73cc3f3b?w=400',
    'https://images.unsplash.com/photo-1768460608433-d3af5148832c?w=400',
    'https://images.unsplash.com/photo-1756483510840-b0dda5f0dd0f?w=400',
    'https://images.unsplash.com/photo-1765229278873-edd7918dd31d?w=400'
  ];

  return modelos.map((modelo, idx) => ({
    id: idx + 1,
    nombre: modelo,
    color: 'Varios colores disponibles',
    precio: Math.floor(Math.random() * 150 + 80),
    tallas: ['XS', 'S', 'M', 'L', 'XL'],
    imagen: imagenes[idx % imagenes.length]
  }));
}

function getCamisas() {
  const modelos = [
    'Camisa Clásica Blanca', 'Camisa Denim', 'Camisa Floral', 'Camisa Rayas',
    'Camisa Satinada', 'Camisa Oversize', 'Camisa Cropped', 'Camisa con Lazo',
    'Camisa Bordada', 'Camisa Lino', 'Camisa Cuadros', 'Camisa Seda',
    'Camisa Manga Larga', 'Camisa Corta', 'Camisa Elegante'
  ];

  return modelos.map((modelo, idx) => ({
    id: idx + 1,
    nombre: modelo,
    color: idx % 2 === 0 ? 'Blanco' : 'Varios',
    precio: Math.floor(Math.random() * 80 + 40),
    tallas: ['S', 'M', 'L', 'XL'],
    imagen: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'
  }));
}

function getPantalones() {
  const modelos = [
    'Pantalón Jean Clásico', 'Pantalón Palazzo', 'Pantalón Cargo', 'Pantalón Chino',
    'Pantalón Recto', 'Pantalón Acampanado', 'Pantalón Skinny', 'Pantalón Mom Fit',
    'Pantalón Lino', 'Pantalón Deportivo', 'Pantalón Elegante', 'Pantalón Wide Leg',
    'Pantalón Culotte', 'Pantalón Jogger', 'Pantalón Sastre'
  ];

  return modelos.map((modelo, idx) => ({
    id: idx + 1,
    nombre: modelo,
    color: ['Negro', 'Azul', 'Beige', 'Gris'][idx % 4],
    precio: Math.floor(Math.random() * 100 + 60),
    tallas: ['S', 'M', 'L', 'XL'],
    imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400'
  }));
}

function getFaldas() {
  const modelos = [
    'Falda Midi Plisada', 'Falda Lápiz', 'Falda Acampanada', 'Falda Maxi',
    'Falda Mini', 'Falda Asimétrica', 'Falda Denim', 'Falda Tul',
    'Falda Estampada', 'Falda Cuero Sintético', 'Falda Pareo', 'Falda Tableada',
    'Falda Cruzada', 'Falda con Volantes', 'Falda Satinada'
  ];

  return modelos.map((modelo, idx) => ({
    id: idx + 1,
    nombre: modelo,
    color: ['Negro', 'Rosa', 'Blanco', 'Rojo', 'Azul'][idx % 5],
    precio: Math.floor(Math.random() * 70 + 35),
    tallas: ['XS', 'S', 'M', 'L'],
    imagen: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400'
  }));
}
