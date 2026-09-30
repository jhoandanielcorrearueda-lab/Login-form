import { useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, FileText, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface User {
  email: string;
  password: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  address: string;
  city: string;
  role: string;
  estado: string;
}

interface PerfilProps {
  currentUser: User;
  onUpdateProfile: (email: string, updatedData: Partial<User>) => void;
}

export default function Perfil({ currentUser, onUpdateProfile }: PerfilProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    phone: currentUser.phone,
    address: currentUser.address,
    city: currentUser.city,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = () => {
    // Validar que si se quiere cambiar la contraseña, se hayan llenado todos los campos
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Ingresa tu contraseña actual para cambiarla' });
        return;
      }

      if (formData.currentPassword !== currentUser.password) {
        setMessage({ type: 'error', text: 'La contraseña actual es incorrecta' });
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
        return;
      }

      if (formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
        return;
      }

      // Actualizar con nueva contraseña
      onUpdateProfile(currentUser.email, {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        password: formData.newPassword
      });

      setMessage({ type: 'success', text: 'Perfil y contraseña actualizados correctamente' });
    } else {
      // Actualizar solo información del perfil
      onUpdateProfile(currentUser.email, {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city
      });

      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    }

    setIsEditing(false);
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setFormData({
      fullName: currentUser.fullName,
      phone: currentUser.phone,
      address: currentUser.address,
      city: currentUser.city,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground">Mi Perfil</h2>
          <p className="text-sm text-muted-foreground">Administra tu información personal</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {/* Mensaje */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-[#24545A]/50 border-green-200 text-green-800 dark:bg-[#24545A]/50 dark:border-[#5E8587]/40 dark:text-[#5E8587]'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-[#B7654A]/35 dark:border-[#B7654A]/50 dark:text-[#D08A70]'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' && <CheckCircle size={18} />}
            <span className="text-sm">{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Información Personal */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <h3 className="text-foreground mb-6">Información Personal</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Nombre Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-foreground">
                    <UserIcon size={18} className="text-muted-foreground" />
                    <span>{currentUser.fullName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Correo Electrónico</label>
                <div className="flex items-center gap-2 text-foreground">
                  <Mail size={18} className="text-muted-foreground" />
                  <span>{currentUser.email}</span>
                  <span className="text-xs text-muted-foreground">(no editable)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tipo de Documento</label>
                <div className="flex items-center gap-2 text-foreground">
                  <FileText size={18} className="text-muted-foreground" />
                  <span>{currentUser.documentType}</span>
                  <span className="text-xs text-muted-foreground">(no editable)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Número de Documento</label>
                <div className="flex items-center gap-2 text-foreground">
                  <span>{currentUser.documentNumber}</span>
                  <span className="text-xs text-muted-foreground">(no editable)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Teléfono</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone size={18} className="text-muted-foreground" />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Ciudad</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin size={18} className="text-muted-foreground" />
                    <span>{currentUser.city}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Dirección</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin size={18} className="text-muted-foreground" />
                  <span>{currentUser.address}</span>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-foreground mb-4">Cambiar Contraseña (Opcional)</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Contraseña Actual</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Confirmar Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveChanges}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg transition-colors"
              >
                Guardar Cambios
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Card de Información de Cuenta */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-foreground mb-4">Información de Cuenta</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Rol</p>
                <p className="text-sm text-foreground capitalize">{currentUser.role}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  currentUser.estado === 'activo'
                    ? 'bg-green-100 text-green-800 dark:bg-[#24545A] dark:text-[#D8C2A8]'
                    : currentUser.estado === 'bloqueado'
                    ? 'bg-red-100 text-red-800 dark:bg-[#B7654A]/45 dark:text-[#F5EEE4]'
                    : 'bg-amber-100 text-amber-800 dark:bg-[#B7654A]/30 dark:text-[#D08A70]'
                }`}>
                  {currentUser.estado}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-foreground mb-4">Seguridad</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>✓ Cuenta verificada</p>
              <p>✓ Autenticación activa</p>
              <p>✓ Sesión segura</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
