import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface ImportarExcelProps {
  onClose: () => void;
  onImport: (productos: any[]) => void;
}

export default function ImportarExcel({ onClose, onImport }: ImportarExcelProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<{
    exitosos: number;
    errores: string[];
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea un archivo Excel
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

      if (!validExtensions.includes(fileExtension)) {
        alert('Por favor selecciona un archivo Excel válido (.xlsx, .xls o .csv)');
        return;
      }

      setArchivo(file);
      setResultado(null);
    }
  };

  const procesarArchivo = async () => {
    if (!archivo) return;

    setProcesando(true);
    setResultado(null);

    try {
      // Simular lectura del archivo
      // En producción, aquí usarías una librería como xlsx o papaparse
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;

          // Simulación de parseo CSV simple
          const lineas = text.split('\n');
          const headers = lineas[0].split(',').map(h => h.trim());

          const productosImportados: any[] = [];
          const errores: string[] = [];

          // Validar headers necesarios
          const headersRequeridos = ['nombre', 'tipo', 'precio', 'color'];
          const headersValidos = headersRequeridos.every(h =>
            headers.some(header => header.toLowerCase().includes(h))
          );

          if (!headersValidos) {
            errores.push('El archivo debe contener las columnas: nombre, tipo, precio, color');
            setResultado({ exitosos: 0, errores });
            setProcesando(false);
            return;
          }

          // Procesar cada línea (saltando el header)
          for (let i = 1; i < lineas.length; i++) {
            const linea = lineas[i].trim();
            if (!linea) continue;

            try {
              const valores = linea.split(',').map(v => v.trim());

              // Mapear valores a objeto producto
              const producto: any = {
                id: Date.now() + i,
                nombre: valores[0] || `Producto ${i}`,
                tipo: valores[1]?.toLowerCase() || 'telas',
                precio: parseFloat(valores[2]) || 0,
                color: valores[3] || 'Sin color',
                imagen: valores[4] || 'https://images.unsplash.com/photo-1558769132-cb1aea1c4c9a?w=400',
                isFavorite: false,
                calificacion: 4.5,
                numReviews: 0
              };

              // Validaciones
              if (!producto.nombre) {
                errores.push(`Línea ${i + 1}: Falta el nombre del producto`);
                continue;
              }

              if (producto.precio <= 0) {
                errores.push(`Línea ${i + 1}: Precio inválido para ${producto.nombre}`);
                continue;
              }

              // Agregar campos específicos según el tipo
              if (producto.tipo === 'telas') {
                producto.tipoTela = valores[5] || 'Algodón';
                producto.cantidadDisponible = parseInt(valores[6]) || 100;
              } else {
                producto.modelo = valores[5] || producto.nombre;
                producto.tipoTela = valores[6] || 'Algodón';
                producto.coloresDisponibles = [producto.color];
                producto.tallasDisponibles = ['S', 'M', 'L', 'XL'];
              }

              productosImportados.push(producto);
            } catch (error) {
              errores.push(`Línea ${i + 1}: Error al procesar datos`);
            }
          }

          // Guardar resultado
          setResultado({
            exitosos: productosImportados.length,
            errores
          });

          // Si hay productos exitosos, importarlos
          if (productosImportados.length > 0) {
            onImport(productosImportados);
          }

          setProcesando(false);
        } catch (error) {
          setResultado({
            exitosos: 0,
            errores: ['Error al procesar el archivo. Verifica que el formato sea correcto.']
          });
          setProcesando(false);
        }
      };

      reader.onerror = () => {
        setResultado({
          exitosos: 0,
          errores: ['Error al leer el archivo']
        });
        setProcesando(false);
      };

      reader.readAsText(archivo);
    } catch (error) {
      setResultado({
        exitosos: 0,
        errores: ['Error inesperado al procesar el archivo']
      });
      setProcesando(false);
    }
  };

  const descargarPlantilla = () => {
    // Crear contenido CSV de ejemplo
    const csvContent = `nombre,tipo,precio,color,imagen,tipoTela/modelo,cantidadDisponible
Algodón Premium,telas,25000,Blanco,https://images.unsplash.com/photo-1771098206944-ac1633b8276d?w=400,Algodón,150
Vestido Floral,vestidos,89000,Rosa,https://images.unsplash.com/photo-1637690048998-1e41c61c254d?w=400,Vestido Midi Floral,
Blusa Elegante,blusas,55000,Azul,https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400,Blusa Seda,
`;

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_productos.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-foreground">Importar Productos desde Excel</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instrucciones */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-foreground mb-2 flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-blue-500" />
              Instrucciones
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>El archivo debe ser formato Excel (.xlsx, .xls) o CSV (.csv)</li>
              <li>Debe incluir las columnas: nombre, tipo, precio, color</li>
              <li>Columnas opcionales: imagen, tipoTela/modelo, cantidadDisponible</li>
              <li>Los tipos válidos son: telas, vestidos, blusas, camisas, pantalones, faldas</li>
            </ul>
          </div>

          {/* Descargar Plantilla */}
          <button
            onClick={descargarPlantilla}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground py-3 rounded-lg transition-colors"
          >
            <Download size={18} />
            Descargar Plantilla de Ejemplo
          </button>

          {/* Selector de Archivo */}
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <Upload size={48} className="mx-auto text-muted-foreground mb-4" />

            {archivo ? (
              <div>
                <p className="text-foreground mb-2">{archivo.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(archivo.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-foreground mb-2">Click para seleccionar archivo</p>
                <p className="text-sm text-muted-foreground">
                  Formatos: .xlsx, .xls, .csv
                </p>
              </div>
            )}
          </div>

          {/* Botón de Procesar */}
          {archivo && !resultado && (
            <button
              onClick={procesarArchivo}
              disabled={procesando}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {procesando ? 'Procesando...' : 'Importar Productos'}
            </button>
          )}

          {/* Resultado */}
          {resultado && (
            <div className="space-y-4">
              {resultado.exitosos > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <h4 className="text-foreground">Importación Exitosa</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Se importaron {resultado.exitosos} producto(s) correctamente
                  </p>
                </div>
              )}

              {resultado.errores.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={18} className="text-destructive" />
                    <h4 className="text-foreground">Errores Encontrados</h4>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside max-h-40 overflow-y-auto">
                    {resultado.errores.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
