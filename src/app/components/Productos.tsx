import { useState } from 'react';
import { Star, Search, Filter, Grid3x3, List, SlidersHorizontal, X, ShoppingCart, Plus, FileSpreadsheet, Eye } from 'lucide-react';
import ImportarExcel from './ImportarExcel';
import Resenas from './Resenas';

type ViewMode = 'grid' | 'list';
type ProductType = 'telas' | 'vestidos' | 'blusas' | 'camisas' | 'pantalones' | 'faldas';

interface Producto {
  id: number;
  nombre: string;
  tipo: ProductType;
  modelo?: string;
  tipoTela?: string;
  precio: number;
  color: string;
  coloresDisponibles?: string[];
  tallasDisponibles?: string[];
  cantidadDisponible?: number;
  imagen: string;
  isFavorite: boolean;
  calificacion: number;
  numReviews: number;
}

const tiposDeTela = [
  'Algodón', 'Seda', 'Lino', 'Satén', 'Tul', 'Gasa', 'Terciopelo', 'Denim',
  'Jersey', 'Lycra', 'Poliéster', 'Viscosa', 'Encaje', 'Organza', 'Chiffon',
  'Crepe', 'Jacquard', 'Brocado', 'Tafetán', 'Microfibra', 'Neopreno', 'Punto',
  'Franela', 'Gabardina', 'Piqué', 'Popelina', 'Raso', 'Tweed', 'Voile'
];

const colores = [
  'Rojo', 'Azul', 'Verde', 'Amarillo', 'Rosa', 'Morado', 'Negro', 'Blanco',
  'Gris', 'Beige', 'Coral', 'Turquesa', 'Lavanda', 'Menta', 'Durazno',
  'Borgoña', 'Marino', 'Esmeralda', 'Dorado', 'Plateado', 'Camel', 'Terracota',
  'Verde Oliva', 'Mostaza', 'Fucsia', 'Azul Cielo', 'Rosa Palo', 'Lila',
  'Crema', 'Chocolate'
];

const modelosPorTipo = {
  vestidos: [
    'Vestido Cóctel', 'Vestido Midi Floral', 'Vestido Maxi Boho', 'Vestido Corto Casual',
    'Vestido Ajustado Elegante', 'Vestido Cruzado', 'Vestido Camisero', 'Vestido Tirantes',
    'Vestido Palabra de Honor', 'Vestido Espalda Descubierta', 'Vestido Asimétrico',
    'Vestido Plisado', 'Vestido con Volantes', 'Vestido Estampado Animal', 'Vestido Lentejuelas',
    'Vestido Cut-Out', 'Vestido Satinado', 'Vestido Denim', 'Vestido Tejido', 'Vestido Slip'
  ],
  blusas: [
    'Blusa Básica', 'Blusa con Volantes', 'Blusa Campesina', 'Blusa Seda', 'Blusa Casual',
    'Blusa Manga Larga', 'Blusa Sin Mangas', 'Blusa Cuello V', 'Blusa Cuello Redondo',
    'Blusa Estampada', 'Blusa Lisa', 'Blusa Transparente', 'Blusa Crop', 'Blusa Oversize',
    'Blusa Ajustada'
  ],
  camisas: [
    'Camisa Clásica', 'Camisa Denim', 'Camisa Lino', 'Camisa Oxford', 'Camisa Cuadros',
    'Camisa Rayas', 'Camisa Manga Corta', 'Camisa Manga Larga', 'Camisa Slim Fit',
    'Camisa Regular', 'Camisa Estampada', 'Camisa Lisa', 'Camisa Casual', 'Camisa Formal',
    'Camisa Oversize'
  ],
  pantalones: [
    'Pantalón Recto', 'Pantalón Skinny', 'Pantalón Mom', 'Pantalón Palazzo', 'Pantalón Cargo',
    'Pantalón Chino', 'Pantalón Jogger', 'Pantalón Wide Leg', 'Pantalón Boyfriend',
    'Pantalón Acampanado', 'Pantalón Culotte', 'Pantalón Tiro Alto', 'Pantalón Tiro Bajo',
    'Pantalón Casual', 'Pantalón Formal'
  ],
  faldas: [
    'Falda Midi', 'Falda Mini', 'Falda Maxi', 'Falda Lápiz', 'Falda Plisada',
    'Falda Acampanada', 'Falda Recta', 'Falda Asimétrica', 'Falda Tul', 'Falda Denim',
    'Falda Circular', 'Falda con Volantes', 'Falda Pareo', 'Falda Tubo', 'Falda Evasé'
  ]
};

