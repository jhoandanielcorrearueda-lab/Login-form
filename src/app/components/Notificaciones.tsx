import { useState, useEffect } from 'react';
import { Bell, X, Package, Truck, CheckCircle, Clock, Trash2 } from 'lucide-react';

type TipoNotificacion = 'pedido' | 'sistema' | 'promocion';
type EstadoPedido = 'procesado' | 'enviado' | 'entregado';

interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  fecha: string;
  hora: string;
  leida: boolean;
  pedidoId?: string;
  estadoPedido?: EstadoPedido;
}

interface NotificacionesProps {
  onClose?: () => void;
}

export default function Notificaciones({ onClose }: NotificacionesProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    cargarNotificaciones();
    const interval = setInterval(verificarNuevasNotificaciones, 5000);
    return () => clearInterval(interval);
  }, []);

  const cargarNotificaciones = () => {
    const saved = localStorage.getItem('notificaciones');
    if (saved) {
      setNotificaciones(JSON.parse(saved));
    }
  };

  const verificarNuevasNotificaciones = () => {
    // Verificar si hay nuevas notificaciones
    const saved = localStorage.getItem('notificaciones');
    if (saved) {
      const notifs = JSON.parse(saved);
      setNotificaciones(notifs);
    }
  };

  const marcarComoLeida = (id: string) => {
    const actualizadas = notificaciones.map(n =>
      n.id === id ? { ...n, leida: true } : n
    );
    setNotificaciones(actualizadas);
    localStorage.setItem('notificaciones', JSON.stringify(actualizadas));
  };

  const eliminarNotificacion = (id: string) => {
    const filtradas = notificaciones.filter(n => n.id !== id);
    setNotificaciones(filtradas);
    localStorage.setItem('notificaciones', JSON.stringify(filtradas));
  };

  const marcarTodasComoLeidas = () => {
    const actualizadas = notificaciones.map(n => ({ ...n, leida: true }));
    setNotificaciones(actualizadas);
    localStorage.setItem('notificaciones', JSON.stringify(actualizadas));
  };

  const eliminarTodasLeidas = () => {
    const filtradas = notificaciones.filter(n => !n.leida);
    setNotificaciones(filtradas);
    localStorage.setItem('notificaciones', JSON.stringify(filtradas));
  };

  const getIconoPorTipo = (notif: Notificacion) => {
    if (notif.tipo === 'pedido' && notif.estadoPedido) {
      switch (notif.estadoPedido) {
        case 'procesado':
          return <Clock size={20} className="text-blue-500" />;
        case 'enviado':
          return <Truck size={20} className="text-orange-500" />;
        case 'entregado':
          return <CheckCircle size={20} className="text-green-500" />;
      }
    }
    return <Bell size={20} className="text-primary" />;
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="bg-card rounded-lg border border-border shadow-lg max-w-md w-full max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-foreground" />
          <h3 className="text-foreground">Notificaciones</h3>
          {noLeidas > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {noLeidas}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Acciones */}
      {notificaciones.length > 0 && (
        <div className="p-3 border-b border-border flex gap-2">
          <button
            onClick={marcarTodasComoLeidas}
            className="text-xs bg-secondary hover:bg-accent text-secondary-foreground px-3 py-1.5 rounded-lg transition-colors"
          >
            Marcar todas como leídas
          </button>
          <button
            onClick={eliminarTodasLeidas}
            className="text-xs bg-secondary hover:bg-accent text-secondary-foreground px-3 py-1.5 rounded-lg transition-colors"
          >
            Eliminar leídas
          </button>
        </div>
      )}

      {/* Lista de Notificaciones */}
      <div className="flex-1 overflow-y-auto">
        {notificaciones.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No tienes notificaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notificaciones.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                  !notif.leida ? 'bg-primary/5' : ''
                }`}
                onClick={() => !notif.leida && marcarComoLeida(notif.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIconoPorTipo(notif)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm ${!notif.leida ? 'text-foreground font-semibold' : 'text-foreground'}`}>
                        {notif.titulo}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarNotificacion(notif.id);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notif.mensaje}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notif.fecha} a las {notif.hora}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Función helper para crear notificación de cambio de estado
export function crearNotificacionCambioEstado(
  pedidoId: string,
  nuevoEstado: EstadoPedido
): void {
  const ahora = new Date();
  const fecha = ahora.toISOString().split('T')[0];
  const hora = ahora.toTimeString().split(' ')[0].substring(0, 5);

  const mensajes = {
    procesado: 'Tu pedido ha sido recibido y está siendo procesado.',
    enviado: 'Tu pedido ha sido enviado y está en camino.',
    entregado: '¡Tu pedido ha sido entregado exitosamente!'
  };

  const titulos = {
    procesado: 'Pedido Procesado',
    enviado: 'Pedido Enviado',
    entregado: 'Pedido Entregado'
  };

  const nuevaNotificacion: Notificacion = {
    id: `notif-${Date.now()}`,
    tipo: 'pedido',
    titulo: `${titulos[nuevoEstado]} - Pedido #${pedidoId}`,
    mensaje: mensajes[nuevoEstado],
    fecha,
    hora,
    leida: false,
    pedidoId,
    estadoPedido: nuevoEstado
  };

  // Cargar notificaciones existentes
  const saved = localStorage.getItem('notificaciones');
  const notificaciones: Notificacion[] = saved ? JSON.parse(saved) : [];

  // Agregar la nueva notificación al inicio
  notificaciones.unshift(nuevaNotificacion);

  // Limitar a las últimas 50 notificaciones
  if (notificaciones.length > 50) {
    notificaciones.splice(50);
  }

  // Guardar
  localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
}
