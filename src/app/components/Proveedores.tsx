import { useState } from 'react';
import { Truck, Plus, Search, MoreVertical, Mail, Phone, MapPin, Package, FileText, DollarSign, X, Download } from 'lucide-react';

type TabType = 'proveedores' | 'ordenes' | 'materiales' | 'cotizaciones';

interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  tipoServicio: string;
  estado: 'activo' | 'inactivo';
}

interface ItemOrdenCompra {
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precio: number;
}

interface OrdenCompra {
  id: string;
  proveedor: string;
  fecha: string;
  items: ItemOrdenCompra[];
  total: number;
  estado: 'pendiente' | 'enviado' | 'recibido' | 'cancelado';
}

interface Material {
  id: string;
  nombre: string;
  proveedor: string;
  precioUnitario: number;
  unidadMedida: string;
  tiempoEntrega: string;
  cantidadMinima: number;
}

interface Cotizacion {
  id: string;
  material: string;
  proveedores: { nombre: string; precio: number; tiempoEntrega: string }[];
  fecha: string;
  estado: 'solicitada' | 'recibida' | 'aceptada';
}

export default function Proveedores() {
  const [activeTab, setActiveTab] = useState<TabType>('proveedores');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'proveedor' | 'orden' | 'material' | 'cotizacion'>('proveedor');

  // Estados para nuevo proveedor
  const [nuevoProvNombre, setNuevoProvNombre] = useState('');
  const [nuevoProvContacto, setNuevoProvContacto] = useState('');
  const [nuevoProvEmail, setNuevoProvEmail] = useState('');
  const [nuevoProvTelefono, setNuevoProvTelefono] = useState('');
  const [nuevoProvDireccion, setNuevoProvDireccion] = useState('');
  const [nuevoProvServicio, setNuevoProvServicio] = useState('');

  // Estados para nueva orden
  const [nuevaOrdenProveedor, setNuevaOrdenProveedor] = useState('');
  const [nuevaOrdenItems, setNuevaOrdenItems] = useState<ItemOrdenCompra[]>([]);
  const [itemActual, setItemActual] = useState<ItemOrdenCompra>({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    unidad: '',
    precio: 0
  });

  // Estados para nuevo material
  const [nuevoMatNombre, setNuevoMatNombre] = useState('');
  const [nuevoMatProveedor, setNuevoMatProveedor] = useState('');
  const [nuevoMatPrecio, setNuevoMatPrecio] = useState(0);
  const [nuevoMatUnidad, setNuevoMatUnidad] = useState('');
  const [nuevoMatTiempo, setNuevoMatTiempo] = useState('');
  const [nuevoMatCantMin, setNuevoMatCantMin] = useState(0);

  const [proveedores, setProveedores] = useState<Proveedor[]>([
    { id: '1', nombre: 'TextilSur S.A.S', contacto: 'Carlos Mendez', email: 'carlos@textilsur.com', telefono: '300 123 4567', direccion: 'Calle 45 #23-10, Medellín', tipoServicio: 'Telas', estado: 'activo' },
    { id: '2', nombre: 'Hilos y Botones Ltda', contacto: 'Ana García', email: 'ana@hilosybotones.com', telefono: '301 234 5678', direccion: 'Carrera 12 #34-56, Bogotá', tipoServicio: 'Insumos', estado: 'activo' },
    { id: '3', nombre: 'Distribuidora Moda', contacto: 'Luis Torres', email: 'luis@dismoda.com', telefono: '302 345 6789', direccion: 'Av. 6 #15-20, Cali', tipoServicio: 'Accesorios', estado: 'activo' }
  ]);

  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([
    {
      id: 'OC-001',
      proveedor: 'TextilSur S.A.S',
      fecha: '2026-04-15',
      items: [
        { nombre: 'Tela Algodón Premium', descripcion: 'Tela de algodón 100% para prendas', cantidad: 150, unidad: 'metros', precio: 18000 },
        { nombre: 'Tela Seda', descripcion: 'Tela de seda natural importada', cantidad: 100, unidad: 'metros', precio: 28000 }
      ],
      total: 4500000,
      estado: 'recibido'
    },
    {
      id: 'OC-002',
      proveedor: 'Hilos y Botones Ltda',
      fecha: '2026-04-18',
      items: [
        { nombre: 'Hilo Poliéster', descripcion: 'Hilo poliéster resistente colores variados', cantidad: 500, unidad: 'rollos', precio: 850 },
        { nombre: 'Botones Nácar', descripcion: 'Botones de nácar natural 15mm', cantidad: 300, unidad: 'unidades', precio: 500 },
        { nombre: 'Cierres Metálicos', descripcion: 'Cierres metálicos 20cm', cantidad: 200, unidad: 'unidades', precio: 1200 }
      ],
      total: 850000,
      estado: 'enviado'
    },
    {
      id: 'OC-003',
      proveedor: 'Distribuidora Moda',
      fecha: '2026-04-20',
      items: [
        { nombre: 'Etiquetas Bordadas', descripcion: 'Etiquetas bordadas personalizadas', cantidad: 300, unidad: 'unidades', precio: 800 },
        { nombre: 'Empaque Premium', descripcion: 'Bolsas empaque premium con logo', cantidad: 200, unidad: 'unidades', precio: 400 }
      ],
      total: 320000,
      estado: 'pendiente'
    }
  ]);

  const [materiales, setMateriales] = useState<Material[]>([
    { id: '1', nombre: 'Tela Algodón Premium', proveedor: 'TextilSur S.A.S', precioUnitario: 18000, unidadMedida: 'metro', tiempoEntrega: '3-5 días', cantidadMinima: 50 },
    { id: '2', nombre: 'Hilo Poliéster', proveedor: 'Hilos y Botones Ltda', precioUnitario: 850, unidadMedida: 'rollo', tiempoEntrega: '1-2 días', cantidadMinima: 100 },
    { id: '3', nombre: 'Botones Nácar', proveedor: 'Hilos y Botones Ltda', precioUnitario: 500, unidadMedida: 'unidad', tiempoEntrega: '2-3 días', cantidadMinima: 200 }
  ]);

  const [cotizaciones] = useState<Cotizacion[]>([
    {
      id: 'COT-001',
      material: 'Tela Denim',
      proveedores: [
        { nombre: 'TextilSur S.A.S', precio: 22000, tiempoEntrega: '4 días' },
        { nombre: 'Textiles del Valle', precio: 20500, tiempoEntrega: '6 días' },
        { nombre: 'Importadora Textil', precio: 24000, tiempoEntrega: '3 días' }
      ],
      fecha: '2026-04-22',
      estado: 'recibida'
    }
  ]);

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setShowModal(true);
  };

  const resetFormularios = () => {
    setNuevoProvNombre('');
    setNuevoProvContacto('');
    setNuevoProvEmail('');
    setNuevoProvTelefono('');
    setNuevoProvDireccion('');
    setNuevoProvServicio('');
    setNuevaOrdenProveedor('');
    setNuevaOrdenItems([]);
    setItemActual({ nombre: '', descripcion: '', cantidad: 0, unidad: '', precio: 0 });
    setNuevoMatNombre('');
    setNuevoMatProveedor('');
    setNuevoMatPrecio(0);
    setNuevoMatUnidad('');
    setNuevoMatTiempo('');
    setNuevoMatCantMin(0);
  };

  const exportarOrdenesAExcel = () => {
    let csvContent = '﻿';
    csvContent += 'Orden ID,Fecha,Proveedor,Nombre,Descripción,Cantidad,Unidad,Precio Unitario,Subtotal,Estado\n';

    ordenes.forEach(orden => {
      orden.items.forEach(item => {
        const subtotal = item.cantidad * item.precio;
        const fila = [
          orden.id,
          orden.fecha,
          orden.proveedor,
          item.nombre,
          item.descripcion,
          item.cantidad,
          item.unidad,
          item.precio,
          subtotal,
          orden.estado
        ];

        const filaEscapada = fila.map(campo => {
          const campoStr = String(campo);
          if (campoStr.includes(',') || campoStr.includes('"') || campoStr.includes('\n')) {
            return `"${campoStr.replace(/"/g, '""')}"`;
          }
          return campoStr;
        });

        csvContent += filaEscapada.join(',') + '\n';
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `ordenes_compra_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('Órdenes exportadas exitosamente');
  };

  const agregarItemOrden = () => {
    if (!itemActual.nombre || !itemActual.descripcion || itemActual.cantidad <= 0 || !itemActual.unidad || itemActual.precio <= 0) {
      alert('Por favor completa todos los campos del item');
      return;
    }
    setNuevaOrdenItems([...nuevaOrdenItems, itemActual]);
    setItemActual({ nombre: '', descripcion: '', cantidad: 0, unidad: '', precio: 0 });
  };

  const eliminarItemOrden = (index: number) => {
    setNuevaOrdenItems(nuevaOrdenItems.filter((_, i) => i !== index));
  };

  const crearOrdenCompra = () => {
    if (!nuevaOrdenProveedor) {
      alert('Selecciona un proveedor');
      return;
    }
    if (nuevaOrdenItems.length === 0) {
      alert('Agrega al menos un item a la orden');
      return;
    }

    const total = nuevaOrdenItems.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
    const nuevaOrden: OrdenCompra = {
      id: `OC-${String(ordenes.length + 1).padStart(3, '0')}`,
      proveedor: nuevaOrdenProveedor,
      fecha: new Date().toISOString().split('T')[0],
      items: nuevaOrdenItems,
      total,
      estado: 'pendiente'
    };

    setOrdenes([...ordenes, nuevaOrden]);
    setShowModal(false);
    resetFormularios();
    alert('Orden creada exitosamente');
  };

  const crearProveedor = () => {
    if (!nuevoProvNombre || !nuevoProvEmail) {
      alert('Por favor completa los campos obligatorios (Nombre y Email)');
      return;
    }

    const nuevoProveedor: Proveedor = {
      id: String(proveedores.length + 1),
      nombre: nuevoProvNombre,
      contacto: nuevoProvContacto,
      email: nuevoProvEmail,
      telefono: nuevoProvTelefono,
      direccion: nuevoProvDireccion,
      tipoServicio: nuevoProvServicio,
      estado: 'activo'
    };

    setProveedores([...proveedores, nuevoProveedor]);
    resetFormularios();
    setShowModal(false);
    alert('Proveedor registrado exitosamente');
  };

  const crearMaterial = () => {
    if (!nuevoMatNombre || !nuevoMatProveedor) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const nuevoMaterial: Material = {
      id: String(materiales.length + 1),
      nombre: nuevoMatNombre,
      proveedor: nuevoMatProveedor,
      precioUnitario: nuevoMatPrecio,
      unidadMedida: nuevoMatUnidad,
      tiempoEntrega: nuevoMatTiempo,
      cantidadMinima: nuevoMatCantMin
    };

    setMateriales([...materiales, nuevoMaterial]);
    resetFormularios();
    setShowModal(false);
    alert('Material registrado exitosamente');
  };

  const estadoColors = {
    activo: 'bg-green-100 text-green-800 dark:bg-[#24545A] dark:text-[#D8C2A8]',
    inactivo: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    pendiente: 'bg-amber-100 text-amber-800 dark:bg-[#B7654A]/30 dark:text-[#D08A70]',
    enviado: 'bg-blue-100 text-blue-800 dark:bg-[#24545A]/60 dark:text-[#D8C2A8]',
    recibido: 'bg-green-100 text-green-800 dark:bg-[#24545A] dark:text-[#D8C2A8]',
    cancelado: 'bg-red-100 text-red-800 dark:bg-[#B7654A]/45 dark:text-[#F5EEE4]',
    solicitada: 'bg-amber-100 text-amber-800 dark:bg-[#B7654A]/30 dark:text-[#D08A70]',
    recibida: 'bg-blue-100 text-blue-800 dark:bg-[#24545A]/60 dark:text-[#D8C2A8]',
    aceptada: 'bg-green-100 text-green-800 dark:bg-[#24545A] dark:text-[#D8C2A8]'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Gestión de Proveedores</h2>
          <p className="text-sm text-muted-foreground">Administra proveedores, órdenes de compra y materiales</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'ordenes' && (
            <button
              onClick={exportarOrdenesAExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download size={20} />
              Exportar a Excel
            </button>
          )}
          <button
            onClick={() => openModal(activeTab === 'proveedores' ? 'proveedor' : activeTab === 'ordenes' ? 'orden' : activeTab === 'materiales' ? 'material' : 'cotizacion')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            {activeTab === 'proveedores' ? 'Nuevo Proveedor' : activeTab === 'ordenes' ? 'Nueva Orden' : activeTab === 'materiales' ? 'Nuevo Material' : 'Nueva Cotización'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('proveedores')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'proveedores'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Proveedores
        </button>
        <button
          onClick={() => setActiveTab('ordenes')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'ordenes'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Órdenes de Compra
        </button>
        <button
          onClick={() => setActiveTab('materiales')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'materiales'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Materiales
        </button>
        <button
          onClick={() => setActiveTab('cotizaciones')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'cotizaciones'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Cotizaciones
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder={`Buscar ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Vista de Proveedores */}
      {activeTab === 'proveedores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proveedores.map((proveedor) => (
            <div key={proveedor.id} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground">{proveedor.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{proveedor.tipoServicio}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{proveedor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{proveedor.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{proveedor.direccion}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs ${estadoColors[proveedor.estado]}`}>
                  {proveedor.estado}
                </span>
                <span className="text-sm text-muted-foreground">{proveedor.contacto}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Órdenes */}
      {activeTab === 'ordenes' && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 text-sm text-muted-foreground">ID</th>
                <th className="text-left p-4 text-sm text-muted-foreground">Proveedor</th>
                <th className="text-left p-4 text-sm text-muted-foreground">Fecha</th>
                <th className="text-left p-4 text-sm text-muted-foreground">Items</th>
                <th className="text-left p-4 text-sm text-muted-foreground">Total Items</th>
                <th className="text-left p-4 text-sm text-muted-foreground">Total</th>
                <th className="text-left p-4 text-sm text-muted-foreground">Estado</th>
                <th className="text-left p-4 text-sm text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="p-4 text-sm text-foreground">{orden.id}</td>
                  <td className="p-4 text-sm text-foreground">{orden.proveedor}</td>
                  <td className="p-4 text-sm text-muted-foreground">{orden.fecha}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    <div className="space-y-1">
                      {orden.items.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          • {item.nombre} ({item.cantidad} {item.unidad})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">{orden.items.length}</td>
                  <td className="p-4 text-sm text-foreground">${orden.total.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${estadoColors[orden.estado]}`}>
                      {orden.estado}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Vista de Materiales */}
      {activeTab === 'materiales' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materiales.map((material) => (
            <div key={material.id} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground">{material.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{material.proveedor}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Precio Unitario</p>
                  <p className="text-sm text-foreground">${material.precioUnitario.toLocaleString()}/{material.unidadMedida}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tiempo de Entrega</p>
                  <p className="text-sm text-foreground">{material.tiempoEntrega}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cantidad Mínima</p>
                  <p className="text-sm text-foreground">{material.cantidadMinima} {material.unidadMedida}s</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Cotizaciones */}
      {activeTab === 'cotizaciones' && (
        <div className="space-y-4">
          {cotizaciones.map((cotizacion) => (
            <div key={cotizacion.id} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-foreground mb-1">Cotización {cotizacion.id}</h3>
                  <p className="text-sm text-muted-foreground">Material: {cotizacion.material}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${estadoColors[cotizacion.estado]}`}>
                  {cotizacion.estado}
                </span>
              </div>

              <div className="space-y-2">
                {cotizacion.proveedores.map((prov, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <span className="text-sm text-foreground">{prov.nombre}</span>
                    <div className="text-right">
                      <p className="text-sm text-primary">${prov.precio.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{prov.tiempoEntrega}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-4">Fecha: {cotizacion.fecha}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nuevo Proveedor */}
      {showModal && modalType === 'proveedor' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">Nuevo Proveedor</h3>
              <button onClick={() => { setShowModal(false); resetFormularios(); }} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">Nombre del Proveedor *</label>
                  <input type="text" value={nuevoProvNombre} onChange={(e) => setNuevoProvNombre(e.target.value)} placeholder="Ej: TextilSur S.A.S" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Persona de Contacto *</label>
                  <input type="text" value={nuevoProvContacto} onChange={(e) => setNuevoProvContacto(e.target.value)} placeholder="Ej: Carlos Mendez" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Email *</label>
                  <input type="email" value={nuevoProvEmail} onChange={(e) => setNuevoProvEmail(e.target.value)} placeholder="Ej: contacto@proveedor.com" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Teléfono</label>
                  <input type="text" value={nuevoProvTelefono} onChange={(e) => setNuevoProvTelefono(e.target.value)} placeholder="Ej: 300 123 4567" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-foreground mb-2">Dirección</label>
                  <input type="text" value={nuevoProvDireccion} onChange={(e) => setNuevoProvDireccion(e.target.value)} placeholder="Ej: Calle 45 #23-10, Medellín" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Tipo de Servicio</label>
                  <select value={nuevoProvServicio} onChange={(e) => setNuevoProvServicio(e.target.value)} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Seleccionar...</option>
                    <option value="Telas">Telas</option>
                    <option value="Insumos">Insumos</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 border-t border-border pt-4">
                <button onClick={() => { setShowModal(false); resetFormularios(); }} className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent">Cancelar</button>
                <button onClick={crearProveedor} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Registrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Orden */}
      {showModal && modalType === 'orden' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">Nueva Orden de Compra</h3>
              <button onClick={() => { setShowModal(false); resetFormularios(); }} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm text-foreground mb-2">Proveedor *</label>
                <select
                  value={nuevaOrdenProveedor}
                  onChange={(e) => setNuevaOrdenProveedor(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar proveedor...</option>
                  {proveedores.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                </select>
              </div>

              <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                <h4 className="text-foreground mb-3 flex items-center gap-2">
                  <Plus size={18} />
                  Agregar Item
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={itemActual.nombre}
                      onChange={(e) => setItemActual({ ...itemActual, nombre: e.target.value })}
                      placeholder="Ej: Tela Algodón Premium"
                      className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Descripción *</label>
                    <input
                      type="text"
                      value={itemActual.descripcion}
                      onChange={(e) => setItemActual({ ...itemActual, descripcion: e.target.value })}
                      placeholder="Descripción del producto"
                      className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Cantidad *</label>
                    <input
                      type="number"
                      value={itemActual.cantidad || ''}
                      onChange={(e) => setItemActual({ ...itemActual, cantidad: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Unidad *</label>
                    <select
                      value={itemActual.unidad}
                      onChange={(e) => setItemActual({ ...itemActual, unidad: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="metros">Metros</option>
                      <option value="unidades">Unidades</option>
                      <option value="rollos">Rollos</option>
                      <option value="kilos">Kilos</option>
                      <option value="cajas">Cajas</option>
                      <option value="pares">Pares</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Precio Unitario (COP) *</label>
                    <input
                      type="number"
                      value={itemActual.precio || ''}
                      onChange={(e) => setItemActual({ ...itemActual, precio: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={agregarItemOrden}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Agregar Item
                    </button>
                  </div>
                </div>
              </div>

              {nuevaOrdenItems.length > 0 && (
                <div>
                  <h4 className="text-foreground mb-3">Items de la Orden ({nuevaOrdenItems.length})</h4>
                  <div className="space-y-2">
                    {nuevaOrdenItems.map((item, index) => (
                      <div key={index} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Nombre</p>
                            <p className="text-foreground">{item.nombre}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Descripción</p>
                            <p className="text-foreground truncate">{item.descripcion}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Cantidad</p>
                            <p className="text-foreground">{item.cantidad} {item.unidad}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Precio Unit.</p>
                            <p className="text-foreground">${item.precio.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Subtotal</p>
                            <p className="text-primary">${(item.cantidad * item.precio).toLocaleString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => eliminarItemOrden(index)}
                          className="ml-4 text-red-500 hover:text-red-600 p-2"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-secondary/50 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-foreground">Total de la Orden:</span>
                    <span className="text-xl text-primary">
                      ${nuevaOrdenItems.reduce((sum, item) => sum + (item.cantidad * item.precio), 0).toLocaleString()} COP
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 border-t border-border pt-4">
                <button
                  onClick={() => { setShowModal(false); resetFormularios(); }}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearOrdenCompra}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Crear Orden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Material */}
      {showModal && modalType === 'material' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground">Nuevo Material</h3>
              <button onClick={() => { setShowModal(false); resetFormularios(); }} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">Nombre del Material *</label>
                  <input type="text" value={nuevoMatNombre} onChange={(e) => setNuevoMatNombre(e.target.value)} placeholder="Ej: Tela Algodón Premium" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Proveedor *</label>
                  <select value={nuevoMatProveedor} onChange={(e) => setNuevoMatProveedor(e.target.value)} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Seleccionar...</option>
                    {proveedores.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Precio Unitario</label>
                  <input type="number" value={nuevoMatPrecio} onChange={(e) => setNuevoMatPrecio(Number(e.target.value))} min="0" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Unidad de Medida</label>
                  <input type="text" value={nuevoMatUnidad} onChange={(e) => setNuevoMatUnidad(e.target.value)} placeholder="metro, rollo, unidad..." className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Tiempo de Entrega</label>
                  <input type="text" value={nuevoMatTiempo} onChange={(e) => setNuevoMatTiempo(e.target.value)} placeholder="Ej: 3-5 días" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Cantidad Mínima</label>
                  <input type="number" value={nuevoMatCantMin} onChange={(e) => setNuevoMatCantMin(Number(e.target.value))} min="0" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div className="flex gap-3 border-t border-border pt-4">
                <button onClick={() => { setShowModal(false); resetFormularios(); }} className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent">Cancelar</button>
                <button onClick={crearMaterial} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Registrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