interface ProductosProps {
  onAddToCart?: (producto: any) => void;
  isCliente?: boolean;
  currentUserEmail?: string;
}

export default function Productos({ onAddToCart, isCliente = false, currentUserEmail }: ProductosProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [productType, setProductType] = useState<ProductType>('telas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [showNuevoProducto, setShowNuevoProducto] = useState(false);
  const [showImportarExcel, setShowImportarExcel] = useState(false);
  const [showDetalleResenas, setShowDetalleResenas] = useState(false);
  const [productoParaResenas, setProductoParaResenas] = useState<Producto | null>(null);

  // Obtener email del usuario actual si está disponible
  const getUserEmail = () => {
    if (currentUserEmail) return currentUserEmail;

    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.email || '';
      } catch {
        return '';
      }
    }
    return '';
  };

  // Estados del formulario de nuevo producto
  const [nuevoTipoProducto, setNuevoTipoProducto] = useState<ProductType>('telas');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState(0);
  const [nuevoColor, setNuevoColor] = useState('');
  const [nuevoTipoTela, setNuevoTipoTela] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState(0);
  const [nuevoModelo, setNuevoModelo] = useState('');
  const [nuevosColoresDisponibles, setNuevosColoresDisponibles] = useState<string[]>([]);
  const [nuevasTallasDisponibles, setNuevasTallasDisponibles] = useState<string[]>([]);
  const [nuevaImagenURL, setNuevaImagenURL] = useState('');

  // Filtros
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedTipoTela, setSelectedTipoTela] = useState<string>('');
  const [selectedModelo, setSelectedModelo] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  // Generar productos
  const [productos, setProductos] = useState<Producto[]>(() => {
    const productosList: Producto[] = [];
    let id = 1;

    const imagenesReales = [
      'https://images.unsplash.com/photo-1771098206944-ac1633b8276d?w=400',
      'https://images.unsplash.com/photo-1771128264920-a06ef7462da7?w=400',
      'https://images.unsplash.com/photo-1600024512646-5ef7b23d3bfa?w=400',
      'https://images.unsplash.com/photo-1771098403201-8d0d32e2a062?w=400'
    ];

    const imagenesVestidos = [
      'https://images.unsplash.com/photo-1637690048998-1e41c61c254d?w=400',
      'https://images.unsplash.com/photo-1765229276796-c93c73cc3f3b?w=400',
      'https://images.unsplash.com/photo-1768460608433-d3af5148832c?w=400',
      'https://images.unsplash.com/photo-1756483510840-b0dda5f0dd0f?w=400',
      'https://images.unsplash.com/photo-1765229278873-edd7918dd31d?w=400'
    ];

    const imagenesBlusas = [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
      'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400',
      'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400'
    ];

    const imagenesCamisas = [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400'
    ];

    const imagenesPantalones = [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
    ];

    const imagenesFaldas = [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'
    ];

    // Telas (90 items)
    tiposDeTela.forEach((tipo, idx) => {
      const numVariaciones = 3;
      for (let i = 0; i < numVariaciones; i++) {
        const color = colores[Math.floor(Math.random() * colores.length)];
        productosList.push({
          id: id++,
          nombre: `${tipo} ${color}`,
          tipo: 'telas',
          tipoTela: tipo,
          precio: Math.floor(Math.random() * 50 + 15),
          color,
          cantidadDisponible: Math.floor(Math.random() * 500 + 50),
          imagen: imagenesReales[idx % imagenesReales.length],
          isFavorite: false,
          calificacion: Math.floor(Math.random() * 2 + 3.5 * 10) / 10,
          numReviews: Math.floor(Math.random() * 150 + 10)
        });
      }
    });

    // Vestidos (20 items)
    modelosPorTipo.vestidos.forEach((modelo, idx) => {
      productosList.push({
        id: id++,
        nombre: modelo,
        tipo: 'vestidos',
        modelo,
        tipoTela: tiposDeTela[Math.floor(Math.random() * tiposDeTela.length)],
        precio: Math.floor(Math.random() * 150 + 80),
        color: colores[Math.floor(Math.random() * colores.length)],
        coloresDisponibles: [
          colores[Math.floor(Math.random() * colores.length)],
          colores[Math.floor(Math.random() * colores.length)],
          colores[Math.floor(Math.random() * colores.length)]
        ],
        tallasDisponibles: ['XS', 'S', 'M', 'L', 'XL'],
        imagen: imagenesVestidos[idx % imagenesVestidos.length],
        isFavorite: false,
        calificacion: Math.floor(Math.random() * 2 + 3.5 * 10) / 10,
        numReviews: Math.floor(Math.random() * 150 + 10)
      });
    });

    // Blusas (15 items)
    modelosPorTipo.blusas.forEach((modelo, idx) => {
      productosList.push({
        id: id++,
        nombre: modelo,
        tipo: 'blusas',
        modelo,
        tipoTela: tiposDeTela[Math.floor(Math.random() * tiposDeTela.length)],
        precio: Math.floor(Math.random() * 80 + 30),
        color: colores[Math.floor(Math.random() * colores.length)],
        coloresDisponibles: [
          colores[Math.floor(Math.random() * colores.length)],
          colores[Math.floor(Math.random() * colores.length)]
        ],
        tallasDisponibles: ['XS', 'S', 'M', 'L', 'XL'],
        imagen: imagenesBlusas[idx % imagenesBlusas.length],
        isFavorite: false,
        calificacion: Math.floor(Math.random() * 2 + 3.5 * 10) / 10,
        numReviews: Math.floor(Math.random() * 150 + 10)
      });
    });

    // Camisas (15 items)
    modelosPorTipo.camisas.forEach((modelo, idx) => {
      productosList.push({
        id: id++,
        nombre: modelo,
        tipo: 'camisas',
        modelo,
        tipoTela: tiposDeTela[Math.floor(Math.random() * tiposDeTela.length)],
        precio: Math.floor(Math.random() * 90 + 40),
        color: colores[Math.floor(Math.random() * colores.length)],
        coloresDisponibles: [
          colores[Math.floor(Math.random() * colores.length)],
          colores[Math.floor(Math.random() * colores.length)]
        ],
        tallasDisponibles: ['S', 'M', 'L', 'XL', 'XXL'],
        imagen: imagenesCamisas[idx % imagenesCamisas.length],
        isFavorite: false,
        calificacion: Math.floor(Math.random() * 2 + 3.5 * 10) / 10,
        numReviews: Math.floor(Math.random() * 150 + 10)
      });
    });

    // Pantalones (15 items)
    modelosPorTipo.pantalones.forEach((modelo, idx) => {
      productosList.push({
        id: id++,
        nombre: modelo,
        tipo: 'pantalones',
        modelo,
        tipoTela: tiposDeTela[Math.floor(Math.random() * tiposDeTela.length)],
        precio: Math.floor(Math.random() * 100 + 50),
        color: colores[Math.floor(Math.random() * colores.length)],
        coloresDisponibles: [
          colores[Math.floor(Math.random() * colores.length)],
          colores[Math.floor(Math.random() * colores.length)]
        ],
        tallasDisponibles: ['28', '30', '32', '34', '36', '38'],
        imagen: imagenesPantalones[idx % imagenesPantalones.length],
        isFavorite: false,
        calificacion: Math.floor(Math.random() * 2 + 3.5 * 10) / 10,
        numReviews: Math.floor(Math.random() * 150 + 10)
      });
    });

    // Faldas (15 items)
    modelosPorTipo.faldas.forEach((modelo, idx) => {
      productosList.push({
        id: id++,
        nombre: modelo,
        tipo: 'faldas',
        modelo,
        tipoTela: tiposDeTela[Math.floor(Math.random() * tiposDeTela.length)],
        precio: Math.floor(Math.random() * 70 + 35),
        color: colores[Math.floor(Math.random() * colores.length)],
        coloresDisponibles: [
          colores[Math.floor(Math.random() * colores.length)],
          colores[Math.floor(Math.random() * colores.length)]
        ],
        tallasDisponibles: ['XS', 'S', 'M', 'L', 'XL'],
        imagen: imagenesFaldas[idx % imagenesFaldas.length],
        isFavorite: false,
        calificacion: Math.floor(Math.random() * 2 + 3.5 * 10) / 10,
        numReviews: Math.floor(Math.random() * 150 + 10)
      });
    });

    return productosList;
  });

  function getColorHex(colorName: string): string {
    const colorMap: Record<string, string> = {
      'Rojo': 'ef4444', 'Azul': '3b82f6', 'Verde': '10b981', 'Amarillo': 'fbbf24',
      'Rosa': 'f472b6', 'Morado': 'a855f7', 'Negro': '000000', 'Blanco': 'ffffff',
      'Gris': '6b7280', 'Beige': 'd4a574', 'Coral': 'ff7f50', 'Turquesa': '40e0d0',
      'Lavanda': 'e6e6fa', 'Menta': '98fb98', 'Durazno': 'ffdab9', 'Borgoña': '800020',
      'Marino': '000080', 'Esmeralda': '50c878', 'Dorado': 'ffd700', 'Plateado': 'c0c0c0',
      'Camel': 'c19a6b', 'Terracota': 'e2725b', 'Verde Oliva': '808000', 'Mostaza': 'ffdb58',
      'Fucsia': 'ff00ff', 'Azul Cielo': '87ceeb', 'Rosa Palo': 'ffc0cb', 'Lila': 'c8a2c8',
      'Crema': 'fffdd0', 'Chocolate': 'd2691e'
    };
    return colorMap[colorName] || 'd4768f';
  }

  const toggleFavorite = (id: number) => {
    setProductos(prev => prev.map(producto =>
      producto.id === id ? { ...producto, isFavorite: !producto.isFavorite } : producto
    ));
  };

  const crearNuevoProducto = () => {
    if (!nuevoNombre || nuevoPrecio <= 0 || !nuevoColor) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (nuevoTipoProducto === 'telas' && !nuevoTipoTela) {
      alert('Por favor selecciona el tipo de tela');
      return;
    }

    if (nuevoTipoProducto !== 'telas' && !nuevoModelo) {
      alert('Por favor ingresa el modelo');
      return;
    }

    const nuevoId = Math.max(...productos.map(p => p.id), 0) + 1;

    const nuevoProducto: Producto = {
      id: nuevoId,
      nombre: nuevoNombre,
      tipo: nuevoTipoProducto,
      precio: nuevoPrecio,
      color: nuevoColor,
      imagen: nuevaImagenURL || 'https://images.unsplash.com/photo-1558769132-cb1aea1c4c9a?w=400',
      isFavorite: false,
      calificacion: 4.5,
      numReviews: 0,
      ...(nuevoTipoProducto === 'telas'
        ? {
            tipoTela: nuevoTipoTela,
            cantidadDisponible: nuevaCantidad
          }
        : {
            modelo: nuevoModelo,
            tipoTela: nuevoTipoTela || tiposDeTela[0],
            coloresDisponibles: nuevosColoresDisponibles.length > 0 ? nuevosColoresDisponibles : [nuevoColor],
            tallasDisponibles: nuevasTallasDisponibles.length > 0 ? nuevasTallasDisponibles : ['S', 'M', 'L']
          }
      )
    };

    setProductos([nuevoProducto, ...productos]);
    alert('Producto creado exitosamente');

    // Reset form
    setNuevoNombre('');
    setNuevoPrecio(0);
    setNuevoColor('');
    setNuevoTipoTela('');
    setNuevaCantidad(0);
    setNuevoModelo('');
    setNuevosColoresDisponibles([]);
    setNuevasTallasDisponibles([]);
    setNuevaImagenURL('');
    setShowNuevoProducto(false);
  };

  const handleImportarProductos = (productosImportados: any[]) => {
    // Convertir IDs a números y agregar a la lista existente
    const productosConvertidos = productosImportados.map(p => ({
      ...p,
      id: typeof p.id === 'string' ? parseInt(p.id) : p.id
    }));

    setProductos([...productosConvertidos, ...productos]);
    alert(`Se importaron ${productosImportados.length} productos exitosamente`);
  };

  const clearFilters = () => {
    setSelectedColor('');
    setSelectedTipoTela('');
    setSelectedModelo('');
    setMinPrice(0);
    setMaxPrice(1000);
  };

  const filteredProductos = productos.filter(producto => {
    // Filtro por tipo de producto
    if (producto.tipo !== productType) return false;

    // Filtro por búsqueda
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.tipoTela?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Filtro por color
    if (selectedColor) {
      const matchesColor = producto.color === selectedColor ||
                          producto.coloresDisponibles?.includes(selectedColor);
      if (!matchesColor) return false;
    }

    // Filtro por tipo de tela
    if (selectedTipoTela && producto.tipoTela !== selectedTipoTela) return false;

    // Filtro por modelo
    if (selectedModelo && producto.modelo !== selectedModelo) return false;

    // Filtro por precio
    if (producto.precio < minPrice || producto.precio > maxPrice) return false;

    return true;
  });

  const modelosDisponibles = productType !== 'telas' ? modelosPorTipo[productType] : [];
  const activeFiltersCount = [selectedColor, selectedTipoTela, selectedModelo].filter(Boolean).length +
                            (minPrice > 0 || maxPrice < 1000 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground mb-2">Catálogo de Productos</h2>
            <p className="text-muted-foreground">
              {filteredProductos.length} productos disponibles
            </p>
          </div>
          <div className="flex gap-2">
            {!isCliente && (
              <>
                <button
                  onClick={() => setShowNuevoProducto(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus size={20} />
                  Nuevo Producto
                </button>
                <button
                  onClick={() => setShowImportarExcel(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  title="Importar desde Excel"
                >
                  <FileSpreadsheet size={20} />
                  Importar Excel
                </button>
              </>
            )}
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: 'telas', label: 'Telas' },
              { key: 'vestidos', label: 'Vestidos' },
              { key: 'blusas', label: 'Blusas' },
              { key: 'camisas', label: 'Camisas' },
              { key: 'pantalones', label: 'Pantalones' },
              { key: 'faldas', label: 'Faldas' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setProductType(tab.key as ProductType);
                  clearFilters();
                }}
                className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  productType === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs bg-secondary px-2 py-0.5 rounded-full">
                  {productos.filter(p => p.tipo === tab.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Toggle */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-secondary-foreground border-border hover:bg-accent'
            }`}
          >
            <SlidersHorizontal size={18} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground">Filtros</h3>
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Limpiar filtros
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por Color */}
              <div>
                <label className="block text-sm text-foreground mb-2">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todos los colores</option>
                  {colores.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Tipo de Tela */}
              {productType !== 'telas' && (
                <div>
                  <label className="block text-sm text-foreground mb-2">Tipo de Tela</label>
                  <select
                    value={selectedTipoTela}
                    onChange={(e) => setSelectedTipoTela(e.target.value)}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todas las telas</option>
                    {tiposDeTela.map(tela => (
                      <option key={tela} value={tela}>{tela}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filtro por Modelo */}
              {productType !== 'telas' && modelosDisponibles.length > 0 && (
                <div>
                  <label className="block text-sm text-foreground mb-2">Modelo</label>
                  <select
                    value={selectedModelo}
                    onChange={(e) => setSelectedModelo(e.target.value)}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todos los modelos</option>
                    {modelosDisponibles.map(modelo => (
                      <option key={modelo} value={modelo}>{modelo}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filtro por Precio */}
              <div>
                <label className="block text-sm text-foreground mb-2">Precio (${minPrice} - ${maxPrice})</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    placeholder="Mín"
                    className="w-1/2 px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    placeholder="Máx"
                    className="w-1/2 px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProductos.map(producto => (
            <div key={producto.id} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedProducto(producto)}>
              <div className="relative">
                <img src={producto.imagen} alt={producto.nombre} className="w-full h-64 object-cover" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(producto.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/90 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
                >
                  <Star
                    size={20}
                    className={producto.isFavorite ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-400'}
                  />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-foreground mb-1">{producto.nombre}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(producto.calificacion) ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {producto.calificacion.toFixed(1)} ({producto.numReviews})
                  </span>
                </div>
                {producto.tipo === 'telas' ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">{producto.color}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary text-lg">${producto.precio}/metro</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Disponible: {producto.cantidadDisponible}m
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">{producto.tipoTela}</p>
                    <p className="text-xl text-primary mb-3">${producto.precio}</p>
                    {producto.coloresDisponibles && (
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-2">Colores:</p>
                        <div className="flex gap-2">
                          {producto.coloresDisponibles.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full border-2 border-border"
                              style={{ backgroundColor: `#${getColorHex(color)}` }}
                              title={color}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
                    {producto.tallasDisponibles && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Tallas:</p>
                        <div className="flex gap-1 flex-wrap">
                          {producto.tallasDisponibles.slice(0, 4).map((talla, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
                            >
                              {talla}
                            </span>
                          ))}
                          {producto.tallasDisponibles.length > 4 && (
                            <span className="px-2 py-0.5 text-xs text-muted-foreground">
                              +{producto.tallasDisponibles.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Botón Ver Reseñas */}
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProductoParaResenas(producto);
                      setShowDetalleResenas(true);
                    }}
                    className="w-full bg-secondary hover:bg-accent text-foreground py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Star size={16} />
                    Ver Reseñas y Calificar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-3 text-foreground">Producto</th>
                <th className="text-left px-6 py-3 text-foreground">Tipo/Modelo</th>
                {productType !== 'telas' && <th className="text-left px-6 py-3 text-foreground">Tela</th>}
                <th className="text-left px-6 py-3 text-foreground">Color</th>
                <th className="text-left px-6 py-3 text-foreground">Precio</th>
                {productType === 'telas' && <th className="text-left px-6 py-3 text-foreground">Disponible</th>}
                <th className="text-left px-6 py-3 text-foreground">Favorito</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map(producto => (
                <tr key={producto.id} className="border-t border-border hover:bg-secondary/50 cursor-pointer" onClick={() => setSelectedProducto(producto)}>
                  <td className="px-6 py-4 text-foreground">{producto.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {producto.tipo === 'telas' ? producto.tipoTela : producto.modelo}
                  </td>
                  {productType !== 'telas' && (
                    <td className="px-6 py-4 text-muted-foreground">{producto.tipoTela}</td>
                  )}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: `#${getColorHex(producto.color)}` }}
                      ></div>
                      {producto.color}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary">
                    ${producto.precio}{productType === 'telas' ? '/metro' : ''}
                  </td>
                  {productType === 'telas' && (
                    <td className="px-6 py-4 text-foreground">{producto.cantidadDisponible}m</td>
                  )}
                  <td className="px-6 py-4">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(producto.id);
                    }}>
                      <Star
                        size={20}
                        className={producto.isFavorite ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-400'}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Results */}
      {filteredProductos.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Filter size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-foreground mb-2">No se encontraron productos</h3>
          <p className="text-muted-foreground mb-4">
            Intenta ajustar los filtros o buscar con otros términos
          </p>
          <button
            onClick={clearFilters}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProducto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProducto(null)}>
          <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">Detalle del Producto</h3>
              <button
                onClick={() => setSelectedProducto(null)}
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="relative">
                  <img
                    src={selectedProducto.imagen}
                    alt={selectedProducto.nombre}
                    className="w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(selectedProducto.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/90 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
                  >
                    <Star
                      size={24}
                      className={selectedProducto.isFavorite ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-400'}
                    />
                  </button>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-foreground mb-2">{selectedProducto.nombre}</h2>
                    {selectedProducto.calificacion !== undefined && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={i < Math.floor(selectedProducto.calificacion || 0) ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {(selectedProducto.calificacion || 0).toFixed(1)} ({selectedProducto.numReviews || 0} reseñas)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-3xl text-primary mb-4">
                      ${selectedProducto.precio}
                      {selectedProducto.tipo === 'telas' && '/metro'}
                    </p>
                  </div>

                  {selectedProducto.tipo === 'telas' ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tipo de Tela</p>
                        <p className="text-foreground">{selectedProducto.tipoTela}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Color</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-border"
                            style={{ backgroundColor: `#${getColorHex(selectedProducto.color)}` }}
                          ></div>
                          <span className="text-foreground">{selectedProducto.color}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Cantidad Disponible</p>
                        <p className="text-foreground">{selectedProducto.cantidadDisponible} metros</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tipo de Tela</p>
                        <p className="text-foreground">{selectedProducto.tipoTela}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Modelo</p>
                        <p className="text-foreground">{selectedProducto.modelo}</p>
                      </div>
                      {selectedProducto.coloresDisponibles && selectedProducto.coloresDisponibles.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Colores Disponibles</p>
                          <div className="flex gap-2 flex-wrap">
                            {selectedProducto.coloresDisponibles.map((color, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                                <div
                                  className="w-5 h-5 rounded-full border-2 border-border"
                                  style={{ backgroundColor: `#${getColorHex(color)}` }}
                                ></div>
                                <span className="text-sm text-foreground">{color}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedProducto.tallasDisponibles && selectedProducto.tallasDisponibles.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Tallas Disponibles</p>
                          <div className="flex gap-2 flex-wrap">
                            {selectedProducto.tallasDisponibles.map((talla, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm"
                              >
                                {talla}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-border pt-4 mt-4">
                    <button
                      onClick={() => {
                        if (onAddToCart) {
                          onAddToCart(selectedProducto);
                          setSelectedProducto(null);
                        }
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nuevo Producto Modal */}
      {showNuevoProducto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNuevoProducto(false)}>
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">Registrar Nuevo Producto</h3>
              <button
                onClick={() => setShowNuevoProducto(false)}
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Tipo de Producto */}
              <div>
                <label className="block text-sm text-foreground mb-2">
                  Tipo de Producto <span className="text-destructive">*</span>
                </label>
                <select
                  value={nuevoTipoProducto}
                  onChange={(e) => setNuevoTipoProducto(e.target.value as ProductType)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="telas">Telas</option>
                  <option value="vestidos">Vestidos</option>
                  <option value="blusas">Blusas</option>
                  <option value="camisas">Camisas</option>
                  <option value="pantalones">Pantalones</option>
                  <option value="faldas">Faldas</option>
                </select>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm text-foreground mb-2">
                  Nombre <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Nombre del producto"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm text-foreground mb-2">
                  Precio {nuevoTipoProducto === 'telas' ? '(por metro)' : ''} <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  value={nuevoPrecio}
                  onChange={(e) => setNuevoPrecio(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm text-foreground mb-2">
                  Color <span className="text-destructive">*</span>
                </label>
                <select
                  value={nuevoColor}
                  onChange={(e) => setNuevoColor(e.target.value)}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar color</option>
                  {colores.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {nuevoTipoProducto === 'telas' ? (
                <>
                  {/* Tipo de Tela */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Tipo de Tela <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={nuevoTipoTela}
                      onChange={(e) => setNuevoTipoTela(e.target.value)}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Seleccionar tipo de tela</option>
                      {tiposDeTela.map(tela => (
                        <option key={tela} value={tela}>{tela}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cantidad Disponible */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Cantidad Disponible (metros)
                    </label>
                    <input
                      type="number"
                      value={nuevaCantidad}
                      onChange={(e) => setNuevaCantidad(Number(e.target.value))}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Modelo */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Modelo <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={nuevoModelo}
                      onChange={(e) => setNuevoModelo(e.target.value)}
                      placeholder="Modelo del producto"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Tipo de Tela (opcional para prendas) */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Tipo de Tela
                    </label>
                    <select
                      value={nuevoTipoTela}
                      onChange={(e) => setNuevoTipoTela(e.target.value)}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Seleccionar tipo de tela</option>
                      {tiposDeTela.map(tela => (
                        <option key={tela} value={tela}>{tela}</option>
                      ))}
                    </select>
                  </div>

                  {/* Colores Disponibles */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Colores Disponibles (separados por coma)
                    </label>
                    <input
                      type="text"
                      value={nuevosColoresDisponibles.join(', ')}
                      onChange={(e) => setNuevosColoresDisponibles(e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
                      placeholder="Rojo, Azul, Verde"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Tallas Disponibles */}
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Tallas Disponibles (separadas por coma)
                    </label>
                    <input
                      type="text"
                      value={nuevasTallasDisponibles.join(', ')}
                      onChange={(e) => setNuevasTallasDisponibles(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      placeholder="XS, S, M, L, XL"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}

              {/* URL de Imagen */}
              <div>
                <label className="block text-sm text-foreground mb-2">
                  URL de Imagen (opcional)
                </label>
                <input
                  type="text"
                  value={nuevaImagenURL}
                  onChange={(e) => setNuevaImagenURL(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setShowNuevoProducto(false)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearNuevoProducto}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Crear Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Importar Excel */}
      {showImportarExcel && (
        <ImportarExcel
          onClose={() => setShowImportarExcel(false)}
          onImport={handleImportarProductos}
        />
      )}

      {/* Modal Detalle y Reseñas */}
      {showDetalleResenas && productoParaResenas && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-xl">{productoParaResenas.nombre}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(productoParaResenas.calificacion) ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {productoParaResenas.calificacion.toFixed(1)} ({productoParaResenas.numReviews} reseñas)
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetalleResenas(false);
                  setProductoParaResenas(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Información del Producto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-border">
                <div>
                  <img
                    src={productoParaResenas.imagen}
                    alt={productoParaResenas.nombre}
                    className="w-full h-80 object-cover rounded-lg border border-border"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Precio</p>
                    <p className="text-3xl text-primary">
                      ${productoParaResenas.precio}
                      {productoParaResenas.tipo === 'telas' && '/metro'}
                    </p>
                  </div>
                  {productoParaResenas.tipo === 'telas' ? (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Color</p>
                        <p className="text-foreground">{productoParaResenas.color}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Disponible</p>
                        <p className="text-foreground">{productoParaResenas.cantidadDisponible} metros</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tipo de Tela</p>
                        <p className="text-foreground">{productoParaResenas.tipoTela}</p>
                      </div>
                      {productoParaResenas.coloresDisponibles && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Colores Disponibles</p>
                          <div className="flex gap-2 flex-wrap">
                            {productoParaResenas.coloresDisponibles.map((color, idx) => (
                              <span key={idx} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm">
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {productoParaResenas.tallasDisponibles && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Tallas Disponibles</p>
                          <div className="flex gap-2 flex-wrap">
                            {productoParaResenas.tallasDisponibles.map((talla, idx) => (
                              <span key={idx} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm">
                                {talla}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {onAddToCart && (
                    <button
                      onClick={() => {
                        onAddToCart(productoParaResenas);
                        setShowDetalleResenas(false);
                        setProductoParaResenas(null);
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingCart size={20} />
                      Agregar al Carrito
                    </button>
                  )}
                </div>
              </div>

              {/* Componente de Reseñas */}
              <div>
                <h4 className="text-foreground text-lg mb-4">Reseñas y Calificaciones</h4>
                <Resenas
                  productoId={productoParaResenas.id}
                  productoNombre={productoParaResenas.nombre}
                  currentUserEmail={getUserEmail()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
