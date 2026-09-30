import { useState } from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Search, Filter, Download } from 'lucide-react';

interface ProductoInventario {
  id: string;
  nombre: string;
  sku: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  stockMaximo: number;
  unidadMedida: string;
  ubicacion: string;
  ultimoMovimiento: string;
}

interface Movimiento {
  id: string;
  fecha: string;
  tipo: 'entrada' | 'salida';
  producto: string;
  cantidad: number;
  responsable: string;
  motivo: string;
}

export default function Inventario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'bajo' | 'normal' | 'alto'>('todos');

  const [productos] = useState<ProductoInventario[]>([
    { id: '1', nombre: 'Tela Algodón Premium', sku: 'TEL-001', categoria: 'Telas', stock: 450, stockMinimo: 200, stockMaximo: 1000, unidadMedida: 'metros', ubicacion: 'Bodega A-01', ultimoMovimiento: '2026-04-22' },
    { id: '2', nombre: 'Vestido Floral Verano', sku: 'VES-001', categoria: 'Vestidos', stock: 85, stockMinimo: 50, stockMaximo: 200, unidadMedida: 'unidades', ubicacion: 'Exhibición B-12', ultimoMovimiento: '2026-04-23' },
    { id: '3', nombre: 'Blusa Elegante Seda', sku: 'BLU-001', categoria: 'Blusas', stock: 120, stockMinimo: 80, stockMaximo: 250, unidadMedida: 'unidades', ubicacion: 'Exhibición B-08', ultimoMovimiento: '2026-04-22' },
    { id: '4', nombre: 'Hilo Poliéster', sku: 'INS-001', categoria: 'Insumos', stock: 35, stockMinimo: 100, stockMaximo: 500, unidadMedida: 'rollos', ubicacion: 'Bodega A-15', ultimoMovimiento: '2026-04-20' },
    { id: '5', nombre: 'Pantalón Casual Denim', sku: 'PAN-001', categoria: 'Pantalones', stock: 180, stockMinimo: 60, stockMaximo: 300, unidadMedida: 'unidades', ubicacion: 'Exhibición C-05', ultimoMovimiento: '2026-04-23' },
    { id: '6', nombre: 'Botones Nácar', sku: 'INS-002', categoria: 'Insumos', stock: 890, stockMinimo: 500, stockMaximo: 2000, unidadMedida: 'unidades', ubicacion: 'Bodega A-18', ultimoMovimiento: '2026-04-21' }
  ]);

  const [movimientos] = useState<Movimiento[]>([
    { id: '1', fecha: '2026-04-23 14:30', tipo: 'salida', producto: 'Vestido Floral Verano', cantidad: 15, responsable: 'Ana M.', motivo: 'Venta mostrador' },
    { id: '2', fecha: '2026-04-23 10:15', tipo: 'salida', producto: 'Pantalón Casual Denim', cantidad: 8, responsable: 'Carlos R.', motivo: 'Venta en línea' },
    { id: '3', fecha: '2026-04-22 16:45', tipo: 'entrada', producto: 'Tela Algodón Premium', cantidad: 200, responsable: 'Sistema', motivo: 'Orden de compra OC-001' },
    { id: '4', fecha: '2026-04-22 11:20', tipo: 'salida', producto: 'Blusa Elegante Seda', cantidad: 12, responsable: 'Ana M.', motivo: 'Venta mayorista' },
    { id: '5', fecha: '2026-04-21 09:00', tipo: 'entrada', producto: 'Botones Nácar', cantidad: 500, responsable: 'Luis T.', motivo: 'Reposición stock' }
  ]);

  const getEstadoStock = (producto: ProductoInventario) => {
    const porcentaje = (producto.stock / producto.stockMaximo) * 100;
    if (producto.stock <= producto.stockMinimo) return 'bajo';
    if (porcentaje > 70) return 'alto';
    return 'normal';
  };

  const productosFiltrados = productos.filter(producto => {
    const matchSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       producto.sku.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (filtroEstado === 'todos') return true;
    return getEstadoStock(producto) === filtroEstado;
  });

  const stockBajo = productos.filter(p => getEstadoStock(p) === 'bajo').length;
  const valorTotal = productos.reduce((acc, p) => acc + (p.stock * 15000), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Gestión de Inventario</h2>
          <p className="text-sm text-muted-foreground">Control y seguimiento de stock en tiempo real</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Download size={20} />
          Exportar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Productos</p>
            <Package size={20} className="text-primary" />
          </div>
          <p className="text-2xl text-foreground">{productos.length}</p>
          <p className="text-xs text-muted-foreground mt-1">En inventario</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Stock Bajo</p>
            <AlertTriangle size={20} className="text-amber-500" />
          </div>
          <p className="text-2xl text-foreground">{stockBajo}</p>
          <p className="text-xs text-muted-foreground mt-1">Requieren reposición</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Movimientos Hoy</p>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <p className="text-2xl text-foreground">{movimientos.filter(m => m.fecha.includes('2026-04-23')).length}</p>
          <p className="text-xs text-muted-foreground mt-1">Entradas y salidas</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Valor Total</p>
            <TrendingUp size={20} className="text-primary" />
          </div>
          <p className="text-2xl text-foreground">${(valorTotal / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-muted-foreground mt-1">Estimado</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFiltroEstado('todos')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filtroEstado === 'todos'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border text-muted-foreground hover:bg-secondary'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroEstado('bajo')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filtroEstado === 'bajo'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-card border-border text-muted-foreground hover:bg-secondary'
            }`}
          >
            Stock Bajo
          </button>
          <button
            onClick={() => setFiltroEstado('normal')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filtroEstado === 'normal'
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-card border-border text-muted-foreground hover:bg-secondary'
            }`}
          >
            Normal
          </button>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-4 text-sm text-muted-foreground">SKU</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Producto</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Categoría</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Stock</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Rango</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Ubicación</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Último Mov.</th>
              <th className="text-left p-4 text-sm text-muted-foreground">Estado</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => {
              const estado = getEstadoStock(producto);
              const estadoColor = estado === 'bajo' ? 'text-amber-500' : estado === 'alto' ? 'text-green-500' : 'text-blue-500';
              const estadoIcon = estado === 'bajo' ? <TrendingDown size={16} /> : estado === 'alto' ? <TrendingUp size={16} /> : <TrendingUp size={16} />;

              return (
                <tr key={producto.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="p-4 text-sm text-foreground font-mono">{producto.sku}</td>
                  <td className="p-4 text-sm text-foreground">{producto.nombre}</td>
                  <td className="p-4 text-sm text-muted-foreground">{producto.categoria}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground font-medium">{producto.stock}</span>
                      <span className="text-xs text-muted-foreground">{producto.unidadMedida}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {producto.stockMinimo} - {producto.stockMaximo}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{producto.ubicacion}</td>
                  <td className="p-4 text-sm text-muted-foreground">{producto.ultimoMovimiento}</td>
                  <td className="p-4">
                    <div className={`flex items-center gap-1 ${estadoColor}`}>
                      {estadoIcon}
                      <span className="text-xs capitalize">{estado}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Movimientos Recientes */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-foreground mb-4">Movimientos Recientes</h3>
        <div className="space-y-3">
          {movimientos.slice(0, 5).map((mov) => (
            <div key={mov.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${mov.tipo === 'entrada' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm text-foreground">{mov.producto}</p>
                  <p className="text-xs text-muted-foreground">{mov.motivo} • {mov.responsable}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${mov.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                  {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                </p>
                <p className="text-xs text-muted-foreground">{mov.fecha}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
