import { useState, useEffect } from 'react';
import { ChevronDown, ShoppingBag, User, Menu, X, Moon, Sun, ShoppingCart, Package, Bell } from 'lucide-react';
import Notificaciones from './Notificaciones';

interface PublicNavbarProps {
  onNavigate: (section: string) => void;
  onLoginClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  carritoCount?: number;
  currentSection?: string;
}

export default function PublicNavbar({ onNavigate, onLoginClick, darkMode, onToggleDarkMode, carritoCount = 0, currentSection = 'home' }: PublicNavbarProps) {
  const articulosSections = ['telas', 'vestidos', 'camisas', 'pantalones', 'faldas'];
  const isActive = (section: string) => currentSection === section;
  const isArticulosActive = articulosSections.includes(currentSection);
  const [showArticulosMenu, setShowArticulosMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    const verificarNotificaciones = () => {
      const saved = localStorage.getItem('notificaciones');
      if (saved) {
        const notificaciones = JSON.parse(saved);
        const noLeidas = notificaciones.filter((n: any) => !n.leida).length;
        setNotificacionesCount(noLeidas);
      }
    };

    verificarNotificaciones();
    const interval = setInterval(verificarNotificaciones, 5000);
    return () => clearInterval(interval);
  }, []);

  const articulosItems = [
    { id: 'telas', label: 'Telas' },
    { id: 'vestidos', label: 'Vestidos' },
    { id: 'camisas', label: 'Camisas' },
    { id: 'pantalones', label: 'Pantalones' },
    { id: 'faldas', label: 'Faldas' }
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="text-primary dark:text-white" size={28} />
              <span className="text-xl text-primary dark:text-white">YESMAU MODA</span>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`relative pb-1 transition-colors ${isActive('home') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
            >
              Inicio
              {isActive('home') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
            </button>

            {/* Artículos Disponibles Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowArticulosMenu(!showArticulosMenu)}
                onMouseEnter={() => setShowArticulosMenu(true)}
                className={`relative pb-1 flex items-center gap-1 transition-colors ${isArticulosActive ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                Artículos Disponibles
                <ChevronDown size={16} className={`transition-transform ${showArticulosMenu ? 'rotate-180' : ''}`} />
                {isArticulosActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
              </button>

              {showArticulosMenu && (
                <div
                  onMouseLeave={() => setShowArticulosMenu(false)}
                  className="absolute top-full right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-2"
                >
                  {articulosItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setShowArticulosMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 transition-colors ${isActive(item.id) ? 'text-primary bg-secondary' : 'text-foreground hover:bg-secondary'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('retazos')}
              className={`relative pb-1 transition-colors ${isActive('retazos') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
            >
              Retazos
              {isActive('retazos') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
            </button>

            <button
              onClick={() => onNavigate('pedidos')}
              className={`relative pb-1 flex items-center gap-2 transition-colors ${isActive('pedidos') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
            >
              <Package size={18} />
              Mis Pedidos
              {isActive('pedidos') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
            </button>

            <button
              onClick={() => setShowNotificaciones(!showNotificaciones)}
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Notificaciones"
            >
              <Bell size={20} className="text-foreground" />
              {notificacionesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificacionesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('carrito')}
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Ver Carrito"
            >
              <ShoppingCart size={20} className="text-foreground" />
              {carritoCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {carritoCount}
                </span>
              )}
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {darkMode ? <Sun size={20} className="text-foreground" /> : <Moon size={20} className="text-foreground" />}
            </button>

            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <User size={18} />
              Iniciar Sesión
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-foreground hover:bg-secondary rounded-lg"
              >
                Inicio
              </button>

              <div>
                <button
                  onClick={() => setShowArticulosMenu(!showArticulosMenu)}
                  className="w-full flex items-center justify-between px-4 py-2 text-foreground hover:bg-secondary rounded-lg"
                >
                  Artículos Disponibles
                  <ChevronDown size={16} className={`transition-transform ${showArticulosMenu ? 'rotate-180' : ''}`} />
                </button>
                {showArticulosMenu && (
                  <div className="ml-4 mt-2 space-y-2">
                    {articulosItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setMobileMenuOpen(false);
                          setShowArticulosMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  onNavigate('nosotros');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-foreground hover:bg-secondary rounded-lg"
              >
                Nosotros
              </button>

              <button
                onClick={() => {
                  onNavigate('retazos');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-foreground hover:bg-secondary rounded-lg"
              >
                Retazos
              </button>

              <button
                onClick={() => {
                  onNavigate('pedidos');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-secondary rounded-lg"
              >
                <Package size={18} />
                Mis Pedidos
              </button>

              <button
                onClick={() => {
                  setShowNotificaciones(!showNotificaciones);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-4 py-2 text-foreground hover:bg-secondary rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <Bell size={18} />
                  Notificaciones
                </span>
                {notificacionesCount > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
                    {notificacionesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onNavigate('carrito');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-4 py-2 text-foreground hover:bg-secondary rounded-lg"
              >
                <span>Mi Carrito</span>
                <div className="flex items-center gap-2">
                  {carritoCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                      {carritoCount}
                    </span>
                  )}
                  <ShoppingCart size={18} />
                </div>
              </button>

              <button
                onClick={onToggleDarkMode}
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-secondary rounded-lg"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? 'Modo claro' : 'Modo oscuro'}
              </button>

              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 mx-4"
              >
                <User size={18} />
                Iniciar Sesión
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panel de Notificaciones */}
      {showNotificaciones && (
        <div className="absolute top-full right-4 mt-2 z-50">
          <Notificaciones onClose={() => setShowNotificaciones(false)} />
        </div>
      )}
    </nav>
  );
}
