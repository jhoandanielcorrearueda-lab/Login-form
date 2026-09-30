import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

interface WhatsAppFloatProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppFloat({
  phoneNumber = '573001234567', // Número de WhatsApp por defecto (Colombia)
  message = 'Hola, estoy interesado en sus productos'
}: WhatsAppFloatProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleWhatsAppClick = () => {
    // Formatear el número (eliminar espacios, guiones, etc.)
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Tooltip */}
      {showTooltip && (
        <div className="fixed bottom-24 right-6 bg-card border border-border rounded-lg shadow-lg p-3 max-w-xs z-40 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm text-foreground font-medium">¿Necesitas ayuda?</p>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Chatea con nosotros por WhatsApp
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            Iniciar Chat
          </button>
        </div>
      )}

      {/* Botón Flotante */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group animate-bounce hover:animate-none"
        title="Chatea con nosotros"
      >
        <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />

        {/* Pulso animado */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
      </button>
    </>
  );
}
