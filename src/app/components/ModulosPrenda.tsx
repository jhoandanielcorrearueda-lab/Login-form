import { useState } from 'react';
import { Shirt, Ruler, Package, Download, Plus, Edit, Eye, X } from 'lucide-react';

interface Patron {
  id: number;
  nombre: string;
  tipoPrenda: string;
  tallas: string[];
  descripcion: string;
  complejidad: 'fácil' | 'media' | 'alta';
}

interface Medida {
  id: number;
  cliente: string;
  tipoPrenda: string;
  medidas: {
    [key: string]: number;
  };
  fecha: string;
  notas: string;
}

export default function ModulosPrenda() {
  const [vistaActiva, setVistaActiva] = useState<'patrones' | 'medidas'>('patrones');
  const [showNuevoPatron, setShowNuevoPatron] = useState(false);

  const [patrones] = useState<Patron[]>([
    {
      id: 1,
      nombre: 'Vestido Básico',
      tipoPrenda: 'Vestido',
      tallas: ['S', 'M', 'L', 'XL'],
      descripcion: 'Patrón básico de vestido con manga corta',
      complejidad: 'fácil'
    },
    {
      id: 2,
      nombre: 'Camisa Formal',
      tipoPrenda: 'Camisa',
      tallas: ['S', 'M', 'L', 'XL', 'XXL'],
      descripcion: 'Patrón de camisa formal con cuello y puños',
      complejidad: 'media'
    },
    {
      id: 3,
      nombre: 'Pantalón Sastre',
      tipoPrenda: 'Pantalón',
      tallas: ['28', '30', '32', '34', '36', '38'],
      descripcion: 'Patrón de pantalón de corte sastre',
      complejidad: 'alta'
    },
    {
      id: 4,
      nombre: 'Blusa con Volantes',
      tipoPrenda: 'Blusa',
      tallas: ['XS', 'S', 'M', 'L'],
      descripcion: 'Patrón de blusa con volantes decorativos',
      complejidad: 'media'
    },
    {
      id: 5,
      nombre: 'Falda Plisada',
      tipoPrenda: 'Falda',
      tallas: ['XS', 'S', 'M', 'L', 'XL'],
      descripcion: 'Patrón de falda midi con pliegues',
      complejidad: 'fácil'
    }
  ]);

  const [medidas] = useState<Medida[]>([
    {
      id: 1,
      cliente: 'María García',
      tipoPrenda: 'Vestido',
      medidas: {
        'Contorno Pecho': 92,
        'Contorno Cintura': 72,
        'Contorno Cadera': 98,
        'Largo Total': 105,
        'Largo Manga': 58
      },
      fecha: '2026-04-20',
      notas: 'Cliente prefiere largo hasta la rodilla'
    },
    {
      id: 2,
      cliente: 'Carlos Rodríguez',
      tipoPrenda: 'Camisa',
      medidas: {
        'Contorno Pecho': 104,
        'Contorno Cintura': 88,
        'Largo Espalda': 78,
        'Largo Manga': 64,
        'Ancho Hombros': 46
      },
      fecha: '2026-04-22',
      notas: 'Prefiere ajuste regular'
    },
    {
      id: 3,
      cliente: 'Ana López',
      tipoPrenda: 'Pantalón',
      medidas: {
        'Contorno Cintura': 68,
        'Contorno Cadera': 94,
        'Largo Total': 102,
        'Tiro': 28,
        'Ancho Pierna': 24
      },
      fecha: '2026-04-23',
      notas: 'Talle alto'
    }
  ]);

  const estadisticas = {
    totalPatrones: patrones.length,
    medidasRegistradas: medidas.length,
    patronesPopulares: patrones.filter(p => p.complejidad === 'fácil').length,
    prendas: {
      vestidos: patrones.filter(p => p.tipoPrenda === 'Vestido').length,
      camisas: patrones.filter(p => p.tipoPrenda === 'Camisa').length,
      pantalones: patrones.filter(p => p.tipoPrenda === 'Pantalón').length
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Módulos de Prenda</h2>
          <p className="text-muted-foreground">Patrones y medidas para confección</p>
        </div>
        <button
          onClick={() => setShowNuevoPatron(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus size={20} />
          {vistaActiva === 'patrones' ? 'Nuevo Patrón' : 'Nueva Medida'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-2">
          <button
            onClick={() => setVistaActiva('patrones')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              vistaActiva === 'patrones'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={18} />
              Patrones
            </div>
          </button>
          <button
            onClick={() => setVistaActiva('medidas')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              vistaActiva === 'medidas'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Ruler size={18} />
              Medidas
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
              <p className="text-2xl text-foreground">{estadisticas.totalPatrones}</p>
              <p className="text-sm text-muted-foreground">Total Patrones</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-[#24545A]/70 dark:to-[#24545A]/50 rounded-lg p-6 border border-green-200 dark:border-[#5E8587]/60">
          <div className="flex items-center gap-3">
            <Ruler className="text-green-600 dark:text-[#5E8587]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{estadisticas.medidasRegistradas}</p>
              <p className="text-sm text-muted-foreground">Medidas Registradas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-[#A98255]/25 dark:to-[#A98255]/10 rounded-lg p-6 border border-purple-200 dark:border-[#A98255]/40">
          <div className="flex items-center gap-3">
            <Shirt className="text-purple-600 dark:text-[#D8C2A8]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{estadisticas.patronesPopulares}</p>
              <p className="text-sm text-muted-foreground">Nivel Fácil</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-[#B7654A]/25 dark:to-[#B7654A]/10 rounded-lg p-6 border border-amber-200 dark:border-[#B7654A]/40">
          <div className="flex items-center gap-3">
            <Shirt className="text-amber-600 dark:text-[#D08A70]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{estadisticas.prendas.vestidos + estadisticas.prendas.camisas}</p>
              <p className="text-sm text-muted-foreground">Prendas Superiores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {vistaActiva === 'patrones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patrones.map((patron) => (
            <div key={patron.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shirt className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{patron.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{patron.tipoPrenda}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  patron.complejidad === 'fácil' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#5E8587]' :
                  patron.complejidad === 'media' ? 'bg-amber-100 dark:bg-[#B7654A]/30 text-amber-700 dark:text-[#D08A70]' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#D08A70]'
                }`}>
                  {patron.complejidad}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{patron.descripcion}</p>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Tallas disponibles:</p>
                <div className="flex flex-wrap gap-1">
                  {patron.tallas.map((talla, idx) => (
                    <span key={idx} className="px-2 py-1 bg-secondary text-xs rounded">
                      {talla}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 text-sm flex items-center justify-center gap-2">
                  <Download size={16} />
                  Descargar
                </button>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Eye size={18} className="text-foreground" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Edit size={18} className="text-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {vistaActiva === 'medidas' && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-3 text-foreground">Cliente</th>
                <th className="text-left px-6 py-3 text-foreground">Tipo de Prenda</th>
                <th className="text-left px-6 py-3 text-foreground">Fecha</th>
                <th className="text-left px-6 py-3 text-foreground">Medidas</th>
                <th className="text-left px-6 py-3 text-foreground">Notas</th>
                <th className="text-left px-6 py-3 text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medidas.map((medida) => (
                <tr key={medida.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="px-6 py-4 text-foreground font-medium">{medida.cliente}</td>
                  <td className="px-6 py-4 text-muted-foreground">{medida.tipoPrenda}</td>
                  <td className="px-6 py-4 text-muted-foreground">{medida.fecha}</td>
                  <td className="px-6 py-4">
                    <details className="cursor-pointer">
                      <summary className="text-primary hover:underline text-sm">
                        Ver {Object.keys(medida.medidas).length} medidas
                      </summary>
                      <div className="mt-2 space-y-1">
                        {Object.entries(medida.medidas).map(([key, value]) => (
                          <p key={key} className="text-xs text-muted-foreground">
                            {key}: {value}cm
                          </p>
                        ))}
                      </div>
                    </details>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{medida.notas}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Eye size={18} className="text-foreground" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <Edit size={18} className="text-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Nuevo Patrón/Medida */}
      {showNuevoPatron && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">
                {vistaActiva === 'patrones' ? 'Nuevo Patrón' : 'Nueva Medida'}
              </h3>
              <button onClick={() => setShowNuevoPatron(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Package className="text-primary" size={48} />
              </div>
              <p className="text-muted-foreground mb-6">
                {vistaActiva === 'patrones'
                  ? 'El registro de nuevos patrones se habilitará próximamente. Por ahora puedes utilizar los patrones existentes.'
                  : 'El registro de nuevas medidas se habilitará próximamente. Los patrones actuales incluyen medidas estándar.'}
              </p>
              <button
                onClick={() => setShowNuevoPatron(false)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
