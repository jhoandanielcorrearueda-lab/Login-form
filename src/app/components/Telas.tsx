import { useState } from 'react';
import { Scissors, Plus, Edit, Trash2, Search, Filter, Package } from 'lucide-react';

interface Tela {
  id: number;
  tipo: string;
  color: string;
  cantidad: number; // en metros
  precio: number; // por metro
  proveedor: string;
  ubicacion: string;
  estado: 'disponible' | 'bajo' | 'agotado';
}

interface Retazo {
  id: number;
  origen: string;
  dimensiones: string; // ej: "2m x 1.5m"
  color: string;
  descripcion: string;
  disponible: boolean;
}

export default function Telas() {
  const [vistaActiva, setVistaActiva] = useState<'telas' | 'retazos'>('telas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNuevaTela, setShowNuevaTela] = useState(false);
  const [showNuevoRetazo, setShowNuevoRetazo] = useState(false);

  const [telas, setTelas] = useState<Tela[]>([
    { id: 1, tipo: 'Algodón', color: 'Rojo', cantidad: 150, precio: 25, proveedor: 'TextilCorp', ubicacion: 'Bodega A-1', estado: 'disponible' },
    { id: 2, tipo: 'Seda', color: 'Azul', cantidad: 45, precio: 45, proveedor: 'Sedas Premium', ubicacion: 'Bodega A-2', estado: 'disponible' },
    { id: 3, tipo: 'Lino', color: 'Beige', cantidad: 8, precio: 35, proveedor: 'TextilCorp', ubicacion: 'Bodega B-1', estado: 'bajo' },
    { id: 4, tipo: 'Satén', color: 'Negro', cantidad: 120, precio: 40, proveedor: 'Telas Finas', ubicacion: 'Bodega A-3', estado: 'disponible' },
    { id: 5, tipo: 'Terciopelo', color: 'Verde', cantidad: 3, precio: 55, proveedor: 'Sedas Premium', ubicacion: 'Bodega C-1', estado: 'agotado' }
  ]);

  const [retazos, setRetazos] = useState<Retazo[]>([
    { id: 1, origen: 'Proyecto Vestido Verano', dimensiones: '2m x 1.5m', color: 'Floral Rosa', descripcion: 'Algodón estampado', disponible: true },
    { id: 2, origen: 'Sobras Camisa Ejecutiva', dimensiones: '1m x 0.8m', color: 'Azul Oxford', descripcion: 'Algodón 100%', disponible: true },
    { id: 3, origen: 'Proyecto Falda', dimensiones: '1.5m x 1m', color: 'Negro', descripcion: 'Satén premium', disponible: false },
    { id: 4, origen: 'Vestido de Noche', dimensiones: '0.5m x 0.5m', color: 'Rojo', descripcion: 'Seda natural', disponible: true }
  ]);

  const filteredTelas = telas.filter(tela =>
    tela.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tela.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tela.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRetazos = retazos.filter(retazo =>
    retazo.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retazo.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retazo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const estadisticas = {
    totalTelas: telas.length,
    metrosDisponibles: telas.reduce((sum, t) => sum + t.cantidad, 0),
    valorInventario: telas.reduce((sum, t) => sum + (t.cantidad * t.precio), 0),
    retazosDisponibles: retazos.filter(r => r.disponible).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Gestión de Telas y Retazos</h2>
          <p className="text-muted-foreground">Control de inventario textil y reutilización sostenible</p>
        </div>
        <button
          onClick={() => vistaActiva === 'telas' ? setShowNuevaTela(true) : setShowNuevoRetazo(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus size={20} />
          {vistaActiva === 'telas' ? 'Nueva Tela' : 'Nuevo Retazo'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-2">
          <button
            onClick={() => setVistaActiva('telas')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              vistaActiva === 'telas'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={18} />
              Telas
            </div>
          </button>
          <button
            onClick={() => setVistaActiva('retazos')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              vistaActiva === 'retazos'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Scissors size={18} />
              Retazos
            </div>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#24545A]/50 dark:to-[#24545A]/30 rounded-lg p-6 border border-blue-200 dark:border-[#5E8587]/40">
          <div className="flex items-center gap-3">
            <Package className="text-blue-600 dark:text-[#5E8587]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{estadisticas.totalTelas}</p>
              <p className="text-sm text-muted-foreground">Tipos de Telas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-[#24545A]/70 dark:to-[#24545A]/50 rounded-lg p-6 border border-green-200 dark:border-[#5E8587]/60">
          <div className="flex items-center gap-3">
            <Scissors className="text-green-600 dark:text-[#5E8587]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{estadisticas.metrosDisponibles}m</p>
              <p className="text-sm text-muted-foreground">Metros Disponibles</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-[#A98255]/25 dark:to-[#A98255]/10 rounded-lg p-6 border border-purple-200 dark:border-[#A98255]/40">
          <div className="flex items-center gap-3">
            <Package className="text-purple-600 dark:text-[#D8C2A8]" size={32} />
            <div>
              <p className="text-2xl text-foreground">${estadisticas.valorInventario.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Valor Inventario</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-[#B7654A]/25 dark:to-[#B7654A]/10 rounded-lg p-6 border border-amber-200 dark:border-[#B7654A]/40">
          <div className="flex items-center gap-3">
            <Scissors className="text-amber-600 dark:text-[#D08A70]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{estadisticas.retazosDisponibles}</p>
              <p className="text-sm text-muted-foreground">Retazos Disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder={`Buscar ${vistaActiva}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Contenido */}
      {vistaActiva === 'telas' ? (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-3 text-foreground">Tipo</th>
                <th className="text-left px-6 py-3 text-foreground">Color</th>
                <th className="text-left px-6 py-3 text-foreground">Cantidad</th>
                <th className="text-left px-6 py-3 text-foreground">Precio/m</th>
                <th className="text-left px-6 py-3 text-foreground">Proveedor</th>
                <th className="text-left px-6 py-3 text-foreground">Ubicación</th>
                <th className="text-left px-6 py-3 text-foreground">Estado</th>
                <th className="text-left px-6 py-3 text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTelas.map((tela) => (
                <tr key={tela.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="px-6 py-4 text-foreground font-medium">{tela.tipo}</td>
                  <td className="px-6 py-4 text-muted-foreground">{tela.color}</td>
                  <td className="px-6 py-4 text-foreground">{tela.cantidad}m</td>
                  <td className="px-6 py-4 text-primary">${tela.precio}</td>
                  <td className="px-6 py-4 text-muted-foreground">{tela.proveedor}</td>
                  <td className="px-6 py-4 text-muted-foreground">{tela.ubicacion}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      tela.estado === 'disponible' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#5E8587]' :
                      tela.estado === 'bajo' ? 'bg-amber-100 dark:bg-[#B7654A]/30 text-amber-700 dark:text-[#D08A70]' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#D08A70]'
                    }`}>
                      {tela.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Editar">
                        <Edit size={18} className="text-foreground" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Eliminar">
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRetazos.map((retazo) => (
            <div key={retazo.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Scissors className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{retazo.origen}</h3>
                    <p className="text-sm text-muted-foreground">{retazo.dimensiones}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  retazo.disponible
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#5E8587]'
                    : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                }`}>
                  {retazo.disponible ? 'Disponible' : 'No disponible'}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Color:</span> {retazo.color}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Descripción:</span> {retazo.descripcion}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 text-sm">
                  Usar Retazo
                </button>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Trash2 size={18} className="text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nueva Tela */}
      {showNuevaTela && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">Registrar Nueva Tela</h3>
              <button
                onClick={() => setShowNuevaTela(false)}
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">Tipo de Tela *</label>
                  <input
                    type="text"
                    value={nuevaTelaTipo}
                    onChange={(e) => setNuevaTelaTipo(e.target.value)}
                    placeholder="Ej: Algodón, Seda, Lino"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Color *</label>
                  <input
                    type="text"
                    value={nuevaTelaColor}
                    onChange={(e) => setNuevaTelaColor(e.target.value)}
                    placeholder="Ej: Rojo, Azul, Negro"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Cantidad (metros) *</label>
                  <input
                    type="number"
                    value={nuevaTelaCantidad}
                    onChange={(e) => setNuevaTelaCantidad(Number(e.target.value))}
                    min="0"
                    step="0.5"
                    placeholder="Ej: 150"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Precio por Metro *</label>
                  <input
                    type="number"
                    value={nuevaTelaPrecio}
                    onChange={(e) => setNuevaTelaPrecio(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    placeholder="Ej: 25"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Proveedor *</label>
                  <input
                    type="text"
                    value={nuevaTelaProveedor}
                    onChange={(e) => setNuevaTelaProveedor(e.target.value)}
                    placeholder="Ej: TextilCorp"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Ubicación en Bodega *</label>
                  <input
                    type="text"
                    value={nuevaTelaUbicacion}
                    onChange={(e) => setNuevaTelaUbicacion(e.target.value)}
                    placeholder="Ej: Bodega A-1"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Estado:</span> Se calculará automáticamente según la cantidad disponible.
                </p>
              </div>

              <div className="flex gap-3 border-t border-border pt-4">
                <button
                  onClick={() => setShowNuevaTela(false)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarNuevaTela}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                >
                  Registrar Tela
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Retazo */}
      {showNuevoRetazo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">Registrar Nuevo Retazo</h3>
              <button
                onClick={() => setShowNuevoRetazo(false)}
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">Origen del Retazo *</label>
                  <input
                    type="text"
                    value={nuevoRetazoOrigen}
                    onChange={(e) => setNuevoRetazoOrigen(e.target.value)}
                    placeholder="Ej: Proyecto Vestido Verano"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Dimensiones *</label>
                  <input
                    type="text"
                    value={nuevoRetazoDimensiones}
                    onChange={(e) => setNuevoRetazoDimensiones(e.target.value)}
                    placeholder="Ej: 2m x 1.5m"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Color *</label>
                  <input
                    type="text"
                    value={nuevoRetazoColor}
                    onChange={(e) => setNuevoRetazoColor(e.target.value)}
                    placeholder="Ej: Floral Rosa"
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground mb-2">Descripción *</label>
                  <textarea
                    value={nuevoRetazoDescripcion}
                    onChange={(e) => setNuevoRetazoDescripcion(e.target.value)}
                    placeholder="Ej: Algodón estampado con patrón floral"
                    rows={3}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="bg-green-50 dark:bg-[#24545A]/50 dark:bg-green-900/20 border border-green-200 dark:border-[#5E8587]/60 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-[#D8C2A8]">
                  <span className="font-medium">♻️ Reutilización sostenible:</span> Los retazos registrados podrán ser utilizados en futuros proyectos, reduciendo desperdicios.
                </p>
              </div>

              <div className="flex gap-3 border-t border-border pt-4">
                <button
                  onClick={() => setShowNuevoRetazo(false)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarNuevoRetazo}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                >
                  Registrar Retazo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
