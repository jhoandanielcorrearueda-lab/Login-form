import { useState } from 'react';
import { Recycle, Gift, ShoppingBag, Lightbulb, Heart, Package } from 'lucide-react';

type Modo = 'donar' | 'comprar';

interface Retazo {
  id: number;
  tipo: string;
  color: string;
  dimensiones: string;
  precio?: number;
  usosSugeridos: string[];
  imagen: string;
}

interface RetazoDonado {
  tipo: string;
  color: string;
  largo: string;
  ancho: string;
  usosPosibles: string[];
}

export default function GestionRetazos() {
  const [modo, setModo] = useState<Modo>('comprar');
  const [retazoDonado, setRetazoDonado] = useState<RetazoDonado | null>(null);
  const [formDonacion, setFormDonacion] = useState({
    tipo: '',
    color: '',
    largo: '',
    ancho: ''
  });

  const retazosDisponibles: Retazo[] = [
    {
      id: 1,
      tipo: 'Algodón',
      color: 'Azul',
      dimensiones: '50cm x 80cm',
      precio: 8,
      usosSugeridos: ['Bolso pequeño', 'Funda de cojín', 'Mantel individual', 'Delantal infantil'],
      imagen: 'https://images.unsplash.com/photo-1650324371896-f0b4bc2238dd?w=400'
    },
    {
      id: 2,
      tipo: 'Seda',
      color: 'Rosa',
      dimensiones: '40cm x 60cm',
      precio: 15,
      usosSugeridos: ['Pañuelo decorativo', 'Detalle de vestido', 'Accesorio de cabello', 'Lazo decorativo'],
      imagen: 'https://images.unsplash.com/photo-1662112034764-a6d1ffbd1fb6?w=400'
    },
    {
      id: 3,
      tipo: 'Denim',
      color: 'Azul oscuro',
      dimensiones: '70cm x 90cm',
      precio: 12,
      usosSugeridos: ['Bolso tipo tote', 'Delantal', 'Parches decorativos', 'Estuche grande'],
      imagen: 'https://images.unsplash.com/photo-1542905333-96e12e5c2cfd?w=400'
    },
    {
      id: 4,
      tipo: 'Terciopelo',
      color: 'Verde',
      dimensiones: '30cm x 50cm',
      precio: 10,
      usosSugeridos: ['Funda de cojín premium', 'Tapete decorativo', 'Bolsa de regalo', 'Detalle de prenda'],
      imagen: 'https://images.unsplash.com/photo-1650324371896-f0b4bc2238dd?w=400'
    },
    {
      id: 5,
      tipo: 'Lino',
      color: 'Beige',
      dimensiones: '60cm x 100cm',
      precio: 14,
      usosSugeridos: ['Bolso de compras', 'Servilletas (set de 4)', 'Camino de mesa', 'Funda de libro'],
      imagen: 'https://images.unsplash.com/photo-1662112034764-a6d1ffbd1fb6?w=400'
    },
    {
      id: 6,
      tipo: 'Encaje',
      color: 'Blanco',
      dimensiones: '25cm x 40cm',
      precio: 9,
      usosSugeridos: ['Detalle de vestido', 'Cortina pequeña', 'Marcador de libro', 'Decoración vintage'],
      imagen: 'https://images.unsplash.com/photo-1650324371896-f0b4bc2238dd?w=400'
    }
  ];

  const calcularUsosPosibles = (largo: number, ancho: number) => {
    const usos = [];
    const area = largo * ancho;

    if (area >= 2400) usos.push('Bolso grande', 'Delantal completo', 'Funda de cojín grande');
    if (area >= 1500) usos.push('Bolso mediano', 'Camino de mesa', 'Set de servilletas');
    if (area >= 800) usos.push('Bolso pequeño', 'Funda de cojín', 'Mantel individual');
    if (area >= 400) usos.push('Estuche', 'Monedero', 'Accesorio decorativo');
    if (area >= 200) usos.push('Parches', 'Lazos', 'Pequeños accesorios');

    return usos.length > 0 ? usos : ['Detalles decorativos', 'Material de relleno'];
  };

  const handleDonar = (e: React.FormEvent) => {
    e.preventDefault();
    const largo = parseFloat(formDonacion.largo);
    const ancho = parseFloat(formDonacion.ancho);
    const usosPosibles = calcularUsosPosibles(largo, ancho);

    setRetazoDonado({
      tipo: formDonacion.tipo,
      color: formDonacion.color,
      largo: formDonacion.largo,
      ancho: formDonacion.ancho,
      usosPosibles
    });
  };

  const resetDonacion = () => {
    setFormDonacion({ tipo: '', color: '', largo: '', ancho: '' });
    setRetazoDonado(null);
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#173A3E] to-[#24545A] p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center">
            <Recycle size={24} />
          </div>
          <div>
            <h2 className="text-2xl">Gestión Inteligente de Retazos</h2>
            <p className="text-white/80">Recicla, reutiliza y crea de forma sostenible</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="flex">
          <button
            onClick={() => setModo('comprar')}
            className={`flex-1 px-6 py-4 border-b-2 transition-colors ${
              modo === 'comprar'
                ? 'border-[#24545A] text-[#24545A] dark:border-[#5E8587] dark:text-[#5E8587]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag size={20} />
              Comprar Retazos
            </div>
          </button>
          <button
            onClick={() => setModo('donar')}
            className={`flex-1 px-6 py-4 border-b-2 transition-colors ${
              modo === 'donar'
                ? 'border-[#B7654A] text-[#B7654A] dark:border-[#D08A70] dark:text-[#D08A70]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Gift size={20} />
              Donar Retazos
            </div>
          </button>
        </div>
      </div>

      <div className="p-8 bg-background">
        {/* Modo Comprar */}
        {modo === 'comprar' && (
          <div className="space-y-6">
            <div className="bg-[#F5EEE4] dark:bg-[#24545A]/60 rounded-lg p-4 flex items-start gap-3 border border-[#D8C2A8] dark:border-[#5E8587]/30">
              <Heart className="text-[#B7654A] flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-foreground mb-1">Compra con propósito</h4>
                <p className="text-sm text-muted-foreground">
                  Cada retazo que compras evita el desperdicio y promueve la moda sostenible.
                  ¡Dale una segunda vida a estos materiales!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {retazosDisponibles.map(retazo => (
                <div key={retazo.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={retazo.imagen}
                    alt={`${retazo.tipo} ${retazo.color}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-foreground">{retazo.tipo}</h4>
                      <span className="text-xl text-[#B7654A] font-medium">${retazo.precio}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {retazo.color} • {retazo.dimensiones}
                    </p>

                    <div className="bg-[#F5EEE4] dark:bg-[#24545A]/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={16} className="text-[#A98255]" />
                        <span className="text-sm text-foreground">Ideas de uso:</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {retazo.usosSugeridos.slice(0, 3).map((uso, idx) => (
                          <li key={idx}>• {uso}</li>
                        ))}
                      </ul>
                    </div>

                    <button className="w-full bg-[#24545A] hover:bg-[#173A3E] text-white py-2 rounded-lg transition-colors">
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modo Donar */}
        {modo === 'donar' && !retazoDonado && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#F5EEE4] dark:bg-[#24545A]/60 rounded-lg p-4 flex items-start gap-3 border border-[#D8C2A8] dark:border-[#5E8587]/30">
              <Heart className="text-[#B7654A] flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-foreground mb-1">¡Gracias por donar!</h4>
                <p className="text-sm text-muted-foreground">
                  Tu donación ayuda a reducir el desperdicio textil y permite que otros
                  creativos den nueva vida a estos materiales.
                </p>
              </div>
            </div>

            <form onSubmit={handleDonar} className="space-y-4">
              <div>
                <label className="block text-foreground mb-2">Tipo de tela</label>
                <select
                  value={formDonacion.tipo}
                  onChange={(e) => setFormDonacion({ ...formDonacion, tipo: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                >
                  <option value="">Selecciona el tipo</option>
                  <option value="Algodón">Algodón</option>
                  <option value="Seda">Seda</option>
                  <option value="Lino">Lino</option>
                  <option value="Denim">Denim</option>
                  <option value="Terciopelo">Terciopelo</option>
                  <option value="Encaje">Encaje</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground mb-2">Color predominante</label>
                <input
                  type="text"
                  value={formDonacion.color}
                  onChange={(e) => setFormDonacion({ ...formDonacion, color: e.target.value })}
                  required
                  placeholder="Ej: Azul, Rojo, Estampado floral"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground mb-2">Largo (cm)</label>
                  <input
                    type="number"
                    value={formDonacion.largo}
                    onChange={(e) => setFormDonacion({ ...formDonacion, largo: e.target.value })}
                    required
                    min="10"
                    placeholder="50"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2">Ancho (cm)</label>
                  <input
                    type="number"
                    value={formDonacion.ancho}
                    onChange={(e) => setFormDonacion({ ...formDonacion, ancho: e.target.value })}
                    required
                    min="10"
                    placeholder="80"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#B7654A] hover:bg-[#D08A70] text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Package size={20} />
                Ver usos posibles
              </button>
            </form>
          </div>
        )}

        {/* Resultado Donación */}
        {modo === 'donar' && retazoDonado && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-[#F5EEE4] dark:bg-[#24545A] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#D8C2A8] dark:border-[#5E8587]/40">
                <Heart size={40} className="text-[#B7654A]" />
              </div>
              <h3 className="text-foreground mb-2">¡Excelente donación!</h3>
              <p className="text-muted-foreground">
                Tu retazo de {retazoDonado.tipo} {retazoDonado.color} ({retazoDonado.largo}cm x {retazoDonado.ancho}cm)
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#F5EEE4] to-[#D8C2A8]/40 dark:from-[#24545A]/60 dark:to-[#24545A]/30 rounded-xl p-6 border border-[#D8C2A8] dark:border-[#5E8587]/30">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-[#A98255]" size={24} />
                <h4 className="text-foreground">Podrá ser usado para:</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {retazoDonado.usosPosibles.map((uso, idx) => (
                  <div key={idx} className="bg-card rounded-lg p-3 flex items-center gap-2 border border-border">
                    <span className="text-[#24545A] dark:text-[#5E8587] font-bold">✓</span>
                    <span className="text-foreground">{uso}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-4 border border-border">
              <h4 className="text-foreground mb-2">📍 Próximos pasos</h4>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li>1. Recibirás un código QR para entregar tu retazo</li>
                <li>2. Puedes llevarlo a cualquiera de nuestras tiendas</li>
                <li>3. Recibirás un descuento del 15% en tu próxima compra</li>
                <li>4. Te notificaremos cuando tu retazo sea reutilizado</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetDonacion}
                className="flex-1 border border-border py-3 rounded-lg hover:bg-secondary transition-colors text-foreground"
              >
                Donar otro retazo
              </button>
              <button className="flex-1 bg-[#24545A] hover:bg-[#173A3E] text-white py-3 rounded-lg transition-colors">
                Confirmar donación
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
