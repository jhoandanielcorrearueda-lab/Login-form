import { useState } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Eye, X } from 'lucide-react';

interface Solicitud {
  id: string;
  fecha: string;
  hora: string;
  tipo: 'peticion' | 'queja' | 'reclamo' | 'sugerencia';
  asunto: string;
  mensaje: string;
  cliente: string;
  email: string;
  estado: 'pendiente' | 'en_revision' | 'respondida';
  respuesta?: string;
  fechaRespuesta?: string;
  respondidoPor?: string;
}

interface SoporteProps {
  currentUser: {
    email: string;
    fullName: string;
    role: string;
  };
}

export default function Soporte({ currentUser }: SoporteProps) {
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'empleado';

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    {
      id: 'SOL-001',
      fecha: '2026-04-23',
      hora: '10:30',
      tipo: 'peticion',
      asunto: 'Consulta sobre disponibilidad de tallas',
      mensaje: 'Hola, me gustaría saber si tienen disponible el Vestido Floral Verano en talla XL. No aparece en el catálogo en línea.',
      cliente: 'María Pérez',
      email: 'maria@cliente.com',
      estado: 'respondida',
      respuesta: 'Hola María, gracias por tu consulta. Actualmente tenemos el Vestido Floral Verano disponible en talla XL. Hemos actualizado el inventario en línea. ¡Puedes realizar tu pedido cuando desees!',
      fechaRespuesta: '2026-04-23 11:15',
      respondidoPor: 'Ana María González'
    },
    {
      id: 'SOL-002',
      fecha: '2026-04-23',
      hora: '14:20',
      tipo: 'queja',
      asunto: 'Retraso en el envío',
      mensaje: 'Mi pedido #PED-089 debía llegar ayer pero aún no ha sido despachado. Necesito el producto urgentemente para un evento el viernes.',
      cliente: 'Carlos Mendoza',
      email: 'carlos@empresa.com',
      estado: 'en_revision',
      respondidoPor: 'Sistema'
    },
    {
      id: 'SOL-003',
      fecha: '2026-04-23',
      hora: '15:45',
      tipo: 'sugerencia',
      asunto: 'Mejorar el sistema de filtros',
      mensaje: 'Sería muy útil poder filtrar los productos por rango de precio y que se puedan ver más fotos de cada prenda desde diferentes ángulos.',
      cliente: 'Laura Jiménez',
      email: 'laura@test.com',
      estado: 'pendiente'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Formulario para nueva solicitud (clientes)
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    tipo: 'peticion' as Solicitud['tipo'],
    asunto: '',
    mensaje: ''
  });

  // Formulario de respuesta (admin)
  const [respuestaTexto, setRespuestaTexto] = useState('');

  const handleCrearSolicitud = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevaSolicitud.asunto.trim() || !nuevaSolicitud.mensaje.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    const now = new Date();
    const solicitud: Solicitud = {
      id: `SOL-${String(solicitudes.length + 1).padStart(3, '0')}`,
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().slice(0, 5),
      tipo: nuevaSolicitud.tipo,
      asunto: nuevaSolicitud.asunto,
      mensaje: nuevaSolicitud.mensaje,
      cliente: currentUser.fullName,
      email: currentUser.email,
      estado: 'pendiente'
    };

    setSolicitudes([...solicitudes, solicitud]);
    setNuevaSolicitud({ tipo: 'peticion', asunto: '', mensaje: '' });
    setShowModal(false);
    alert('Solicitud enviada correctamente. Te notificaremos cuando recibas una respuesta.');
  };

  const handleResponder = (solicitudId: string) => {
    if (!respuestaTexto.trim()) {
      alert('Por favor escribe una respuesta');
      return;
    }

    const now = new Date();
    setSolicitudes(prev => prev.map(sol =>
      sol.id === solicitudId
        ? {
            ...sol,
            estado: 'respondida' as const,
            respuesta: respuestaTexto,
            fechaRespuesta: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`,
            respondidoPor: currentUser.fullName
          }
        : sol
    ));

    setRespuestaTexto('');
    setShowResponseModal(false);
    setSelectedSolicitud(null);
    alert('Respuesta enviada al cliente correctamente');
  };

  const cambiarEstado = (solicitudId: string, nuevoEstado: Solicitud['estado']) => {
    setSolicitudes(prev => prev.map(sol =>
      sol.id === solicitudId
        ? { ...sol, estado: nuevoEstado, respondidoPor: nuevoEstado === 'en_revision' ? currentUser.fullName : sol.respondidoPor }
        : sol
    ));
  };

  const misSolicitudes = isAdmin ? solicitudes : solicitudes.filter(s => s.email === currentUser.email);
  const solicitudesPendientes = solicitudes.filter(s => s.estado !== 'respondida');

  const tipoLabels = {
    peticion: 'Petición',
    queja: 'Queja',
    reclamo: 'Reclamo',
    sugerencia: 'Sugerencia'
  };

  const estadoConfig = {
    pendiente: { label: 'Pendiente', color: 'bg-amber-100 text-amber-800 dark:bg-[#B7654A]/30 dark:text-[#D08A70]', icon: Clock },
    en_revision: { label: 'En Revisión', color: 'bg-blue-100 text-blue-800 dark:bg-[#24545A]/60 dark:text-[#D8C2A8]', icon: AlertCircle },
    respondida: { label: 'Respondida', color: 'bg-green-100 text-green-800 dark:bg-[#24545A] dark:text-[#D8C2A8]', icon: CheckCircle }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">{isAdmin ? 'Gestión de Soporte y PQRS' : 'Mis Solicitudes y Soporte'}</h2>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? 'Administra las solicitudes de los clientes' : 'Envía peticiones, quejas, reclamos o sugerencias'}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <MessageSquare size={20} />
            Nueva Solicitud
          </button>
        )}
      </div>

      {/* Estadísticas (solo admin) */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Solicitudes</p>
              <MessageSquare size={20} className="text-primary" />
            </div>
            <p className="text-2xl text-foreground">{solicitudes.length}</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <Clock size={20} className="text-amber-500" />
            </div>
            <p className="text-2xl text-foreground">{solicitudes.filter(s => s.estado === 'pendiente').length}</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">En Revisión</p>
              <AlertCircle size={20} className="text-blue-500" />
            </div>
            <p className="text-2xl text-foreground">{solicitudes.filter(s => s.estado === 'en_revision').length}</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Respondidas</p>
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <p className="text-2xl text-foreground">{solicitudes.filter(s => s.estado === 'respondida').length}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de solicitudes */}
        <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-2'} space-y-4`}>
          <h3 className="text-foreground">{isAdmin ? 'Todas las Solicitudes' : 'Mis Solicitudes'}</h3>

          {misSolicitudes.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">No hay solicitudes</h3>
              <p className="text-muted-foreground">
                {isAdmin ? 'No hay solicitudes de clientes pendientes' : 'Aún no has enviado ninguna solicitud'}
              </p>
            </div>
          ) : (
            misSolicitudes.map((solicitud) => {
              const EstadoIcon = estadoConfig[solicitud.estado].icon;
              return (
                <div key={solicitud.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                          {solicitud.id}
                        </span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {tipoLabels[solicitud.tipo]}
                        </span>
                      </div>
                      <h4 className="text-foreground mb-1">{solicitud.asunto}</h4>
                      {isAdmin && (
                        <p className="text-sm text-muted-foreground">
                          Cliente: {solicitud.cliente} ({solicitud.email})
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {solicitud.fecha} • {solicitud.hora}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSolicitud(solicitud);
                        setShowResponseModal(false);
                      }}
                      className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{solicitud.mensaje}</p>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${estadoConfig[solicitud.estado].color}`}>
                      <EstadoIcon size={14} />
                      {estadoConfig[solicitud.estado].label}
                    </span>

                    {isAdmin && solicitud.estado !== 'respondida' && (
                      <div className="flex gap-2">
                        {solicitud.estado === 'pendiente' && (
                          <button
                            onClick={() => cambiarEstado(solicitud.id, 'en_revision')}
                            className="text-xs px-3 py-1 bg-blue-100 text-blue-800 dark:bg-[#24545A]/60 dark:text-[#D8C2A8] rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            Marcar en Revisión
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedSolicitud(solicitud);
                            setShowResponseModal(true);
                          }}
                          className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                        >
                          Responder
                        </button>
                      </div>
                    )}
                  </div>

                  {solicitud.respuesta && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Respuesta de {solicitud.respondidoPor} • {solicitud.fechaRespuesta}
                      </p>
                      <p className="text-sm text-foreground bg-secondary p-3 rounded-lg">
                        {solicitud.respuesta}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Panel lateral de estados */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-foreground mb-4">Estado de Solicitudes</h3>
            <div className="space-y-3">
              {Object.entries(estadoConfig).map(([key, config]) => {
                const Icon = config.icon;
                const count = misSolicitudes.filter(s => s.estado === key).length;
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon size={18} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{config.label}</span>
                    </div>
                    <span className="text-lg font-medium text-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-foreground mb-4">Tipos de Solicitud</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">Petición - Consultas generales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-muted-foreground">Queja - Inconformidades</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-muted-foreground">Reclamo - Problemas técnicos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">Sugerencia - Mejoras</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nueva Solicitud */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Nueva Solicitud</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCrearSolicitud} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tipo de Solicitud</label>
                <select
                  value={nuevaSolicitud.tipo}
                  onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, tipo: e.target.value as Solicitud['tipo'] })}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="peticion">Petición</option>
                  <option value="queja">Queja</option>
                  <option value="reclamo">Reclamo</option>
                  <option value="sugerencia">Sugerencia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Asunto</label>
                <input
                  type="text"
                  value={nuevaSolicitud.asunto}
                  onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, asunto: e.target.value })}
                  placeholder="Breve descripción del tema"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Mensaje</label>
                <textarea
                  value={nuevaSolicitud.mensaje}
                  onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, mensaje: e.target.value })}
                  placeholder="Describe tu solicitud en detalle..."
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
                  <Send size={18} />
                  Enviar Solicitud
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

      {/* Modal Ver Detalles */}
      {selectedSolicitud && !showResponseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Detalles de la Solicitud</h3>
              <button onClick={() => setSelectedSolicitud(null)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID</p>
                  <p className="text-sm text-foreground">{selectedSolicitud.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    {tipoLabels[selectedSolicitud.tipo]}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Asunto</p>
                <p className="text-sm text-foreground">{selectedSolicitud.asunto}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Mensaje</p>
                <p className="text-sm text-foreground bg-secondary p-4 rounded-lg">{selectedSolicitud.mensaje}</p>
              </div>

              {isAdmin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                    <p className="text-sm text-foreground">{selectedSolicitud.cliente}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm text-foreground">{selectedSolicitud.email}</p>
                  </div>
                </div>
              )}

              {selectedSolicitud.respuesta && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Respuesta</p>
                  <div className="bg-green-50 dark:bg-[#24545A]/50 dark:bg-green-900/20 border border-green-200 dark:border-[#5E8587]/60 p-4 rounded-lg">
                    <p className="text-sm text-foreground mb-2">{selectedSolicitud.respuesta}</p>
                    <p className="text-xs text-muted-foreground">
                      Por {selectedSolicitud.respondidoPor} • {selectedSolicitud.fechaRespuesta}
                    </p>
                  </div>
                </div>
              )}

              {isAdmin && selectedSolicitud.estado !== 'respondida' && (
                <button
                  onClick={() => setShowResponseModal(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-colors"
                >
                  Responder Solicitud
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Responder */}
      {showResponseModal && selectedSolicitud && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-foreground">Responder a {selectedSolicitud.cliente}</h3>
              <button onClick={() => setShowResponseModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Solicitud Original:</p>
                <p className="text-sm text-foreground font-medium">{selectedSolicitud.asunto}</p>
                <p className="text-sm text-muted-foreground mt-2">{selectedSolicitud.mensaje}</p>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tu Respuesta</label>
                <textarea
                  value={respuestaTexto}
                  onChange={(e) => setRespuestaTexto(e.target.value)}
                  placeholder="Escribe tu respuesta al cliente..."
                  rows={6}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleResponder(selectedSolicitud.id)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Enviar Respuesta
                </button>
                <button
                  onClick={() => setShowResponseModal(false)}
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
