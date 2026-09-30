import { useState, useEffect } from 'react';
import { Star, ThumbsUp, X, Edit2, Trash2 } from 'lucide-react';

interface Resena {
  id: string;
  productoId: number | string;
  usuarioNombre: string;
  usuarioEmail: string;
  calificacion: number;
  titulo: string;
  comentario: string;
  fecha: string;
  likes: number;
  verificada: boolean;
}

interface ResenasProps {
  productoId: number | string;
  productoNombre: string;
  currentUserEmail?: string;
}

export default function Resenas({ productoId, productoNombre, currentUserEmail }: ResenasProps) {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [calificacion, setCalificacion] = useState(5);
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [filtroCalificacion, setFiltroCalificacion] = useState<number | 'todas'>('todas');

  useEffect(() => {
    cargarResenas();
  }, [productoId]);

  const cargarResenas = () => {
    const saved = localStorage.getItem('resenas');
    if (saved) {
      const todasResenas: Resena[] = JSON.parse(saved);
      const resenasProducto = todasResenas.filter(r => r.productoId === productoId);
      setResenas(resenasProducto);
    }
  };

  const agregarResena = () => {
    if (!titulo.trim() || !comentario.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (!currentUserEmail) {
      alert('Debes iniciar sesión para escribir una reseña');
      return;
    }

    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];

    const nuevaResena: Resena = {
      id: `resena-${Date.now()}`,
      productoId,
      usuarioNombre: currentUserEmail.split('@')[0],
      usuarioEmail: currentUserEmail,
      calificacion,
      titulo,
      comentario,
      fecha,
      likes: 0,
      verificada: true
    };

    // Cargar todas las reseñas
    const saved = localStorage.getItem('resenas');
    const todasResenas: Resena[] = saved ? JSON.parse(saved) : [];

    // Agregar la nueva
    todasResenas.push(nuevaResena);

    // Guardar
    localStorage.setItem('resenas', JSON.stringify(todasResenas));

    // Actualizar estado local
    setResenas([nuevaResena, ...resenas]);

    // Limpiar formulario
    setTitulo('');
    setComentario('');
    setCalificacion(5);
    setShowForm(false);

    alert('¡Reseña publicada exitosamente!');
  };

  const darLike = (resenaId: string) => {
    const saved = localStorage.getItem('resenas');
    if (saved) {
      const todasResenas: Resena[] = JSON.parse(saved);
      const actualizadas = todasResenas.map(r =>
        r.id === resenaId ? { ...r, likes: r.likes + 1 } : r
      );
      localStorage.setItem('resenas', JSON.stringify(actualizadas));
      cargarResenas();
    }
  };

  const eliminarResena = (resenaId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reseña?')) return;

    const saved = localStorage.getItem('resenas');
    if (saved) {
      const todasResenas: Resena[] = JSON.parse(saved);
      const filtradas = todasResenas.filter(r => r.id !== resenaId);
      localStorage.setItem('resenas', JSON.stringify(filtradas));
      cargarResenas();
    }
  };

  const resenasFiltradas = filtroCalificacion === 'todas'
    ? resenas
    : resenas.filter(r => r.calificacion === filtroCalificacion);

  const promedioCalificacion = resenas.length > 0
    ? resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length
    : 0;

  const distribucionCalificaciones = [5, 4, 3, 2, 1].map(calif => ({
    estrellas: calif,
    cantidad: resenas.filter(r => r.calificacion === calif).length
  }));

  return (
    <div className="space-y-6">
      {/* Resumen de Calificaciones */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-foreground mb-4">Calificaciones y Reseñas</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Promedio */}
          <div className="text-center">
            <div className="text-5xl text-foreground mb-2">
              {promedioCalificacion.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(promedioCalificacion) ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-300'}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'}
            </p>
          </div>

          {/* Distribución */}
          <div className="space-y-2">
            {distribucionCalificaciones.map((dist) => (
              <div key={dist.estrellas} className="flex items-center gap-2">
                <span className="text-sm text-foreground w-12">{dist.estrellas} ★</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#fbbf24]"
                    style={{ width: resenas.length > 0 ? `${(dist.cantidad / resenas.length) * 100}%` : '0%' }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground w-8">{dist.cantidad}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón para escribir reseña */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors"
          >
            Escribir una Reseña
          </button>
        )}
      </div>

      {/* Formulario de Nueva Reseña */}
      {showForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Escribe tu Reseña</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Calificación */}
            <div>
              <label className="block text-sm text-foreground mb-2">
                Calificación <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCalificacion(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={star <= calificacion ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm text-foreground mb-2">
                Título de tu Reseña <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Excelente calidad"
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Comentario */}
            <div>
              <label className="block text-sm text-foreground mb-2">
                Tu Experiencia <span className="text-destructive">*</span>
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Cuéntanos sobre tu experiencia con este producto..."
                rows={5}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              ></textarea>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-secondary hover:bg-accent text-secondary-foreground py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={agregarResena}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors"
              >
                Publicar Reseña
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtro */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Filtrar por:</span>
        <button
          onClick={() => setFiltroCalificacion('todas')}
          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
            filtroCalificacion === 'todas'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          Todas
        </button>
        {[5, 4, 3, 2, 1].map((calif) => (
          <button
            key={calif}
            onClick={() => setFiltroCalificacion(calif)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
              filtroCalificacion === calif
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            {calif} <Star size={12} className="fill-current" />
          </button>
        ))}
      </div>

      {/* Lista de Reseñas */}
      <div className="space-y-4">
        {resenasFiltradas.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">
              {filtroCalificacion === 'todas'
                ? 'Aún no hay reseñas para este producto. ¡Sé el primero en escribir una!'
                : `No hay reseñas con ${filtroCalificacion} estrellas`}
            </p>
          </div>
        ) : (
          resenasFiltradas.map((resena) => (
            <div key={resena.id} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                      {resena.usuarioNombre.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{resena.usuarioNombre}</p>
                      {resena.verificada && (
                        <p className="text-xs text-green-500">✓ Compra verificada</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < resena.calificacion ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{resena.fecha}</p>
                </div>
              </div>

              <h4 className="text-foreground font-medium mb-2">{resena.titulo}</h4>
              <p className="text-muted-foreground mb-4">{resena.comentario}</p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => darLike(resena.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ThumbsUp size={16} />
                  <span className="text-sm">Útil ({resena.likes})</span>
                </button>

                {currentUserEmail === resena.usuarioEmail && (
                  <button
                    onClick={() => eliminarResena(resena.id)}
                    className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Eliminar</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
