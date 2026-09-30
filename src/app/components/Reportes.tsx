import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Users, ShoppingCart, Download, Calendar, Filter } from 'lucide-react';

export default function Reportes() {
  const [tipoReporte, setTipoReporte] = useState<'ventas' | 'inventario' | 'clientes' | 'financiero'>('ventas');
  const [periodoInicio, setPeriodoInicio] = useState('2026-04-01');
  const [periodoFin, setPeriodoFin] = useState('2026-04-28');

  // Datos de ejemplo para reportes
  const ventasMensuales = [
    { mes: 'Enero', ventas: 125000, ordenes: 45 },
    { mes: 'Febrero', ventas: 145000, ordenes: 52 },
    { mes: 'Marzo', ventas: 165000, ordenes: 61 },
    { mes: 'Abril', ventas: 185000, ordenes: 68 }
  ];

  const productosTopVentas = [
    { nombre: 'Vestido Floral', unidades: 156, ingresos: 13920 },
    { nombre: 'Camisa Clásica', unidades: 142, ingresos: 9230 },
    { nombre: 'Pantalón Denim', unidades: 128, ingresos: 9600 },
    { nombre: 'Blusa Elegante', unidades: 115, ingresos: 7475 },
    { nombre: 'Falda Midi', unidades: 98, ingresos: 5390 }
  ];

  const estadisticasGenerales = {
    ventasTotales: 620000,
    ordenesTotales: 226,
    clientesActivos: 87,
    ticketPromedio: 2743,
    crecimientoMes: 12.1,
    productosMasVendidos: 5,
    inventarioTotal: 1248,
    inventarioBajo: 23
  };

  const reporteInventario = [
    { categoria: 'Telas', cantidad: 450, valor: 112500, porcentaje: 36 },
    { categoria: 'Vestidos', cantidad: 234, valor: 187200, porcentaje: 19 },
    { categoria: 'Camisas', cantidad: 198, valor: 128700, porcentaje: 16 },
    { categoria: 'Pantalones', cantidad: 186, valor: 139500, porcentaje: 15 },
    { categoria: 'Faldas', cantidad: 180, valor: 99000, porcentaje: 14 }
  ];

  const clientesTop = [
    { nombre: 'María García', compras: 15, total: 45000, ultimaCompra: '2026-04-25' },
    { nombre: 'Carlos Rodríguez', compras: 12, total: 38000, ultimaCompra: '2026-04-23' },
    { nombre: 'Ana López', compras: 10, total: 32000, ultimaCompra: '2026-04-26' },
    { nombre: 'Pedro Martínez', compras: 9, total: 28500, ultimaCompra: '2026-04-20' },
    { nombre: 'Laura Sánchez', compras: 8, total: 25000, ultimaCompra: '2026-04-27' }
  ];

  const generarReporte = () => {
    alert(`Generando reporte de ${tipoReporte} del ${periodoInicio} al ${periodoFin}...`);
    // Aquí iría la lógica real para generar el reporte
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Reportes y Analíticas</h2>
          <p className="text-muted-foreground">Análisis detallado del rendimiento del negocio</p>
        </div>
        <button
          onClick={generarReporte}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Download size={20} />
          Exportar Reporte
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-foreground mb-2">Tipo de Reporte</label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value as any)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ventas">Ventas</option>
              <option value="inventario">Inventario</option>
              <option value="clientes">Clientes</option>
              <option value="financiero">Financiero</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground mb-2">Fecha Fin</label>
            <input
              type="date"
              value={periodoFin}
              onChange={(e) => setPeriodoFin(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-accent">
              <Filter size={18} />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#24545A]/50 dark:to-[#24545A]/30 rounded-lg p-6 border border-blue-200 dark:border-[#5E8587]/40">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-blue-600 dark:text-[#5E8587]" size={32} />
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#5E8587] px-2 py-1 rounded-full">
              +{estadisticasGenerales.crecimientoMes}%
            </span>
          </div>
          <p className="text-2xl text-foreground mb-1">${estadisticasGenerales.ventasTotales.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Ventas Totales</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-[#24545A]/70 dark:to-[#24545A]/50 rounded-lg p-6 border border-green-200 dark:border-[#5E8587]/60">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="text-green-600 dark:text-[#5E8587]" size={32} />
          </div>
          <p className="text-2xl text-foreground mb-1">{estadisticasGenerales.ordenesTotales}</p>
          <p className="text-sm text-muted-foreground">Órdenes Completadas</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-[#A98255]/25 dark:to-[#A98255]/10 rounded-lg p-6 border border-purple-200 dark:border-[#A98255]/40">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-purple-600 dark:text-[#D8C2A8]" size={32} />
          </div>
          <p className="text-2xl text-foreground mb-1">{estadisticasGenerales.clientesActivos}</p>
          <p className="text-sm text-muted-foreground">Clientes Activos</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-[#B7654A]/25 dark:to-[#B7654A]/10 rounded-lg p-6 border border-amber-200 dark:border-[#B7654A]/40">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-amber-600 dark:text-[#D08A70]" size={32} />
          </div>
          <p className="text-2xl text-foreground mb-1">${estadisticasGenerales.ticketPromedio.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Ticket Promedio</p>
        </div>
      </div>

      {/* Reportes por Tipo */}
      {tipoReporte === 'ventas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ventas Mensuales */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              Ventas Mensuales
            </h3>
            <div className="space-y-3">
              {ventasMensuales.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-1">{item.mes}</p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(item.ventas / 200000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm text-foreground">${item.ventas.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.ordenes} órdenes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Productos */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <Package size={20} className="text-primary" />
              Top 5 Productos
            </h3>
            <div className="space-y-3">
              {productosTopVentas.map((producto, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{producto.nombre}</p>
                      <p className="text-xs text-muted-foreground">{producto.unidades} unidades</p>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-medium">${producto.ingresos.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tipoReporte === 'inventario' && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground flex items-center gap-2">
              <Package size={20} className="text-primary" />
              Resumen de Inventario
            </h3>
          </div>
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-3 text-foreground">Categoría</th>
                <th className="text-left px-6 py-3 text-foreground">Cantidad</th>
                <th className="text-left px-6 py-3 text-foreground">Valor</th>
                <th className="text-left px-6 py-3 text-foreground">% del Total</th>
                <th className="text-left px-6 py-3 text-foreground">Distribución</th>
              </tr>
            </thead>
            <tbody>
              {reporteInventario.map((item, idx) => (
                <tr key={idx} className="border-t border-border hover:bg-secondary/50">
                  <td className="px-6 py-4 text-foreground font-medium">{item.categoria}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.cantidad}</td>
                  <td className="px-6 py-4 text-primary">${item.valor.toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.porcentaje}%</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tipoReporte === 'clientes' && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-foreground flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Top Clientes
            </h3>
          </div>
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-3 text-foreground">Cliente</th>
                <th className="text-left px-6 py-3 text-foreground">Compras</th>
                <th className="text-left px-6 py-3 text-foreground">Total Gastado</th>
                <th className="text-left px-6 py-3 text-foreground">Última Compra</th>
                <th className="text-left px-6 py-3 text-foreground">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {clientesTop.map((cliente, idx) => (
                <tr key={idx} className="border-t border-border hover:bg-secondary/50">
                  <td className="px-6 py-4 text-foreground font-medium">{cliente.nombre}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cliente.compras}</td>
                  <td className="px-6 py-4 text-primary font-medium">${cliente.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cliente.ultimaCompra}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      cliente.total > 40000
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-[#D8C2A8]'
                        : cliente.total > 30000
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-[#5E8587]'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#5E8587]'
                    }`}>
                      {cliente.total > 40000 ? 'VIP' : cliente.total > 30000 ? 'Premium' : 'Regular'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tipoReporte === 'financiero' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-foreground mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-primary" />
              Resumen Financiero
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-[#24545A]/50 dark:bg-green-900/20 rounded-lg">
                <span className="text-foreground">Ingresos Totales</span>
                <span className="text-2xl text-green-600 dark:text-[#5E8587] font-bold">
                  ${estadisticasGenerales.ventasTotales.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-[#24545A]/40 dark:bg-blue-900/20 rounded-lg">
                <span className="text-foreground">Promedio Diario</span>
                <span className="text-2xl text-blue-600 dark:text-[#5E8587] font-bold">
                  ${Math.round(estadisticasGenerales.ventasTotales / 28).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-foreground">Proyección Mensual</span>
                <span className="text-2xl text-purple-600 dark:text-[#D8C2A8] font-bold">
                  ${Math.round(estadisticasGenerales.ventasTotales * 1.121).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-foreground mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Indicadores Clave
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">Tasa de Conversión</span>
                  <span className="text-sm text-primary font-medium">34.5%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '34.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">Satisfacción del Cliente</span>
                  <span className="text-sm text-green-600 dark:text-[#5E8587] font-medium">92%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">Retención de Clientes</span>
                  <span className="text-sm text-blue-600 dark:text-[#5E8587] font-medium">78%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">Cumplimiento de Entregas</span>
                  <span className="text-sm text-purple-600 dark:text-[#D8C2A8] font-medium">96%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
