import { useState } from 'react';
import { FileText, Download, Eye, Search, Calendar, Printer, Mail, X, Plus, Trash2 } from 'lucide-react';

interface ItemFactura {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

interface Factura {
  id: number;
  numero: string;
  fecha: string;
  cliente: {
    nombre: string;
    documento: string;
    direccion: string;
    email: string;
  };
  items: ItemFactura[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pagada' | 'pendiente' | 'vencida';
}

export default function Facturacion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('');
  const [showNuevaFactura, setShowNuevaFactura] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);

  // Estados para nueva factura
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteDocumento, setClienteDocumento] = useState('');
  const [clienteDireccion, setClienteDireccion] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [itemsNuevaFactura, setItemsNuevaFactura] = useState<ItemFactura[]>([
    { descripcion: '', cantidad: 1, precioUnitario: 0, total: 0 }
  ]);

  const [facturas, setFacturas] = useState<Factura[]>([
    {
      id: 1,
      numero: 'FAC-2026-001',
      fecha: '2026-04-23',
      cliente: {
        nombre: 'María García',
        documento: 'CC 1234567890',
        direccion: 'Calle 123 #45-67, Bogotá',
        email: 'maria@example.com'
      },
      items: [
        { descripcion: 'Algodón Rojo - 5 metros', cantidad: 5, precioUnitario: 25, total: 125 },
        { descripcion: 'Vestido Midi Floral', cantidad: 1, precioUnitario: 120, total: 120 }
      ],
      subtotal: 245,
      iva: 46.55,
      total: 291.55,
      estado: 'pagada'
    },
    {
      id: 2,
      numero: 'FAC-2026-002',
      fecha: '2026-04-23',
      cliente: {
        nombre: 'Carlos Rodríguez',
        documento: 'CC 9876543210',
        direccion: 'Carrera 45 #12-34, Medellín',
        email: 'carlos@example.com'
      },
      items: [
        { descripcion: 'Seda Azul - 3 metros', cantidad: 3, precioUnitario: 45, total: 135 },
        { descripcion: 'Camisa Clásica', cantidad: 2, precioUnitario: 65, total: 130 }
      ],
      subtotal: 265,
      iva: 50.35,
      total: 315.35,
      estado: 'pendiente'
    },
    {
      id: 3,
      numero: 'FAC-2026-003',
      fecha: '2026-04-20',
      cliente: {
        nombre: 'Ana López',
        documento: 'CC 5551234567',
        direccion: 'Avenida 80 #50-10, Cali',
        email: 'ana@example.com'
      },
      items: [
        { descripcion: 'Lino Verde - 8 metros', cantidad: 8, precioUnitario: 30, total: 240 }
      ],
      subtotal: 240,
      iva: 45.60,
      total: 285.60,
      estado: 'vencida'
    }
  ]);

  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         factura.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !filterEstado || factura.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const generarPDF = (factura: Factura) => {
    alert(`Generando PDF de la factura ${factura.numero}...`);
    // Aquí iría la lógica real para generar PDF
  };

  const enviarEmail = (factura: Factura) => {
    alert(`Enviando factura ${factura.numero} a ${factura.cliente.email}...`);
    // Aquí iría la lógica real para enviar email
  };

  const agregarItem = () => {
    setItemsNuevaFactura([...itemsNuevaFactura, { descripcion: '', cantidad: 1, precioUnitario: 0, total: 0 }]);
  };

  const eliminarItem = (index: number) => {
    setItemsNuevaFactura(itemsNuevaFactura.filter((_, i) => i !== index));
  };

  const actualizarItem = (index: number, field: keyof ItemFactura, value: any) => {
    const nuevosItems = [...itemsNuevaFactura];
    nuevosItems[index] = { ...nuevosItems[index], [field]: value };

    // Recalcular total del item
    if (field === 'cantidad' || field === 'precioUnitario') {
      nuevosItems[index].total = nuevosItems[index].cantidad * nuevosItems[index].precioUnitario;
    }

    setItemsNuevaFactura(nuevosItems);
  };

  const crearFactura = () => {
    if (!clienteNombre || !clienteDocumento || itemsNuevaFactura.some(item => !item.descripcion)) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const subtotal = itemsNuevaFactura.reduce((sum, item) => sum + item.total, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const nuevaFactura: Factura = {
      id: facturas.length + 1,
      numero: `FAC-2026-${String(facturas.length + 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      cliente: {
        nombre: clienteNombre,
        documento: clienteDocumento,
        direccion: clienteDireccion,
        email: clienteEmail
      },
      items: itemsNuevaFactura,
      subtotal,
      iva,
      total,
      estado: 'pendiente'
    };

    setFacturas([nuevaFactura, ...facturas]);

    // Resetear formulario
    setClienteNombre('');
    setClienteDocumento('');
    setClienteDireccion('');
    setClienteEmail('');
    setItemsNuevaFactura([{ descripcion: '', cantidad: 1, precioUnitario: 0, total: 0 }]);
    setShowNuevaFactura(false);

    alert(`Factura ${nuevaFactura.numero} creada exitosamente`);
  };

  const totalFacturado = facturas.reduce((sum, f) => sum + f.total, 0);
  const facturasPagadas = facturas.filter(f => f.estado === 'pagada').length;
  const facturasPendientes = facturas.filter(f => f.estado === 'pendiente').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Módulo de Facturación</h2>
          <p className="text-muted-foreground">Genera y gestiona facturas de venta</p>
        </div>
        <button
          onClick={() => setShowNuevaFactura(!showNuevaFactura)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
        >
          <FileText size={20} />
          Nueva Factura
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#24545A]/50 dark:to-[#24545A]/30 rounded-lg p-6 border border-blue-200 dark:border-[#5E8587]/40">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600 dark:text-[#5E8587]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{facturas.length}</p>
              <p className="text-sm text-muted-foreground">Total Facturas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-[#24545A]/70 dark:to-[#24545A]/50 rounded-lg p-6 border border-green-200 dark:border-[#5E8587]/60">
          <div className="flex items-center gap-3">
            <Calendar className="text-green-600 dark:text-[#5E8587]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{facturasPagadas}</p>
              <p className="text-sm text-muted-foreground">Pagadas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-[#B7654A]/25 dark:to-[#B7654A]/10 rounded-lg p-6 border border-amber-200 dark:border-[#B7654A]/40">
          <div className="flex items-center gap-3">
            <Calendar className="text-amber-600 dark:text-[#D08A70]" size={32} />
            <div>
              <p className="text-2xl text-foreground">{facturasPendientes}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-[#A98255]/25 dark:to-[#A98255]/10 rounded-lg p-6 border border-purple-200 dark:border-[#A98255]/40">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-600 dark:text-[#D8C2A8]" size={32} />
            <div>
              <p className="text-2xl text-foreground">${totalFacturado.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Facturado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nueva Factura */}
      {showNuevaFactura && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">Crear Nueva Factura</h3>
              <button
                onClick={() => setShowNuevaFactura(false)}
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Datos del Cliente */}
              <div>
                <h4 className="text-foreground mb-4">Datos del Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground mb-2">Nombre Completo *</label>
                    <input
                      type="text"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">Documento *</label>
                    <input
                      type="text"
                      value={clienteDocumento}
                      onChange={(e) => setClienteDocumento(e.target.value)}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ej: CC 1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">Dirección</label>
                    <input
                      type="text"
                      value={clienteDireccion}
                      onChange={(e) => setClienteDireccion(e.target.value)}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ej: Calle 123 #45-67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      value={clienteEmail}
                      onChange={(e) => setClienteEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ej: cliente@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Items de la Factura */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-foreground">Items de la Factura</h4>
                  <button
                    onClick={agregarItem}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:opacity-90 text-sm"
                  >
                    <Plus size={16} />
                    Agregar Item
                  </button>
                </div>

                <div className="space-y-3">
                  {itemsNuevaFactura.map((item, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-sm text-foreground mb-2">Descripción *</label>
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Ej: Tela Algodón Rojo - 5 metros"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm text-foreground mb-2">Cantidad</label>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => actualizarItem(index, 'cantidad', Number(e.target.value))}
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          min="1"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm text-foreground mb-2">Precio Unit.</label>
                        <input
                          type="number"
                          value={item.precioUnitario}
                          onChange={(e) => actualizarItem(index, 'precioUnitario', Number(e.target.value))}
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm text-foreground mb-2">Total</label>
                        <input
                          type="text"
                          value={`$${item.total.toFixed(2)}`}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg"
                          disabled
                        />
                      </div>
                      {itemsNuevaFactura.length > 1 && (
                        <button
                          onClick={() => eliminarItem(index)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors mb-0.5"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground">
                        ${itemsNuevaFactura.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">IVA (19%):</span>
                      <span className="text-foreground">
                        ${(itemsNuevaFactura.reduce((sum, item) => sum + item.total, 0) * 0.19).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-foreground font-medium">Total:</span>
                      <span className="text-primary text-xl font-medium">
                        ${(itemsNuevaFactura.reduce((sum, item) => sum + item.total, 0) * 1.19).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 justify-end border-t border-border pt-4">
                <button
                  onClick={() => setShowNuevaFactura(false)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearFactura}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Crear Factura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Factura Detallada */}
      {facturaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header de la Factura */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl text-foreground mb-2">YESMAU MODA</h1>
                  <p className="text-muted-foreground">Sistema de Gestión Textil</p>
                  <p className="text-sm text-muted-foreground">NIT: 900.123.456-7</p>
                  <p className="text-sm text-muted-foreground">Calle 123 #45-67, Bogotá</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl text-primary mb-2">FACTURA</h2>
                  <p className="text-foreground">{facturaSeleccionada.numero}</p>
                  <p className="text-sm text-muted-foreground">{facturaSeleccionada.fecha}</p>
                </div>
              </div>

              {/* Datos del Cliente */}
              <div className="mb-8 p-4 bg-secondary rounded-lg">
                <h3 className="text-foreground mb-3">Facturado a:</h3>
                <p className="text-foreground font-medium">{facturaSeleccionada.cliente.nombre}</p>
                <p className="text-sm text-muted-foreground">{facturaSeleccionada.cliente.documento}</p>
                <p className="text-sm text-muted-foreground">{facturaSeleccionada.cliente.direccion}</p>
                <p className="text-sm text-muted-foreground">{facturaSeleccionada.cliente.email}</p>
              </div>

              {/* Items */}
              <div className="mb-8">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-3 text-foreground">Descripción</th>
                      <th className="text-left px-4 py-3 text-foreground">Cantidad</th>
                      <th className="text-left px-4 py-3 text-foreground">Precio Unit.</th>
                      <th className="text-left px-4 py-3 text-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturaSeleccionada.items.map((item, idx) => (
                      <tr key={idx} className="border-t border-border">
                        <td className="px-4 py-3 text-foreground">{item.descripcion}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.cantidad}</td>
                        <td className="px-4 py-3 text-muted-foreground">${item.precioUnitario.toFixed(2)}</td>
                        <td className="px-4 py-3 text-foreground">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">${facturaSeleccionada.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">IVA (19%):</span>
                    <span className="text-foreground">${facturaSeleccionada.iva.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-foreground font-medium">Total:</span>
                    <span className="text-primary text-xl font-medium">${facturaSeleccionada.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => generarPDF(facturaSeleccionada)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Download size={18} />
                  Descargar PDF
                </button>
                <button
                  onClick={() => enviarEmail(facturaSeleccionada)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Mail size={18} />
                  Enviar por Email
                </button>
                <button
                  onClick={() => alert('Imprimiendo...')}
                  className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-accent"
                >
                  <Printer size={18} />
                  Imprimir
                </button>
                <button
                  onClick={() => setFacturaSeleccionada(null)}
                  className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar por número de factura o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los estados</option>
          <option value="pagada">Pagadas</option>
          <option value="pendiente">Pendientes</option>
          <option value="vencida">Vencidas</option>
        </select>
      </div>

      {/* Lista de Facturas */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3 text-foreground">Número</th>
              <th className="text-left px-6 py-3 text-foreground">Fecha</th>
              <th className="text-left px-6 py-3 text-foreground">Cliente</th>
              <th className="text-left px-6 py-3 text-foreground">Total</th>
              <th className="text-left px-6 py-3 text-foreground">Estado</th>
              <th className="text-left px-6 py-3 text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacturas.map((factura) => (
              <tr key={factura.id} className="border-t border-border hover:bg-secondary/50">
                <td className="px-6 py-4 text-foreground font-medium">{factura.numero}</td>
                <td className="px-6 py-4 text-muted-foreground">{factura.fecha}</td>
                <td className="px-6 py-4 text-foreground">{factura.cliente.nombre}</td>
                <td className="px-6 py-4 text-primary font-medium">${factura.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    factura.estado === 'pagada' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#5E8587]' :
                    factura.estado === 'pendiente' ? 'bg-amber-100 dark:bg-[#B7654A]/30 text-amber-700 dark:text-[#D08A70]' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#D08A70]'
                  }`}>
                    {factura.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFacturaSeleccionada(factura)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Ver factura"
                    >
                      <Eye size={18} className="text-foreground" />
                    </button>
                    <button
                      onClick={() => generarPDF(factura)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Descargar PDF"
                    >
                      <Download size={18} className="text-foreground" />
                    </button>
                    <button
                      onClick={() => enviarEmail(factura)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Enviar por email"
                    >
                      <Mail size={18} className="text-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
