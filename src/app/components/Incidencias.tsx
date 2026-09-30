import { useState } from 'react';
import { AlertCircle, Search, Filter, Eye, X, CheckCircle, Clock, XCircle, MessageSquare, Check } from 'lucide-react';

interface Incidencia {
  id: string;
  fecha: string;
  hora: string;
  usuario: string;
  email: string;
  tipo: 'tecnica' | 'producto' | 'envio' | 'pago' | 'otro';
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'abierta' | 'en_proceso' | 'resuelta' | 'cerrada';
  resolucion?: string;
  fechaResolucion?: string;
  responsable?: string;
}

interface IncidenciasProps {
  currentUser: {
    email: string;
    fullName: string;
    role: string;
  };
}

export default function Incidencias({ currentUser }: IncidenciasProps) {
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'empleado';

  const [incidencias, setIncidencias] = useState<Incidencia[]>([
    {
      id: 'INC-001',
      fecha: '2026-04-23',
      hora: '10:30',
      usuario: 'María Pérez',
      email: 'maria@cliente.com',
      tipo: 'producto',
      descripcion: 'El vestido que recibí tiene una costura defectuosa en el lateral izquierdo. No coincide con la calidad esperada.',
      prioridad: 'media',
      estado: 'resuelta',
      resolucion: 'Se envió un reemplazo del producto sin costo adicional. El cliente confirmó recepción y satisfacción con el nuevo producto.',
      fechaResolucion: '2026-04-23 14:20',
      responsable: 'Ana María González'
    },
    {
      id: 'INC-002',
      fecha: '2026-04-23',
      hora: '14:15',
      usuario: 'Carlos Mendoza',
      email: 'carlos@empresa.com',
      tipo: 'envio',
      descripcion: 'Mi pedido #PED-089 no ha llegado y ya pasaron 5 días de la fecha estimada de entrega.',
      prioridad: 'alta',
      estado: 'en_proceso',
      responsable: 'Sistema de Logística'
    },
    {
      id: 'INC-003',
      fecha: '2026-04-24',
      hora: '09:00',
      usuario: 'Laura Jiménez',
      email: 'laura@test.com',
      tipo: 'pago',
      descripcion: 'Se realizó un doble cobro en mi tarjeta por el pedido #PED-092. Solicito reembolso inmediato.',
      prioridad: 'critica',
      estado: 'abierta'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = useState<Incidencia | null>(null);
  const [showResolverModal, setShowResolverModal] = useState(false);
  const [showEditarEstadoModal, setShowEditarEstadoModal] = useState(false);
  const [nuevoEstadoIncidencia, setNuevoEstadoIncidencia] = useState<Incidencia['estado']>('abierta');

  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    tipo: 'tecnica' as Incidencia['tipo'],
    descripcion: '',
    prioridad: 'media' as Incidencia['prioridad']
  });

  const [resolucionTexto, setResolucionTexto] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'' | Incidencia['estado']>('');
  const [filtroPrioridad, setFiltroPrioridad] = useState<'' | Incidencia['prioridad']>('');

  const handleCrearIncidencia = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevaIncidencia.descripcion.trim()) {
      alert('Por favor describe la incidencia');
      return;
    }

    const now = new Date();
    const incidencia: Incidencia = {
      id: `INC-${String(incidencias.length + 1).padStart(3, '0')}`,
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().slice(0, 5),
      usuario: currentUser.fullName,
      email: currentUser.email,
      tipo: nuevaIncidencia.tipo,
      descripcion: nuevaIncidencia.descripcion,
      prioridad: nuevaIncidencia.prioridad,
      estado: 'abierta'
    };

    setIncidencias([incidencia, ...incidencias]);
    setNuevaIncidencia({ tipo: 'tecnica', descripcion: '', prioridad: 'media' });
    setShowModal(false);
    alert('Incidencia reportada correctamente. Nos pondremos en contacto pronto.');
  };

  const handleResolver = () => {
    if (!resolucionTexto.trim() || !selectedIncidencia) {
      alert('Por favor escribe la resolución');
      return;
    }

    const now = new Date();
    setIncidencias(prev => prev.map(inc =>
      inc.id === selectedIncidencia.id
        ? {
            ...inc,
            estado: 'resuelta' as const,
            resolucion: resolucionTexto,
            fechaResolucion: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`,
            responsable: currentUser.fullName
          }
        : inc
    ));

    setResolucionTexto('');
    setShowResolverModal(false);
    setSelectedIncidencia(null);
    alert('Incidencia resuelta correctamente');
  };

  const cambiarEstado = (incidenciaId: string, nuevoEstado: Incidencia['estado']) => {
    setIncidencias(prev => prev.map(inc =>
      inc.id === incidenciaId
        ? { ...inc, estado: nuevoEstado, responsable: nuevoEstado !== 'abierta' ? currentUser.fullName : inc.responsable }
        : inc
    ));
  };

  const abrirEditarEstado = (incidencia: Incidencia) => {
    setSelectedIncidencia(incidencia);
    setNuevoEstadoIncidencia(incidencia.estado);
    setShowEditarEstadoModal(true);
  };

  const actualizarEstadoIncidencia = () => {
    if (!selectedIncidencia) return;

    setIncidencias(prev => prev.map(inc =>
      inc.id === selectedIncidencia.id
        ? {
            ...inc,
            estado: nuevoEstadoIncidencia,
            responsable: nuevoEstadoIncidencia !== 'abierta' ? currentUser.fullName : inc.responsable
          }
        : inc
    ));

    setShowEditarEstadoModal(false);
    setSelectedIncidencia(null);
    alert('Estado actualizado correctamente');
  };

  const misIncidencias = isAdmin ? incidencias : incidencias.filter(i => i.email === currentUser.email);
  const incidenciasFiltradas = misIncidencias.filter(inc => {
    const matchSearch = inc.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (filtroEstado && inc.estado !== filtroEstado) return false;
    if (filtroPrioridad && inc.prioridad !== filtroPrioridad) return false;
    return true;
  });

  const tipoLabels = {
    tecnica: 'Técnica',
    producto: 'Producto',
    envio: 'Envío',
    pago: 'Pago',
    otro: 'Otro'
  };

  const prioridadConfig = {
    baja: { label: 'Baja', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
    media: { label: 'Media', color: 'bg-blue-100 text-blue-800 dark:bg-[#24545A]/60 dark:text-[#D8C2A8]' },
    alta: { label: 'Alta', color: 'bg-amber-100 text-amber-800 dark:bg-[#B7654A]/30 dark:text-[#D08A70]' },
    critica: { label: 'Crítica', color: 'bg-red-100 text-red-800 dark:bg-[#B7654A]/45 dark:text-[#F5EEE4]' }
  };

  const estadoConfig = {
    abierta: { label: 'Abierta', color: 'bg-red-100 text-red-800 dark:bg-[#B7654A]/45 dark:text-[#F5EEE4]', icon: AlertCircle },
    en_proceso: { label: 'En Proceso', color: 'bg-blue-100 text-blue-800 dark:bg-[#24545A]/60 dark:text-[#D8C2A8]', icon: Clock },
    resuelta: { label: 'Resuelta', color: 'bg-green-100 text-green-800 dark:bg-[#24545A] dark:text-[#D8C2A8]', icon: CheckCircle },
    cerrada: { label: 'Cerrada', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: XCircle }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">{isAdmin ? 'Gestión de Incidencias' : 'Mis Incidencias'}</h2>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? 'Administra y resuelve incidencias técnicas' : 'Reporta problemas y da seguimiento'}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <AlertCircle size={20} />
            Reportar Incidencia
          </button>
        )}
      </div>

      {/* Estadísticas */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(estadoConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = incidencias.filter(i => i.estado === key).length;
            return (
              <div key={key} className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{config.label}</p>
                  <Icon size={20} className="text-muted-foreground" />
                </div>
                <p className="text-2xl text-foreground">{count}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar incidencias..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los estados</option>
            {Object.entries(estadoConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value as any)}
            className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todas las prioridades</option>
            {Object.entries(prioridadConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Incidencias */}
      <div className="space-y-4">
        {incidenciasFiltradas.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">No hay incidencias</h3>
            <p className="text-muted-foreground">
              {isAdmin ? 'No hay incidencias reportadas' : 'No has reportado ninguna incidencia'}
            </p>
          </div>
        ) : (
          incidenciasFiltradas.map((incidencia) => {
            const EstadoIcon = estadoConfig[incidencia.estado].icon;
            return (
              <div key={incidencia.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono">
                        {incidencia.id}
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {tipoLabels[incidencia.tipo]}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${prioridadConfig[incidencia.prioridad].color}`}>
                        {prioridadConfig[incidencia.prioridad].label}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${estadoConfig[incidencia.estado].color}`}>
                        <EstadoIcon size={12} />
                        {estadoConfig[incidencia.estado].label}
                      </span>
                    </div>
                    {isAdmin && (
                      <p className="text-sm text-muted-foreground mb-1">
                        Usuario: {incidencia.usuario} ({incidencia.email})
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {incidencia.fecha} • {incidencia.hora}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedIncidencia(incidencia);
                      setShowDetalleModal(true);
                    }}
                    className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{incidencia.descripcion}</p>

                {isAdmin && incidencia.estado !== 'resuelta' && incidencia.estado !== 'cerrada' && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => abrirEditarEstado(incidencia)}
                      className="text-xs px-3 py-1 bg-secondary text-foreground rounded hover:bg-accent transition-colors flex items-center gap-1"
                    >
                      <Clock size={12} />
                      Cambiar Estado
                    </button>
                    {incidencia.estado === 'abierta' && (
                      <button
                        onClick={() => cambiarEstado(incidencia.id, 'en_proceso')}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-800 dark:bg-[#24545A]/60 dark:text-[#D8C2A8] rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Marcar En Proceso
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedIncidencia(incidencia);
                        setShowResolverModal(true);
                      }}
                      className="text-xs px-3 py-1 bg-green-100 text-green-800 dark:bg-[#24545A] dark:text-[#D8C2A8] rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      Resolver
                    </button>
                  </div>
                )}

                {incidencia.resolucion && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      Resuelta por {incidencia.responsable} • {incidencia.fechaResolucion}
                    </p>
                    <p className="text-sm text-foreground bg-green-50 dark:bg-[#24545A]/50 dark:bg-green-900/20 p-3 rounded-lg">
                      {incidencia.resolucion}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Reportar Incidencia */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Reportar Nueva Incidencia</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCrearIncidencia} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tipo de Incidencia</label>
                <select
                  value={nuevaIncidencia.tipo}
                  onChange={(e) => setNuevaIncidencia({ ...nuevaIncidencia, tipo: e.target.value as Incidencia['tipo'] })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(tipoLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Prioridad</label>
                <select
                  value={nuevaIncidencia.prioridad}
                  onChange={(e) => setNuevaIncidencia({ ...nuevaIncidencia, prioridad: e.target.value as Incidencia['prioridad'] })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(prioridadConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Descripción del Problema</label>
                <textarea
                  value={nuevaIncidencia.descripcion}
                  onChange={(e) => setNuevaIncidencia({ ...nuevaIncidencia, descripcion: e.target.value })}
                  placeholder="Describe el problema en detalle..."
                  rows={6}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <AlertCircle size={18} />
                  Reportar Incidencia
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {showDetalleModal && selectedIncidencia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Detalles de la Incidencia</h3>
              <button onClick={() => setShowDetalleModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID</p>
                  <p className="text-sm text-foreground font-mono">{selectedIncidencia.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Estado</p>
                  <span className={`px-2 py-1 rounded text-xs ${estadoConfig[selectedIncidencia.estado].color}`}>
                    {estadoConfig[selectedIncidencia.estado].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                  <p className="text-sm text-foreground">{tipoLabels[selectedIncidencia.tipo]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Prioridad</p>
                  <span className={`px-2 py-1 rounded text-xs ${prioridadConfig[selectedIncidencia.prioridad].color}`}>
                    {prioridadConfig[selectedIncidencia.prioridad].label}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Usuario</p>
                    <p className="text-sm text-foreground">{selectedIncidencia.usuario}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm text-foreground">{selectedIncidencia.email}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1">Descripción</p>
                <p className="text-sm text-foreground bg-secondary p-4 rounded-lg">{selectedIncidencia.descripcion}</p>
              </div>

              {selectedIncidencia.resolucion && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Resolución</p>
                  <div className="bg-green-50 dark:bg-[#24545A]/50 dark:bg-green-900/20 border border-green-200 dark:border-[#5E8587]/60 p-4 rounded-lg">
                    <p className="text-sm text-foreground mb-2">{selectedIncidencia.resolucion}</p>
                    <p className="text-xs text-muted-foreground">
                      Por {selectedIncidencia.responsable} • {selectedIncidencia.fechaResolucion}
                    </p>
                  </div>
                </div>
              )}

              {isAdmin && selectedIncidencia.estado !== 'resuelta' && selectedIncidencia.estado !== 'cerrada' && (
                <button
                  onClick={() => {
                    setShowDetalleModal(false);
                    setShowResolverModal(true);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-colors"
                >
                  Resolver Incidencia
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Resolver */}
      {showResolverModal && selectedIncidencia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Resolver Incidencia {selectedIncidencia.id}</h3>
              <button onClick={() => setShowResolverModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Descripción Original:</p>
                <p className="text-sm text-foreground">{selectedIncidencia.descripcion}</p>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Resolución</label>
                <textarea
                  value={resolucionTexto}
                  onChange={(e) => setResolucionTexto(e.target.value)}
                  placeholder="Describe cómo se resolvió la incidencia..."
                  rows={6}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResolver}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Marcar como Resuelta
                </button>
                <button
                  onClick={() => setShowResolverModal(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Estado */}
      {showEditarEstadoModal && selectedIncidencia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Actualizar Estado - {selectedIncidencia.id}</h3>
              <button onClick={() => setShowEditarEstadoModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Estado Actual</p>
                <span className={`px-2 py-1 rounded text-xs inline-flex items-center gap-1 ${estadoConfig[selectedIncidencia.estado].color}`}>
                  {estadoConfig[selectedIncidencia.estado].label}
                </span>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Nuevo Estado</label>
                <select
                  value={nuevoEstadoIncidencia}
                  onChange={(e) => setNuevoEstadoIncidencia(e.target.value as Incidencia['estado'])}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="abierta">Abierta</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelta">Resuelta</option>
                  <option value="cerrada">Cerrada</option>
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-[#24545A]/40 dark:bg-blue-900/20 border border-blue-200 dark:border-[#5E8587]/40 p-3 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-[#5E8587]">
                  <strong>Nota:</strong> El cambio de estado será registrado con tu nombre como responsable.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={actualizarEstadoIncidencia}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Actualizar Estado
                </button>
                <button
                  onClick={() => setShowEditarEstadoModal(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
