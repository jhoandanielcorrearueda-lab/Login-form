import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, AlertCircle, CheckCircle, Moon, Sun } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PublicView from './components/PublicView';

type ViewMode = 'public' | 'login' | 'register' | 'dashboard' | 'forgot-password';

interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterFormData {
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordFormData {
  email: string;
}

interface ResetPasswordFormData {
  newPassword: string;
  confirmNewPassword: string;
}

type UserRole = 'admin' | 'empleado' | 'cliente' | 'proveedor' | 'pendiente';

interface RegisteredUser {
  email: string;
  password: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  address: string;
  city: string;
  role: UserRole;
  estado: 'activo' | 'pendiente' | 'bloqueado';
  intentosFallidos?: number;
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('registeredUsers');
    const adminUser = {
      email: 'admin@yesmau.com',
      password: '123456',
      fullName: 'Administrador Yesmau',
      documentType: 'CC',
      documentNumber: '1234567890',
      phone: '3001234567',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      role: 'admin' as UserRole,
      estado: 'activo' as const
    };

    const clienteJhoandaniel = {
      email: 'jhoandanielcorrearueda@gmail.com',
      password: '1092533870Jd',
      fullName: 'Jhoandaniel Correa Rueda',
      documentType: 'CC',
      documentNumber: '1092533870',
      phone: '3001234567',
      address: 'Calle Principal',
      city: 'Bogotá',
      role: 'cliente' as UserRole,
      estado: 'activo' as const
    };

    if (saved) {
      const parsedUsers = JSON.parse(saved);
      // Verificar si el admin existe, si no, agregarlo
      const hasAdmin = parsedUsers.some((u: RegisteredUser) => u.email === 'admin@yesmau.com');
      const hasCliente = parsedUsers.some((u: RegisteredUser) => u.email === 'jhoandanielcorrearueda@gmail.com');

      const defaultUsers = [];
      if (!hasAdmin) defaultUsers.push(adminUser);
      if (!hasCliente) defaultUsers.push(clienteJhoandaniel);

      if (defaultUsers.length > 0) {
        return [...defaultUsers, ...parsedUsers];
      }
      return parsedUsers;
    }

    return [adminUser, clienteJhoandaniel];
  });

  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);

  const loginForm = useForm<LoginFormData>();
  const registerForm = useForm<RegisterFormData>();
  const forgotPasswordForm = useForm<ForgotPasswordFormData>();
  const resetPasswordForm = useForm<ResetPasswordFormData>();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (data: LoginFormData) => {
    // Buscar usuario por email
    const userByEmail = registeredUsers.find(u => u.email === data.email);

    // Verificar si la cuenta está bloqueada
    if (userByEmail && userByEmail.estado === 'bloqueado') {
      setMessage({
        type: 'error',
        text: 'Cuenta bloqueada por múltiples intentos fallidos. Contacta al administrador.'
      });
      return;
    }

    // Verificar credenciales
    const user = registeredUsers.find(
      u => u.email === data.email && u.password === data.password
    );

    if (!user) {
      // Incrementar intentos fallidos
      if (userByEmail) {
        const intentos = (userByEmail.intentosFallidos || 0) + 1;
        if (intentos >= 5) {
          setRegisteredUsers(prev => prev.map(u =>
            u.email === data.email
              ? { ...u, estado: 'bloqueado' as const, intentosFallidos: intentos }
              : u
          ));
          setMessage({
            type: 'error',
            text: 'Cuenta bloqueada por múltiples intentos fallidos. Contacta al administrador.'
          });
        } else {
          setRegisteredUsers(prev => prev.map(u =>
            u.email === data.email
              ? { ...u, intentosFallidos: intentos }
              : u
          ));
          setMessage({
            type: 'error',
            text: `Credenciales incorrectas. Te quedan ${5 - intentos} intentos.`
          });
        }
      } else {
        setMessage({
          type: 'error',
          text: 'Usuario no registrado. Por favor regístrate primero.'
        });
      }
      return;
    }

    // Verificar si el acceso está suspendido por el administrador
    if (user.estado === 'pendiente') {
      setMessage({
        type: 'error',
        text: 'Tu acceso ha sido suspendido temporalmente. Por favor contacta al administrador.'
      });
      return;
    }

    // Resetear intentos fallidos en login exitoso
    setRegisteredUsers(prev => prev.map(u =>
      u.email === data.email
        ? { ...u, intentosFallidos: 0 }
        : u
    ));

    console.log('Login exitoso:', data);
    setCurrentUser(user);
    setMessage({ type: 'success', text: `¡Bienvenido ${user.fullName}!` });
    setTimeout(() => {
      setViewMode('dashboard');
      setMessage(null);
    }, 1000);
  };

  const handleRegister = (data: RegisterFormData) => {
    // Validar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      registerForm.setError('confirmPassword', {
        type: 'manual',
        message: 'Las contraseñas no coinciden'
      });
      return;
    }

    // Verificar si el correo ya está registrado
    const existingUser = registeredUsers.find(u => u.email === data.email);
    if (existingUser) {
      setMessage({
        type: 'error',
        text: 'Este correo electrónico ya está registrado. Por favor inicia sesión.'
      });
      return;
    }

    // Verificar si el documento ya está registrado
    const existingDocument = registeredUsers.find(
      u => u.documentType === data.documentType && u.documentNumber === data.documentNumber
    );
    if (existingDocument) {
      setMessage({
        type: 'error',
        text: 'Este número de documento ya está registrado.'
      });
      return;
    }

    // Determinar rol según el correo
    let role: UserRole = 'cliente'; // Por defecto todos son clientes
    let estado: 'activo' | 'pendiente' = 'activo'; // Acceso inmediato

    // Solo admin@yesmau.com es administrador
    if (data.email === 'admin@yesmau.com') {
      role = 'admin';
    }

    // Registrar nuevo usuario
    const newUser: RegisteredUser = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      phone: data.phone,
      address: data.address,
      city: data.city,
      role: role,
      estado: estado
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    console.log('Usuario registrado:', newUser);

    if (role === 'admin') {
      setMessage({ type: 'success', text: '¡Registro exitoso! Ahora puedes iniciar sesión como administrador.' });
    } else {
      setMessage({
        type: 'success',
        text: '¡Registro exitoso! Ya puedes iniciar sesión y explorar nuestro catálogo.'
      });
    }

    setTimeout(() => {
      setViewMode('login');
      setMessage(null);
      registerForm.reset();
    }, 2000);
  };

  const handleForgotPassword = (data: ForgotPasswordFormData) => {
    // Verificar si el usuario existe
    const user = registeredUsers.find(u => u.email === data.email);

    if (!user) {
      setMessage({
        type: 'error',
        text: 'No existe una cuenta con este correo electrónico.'
      });
      return;
    }

    // Guardar el email para el siguiente paso
    setResetEmail(data.email);
    setMessage({
      type: 'success',
      text: 'Correo verificado. Ahora puedes crear una nueva contraseña.'
    });

    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  const handleResetPassword = (data: ResetPasswordFormData) => {
    // Validar que las contraseñas coincidan
    if (data.newPassword !== data.confirmNewPassword) {
      resetPasswordForm.setError('confirmNewPassword', {
        type: 'manual',
        message: 'Las contraseñas no coinciden'
      });
      return;
    }

    // Actualizar la contraseña del usuario
    setRegisteredUsers(prev => prev.map(user =>
      user.email === resetEmail
        ? { ...user, password: data.newPassword }
        : user
    ));

    setMessage({
      type: 'success',
      text: '¡Contraseña actualizada exitosamente! Ahora puedes iniciar sesión.'
    });

    setTimeout(() => {
      setViewMode('login');
      setMessage(null);
      setResetEmail('');
      forgotPasswordForm.reset();
      resetPasswordForm.reset();
    }, 2000);
  };

  const handleLogout = () => {
    setViewMode('public');
    setCurrentUser(null);
    loginForm.reset();
    setMessage(null);
  };

  const updateUserRole = (email: string, newRole: UserRole) => {
    setRegisteredUsers(prev => prev.map(user =>
      user.email === email
        ? { ...user, role: newRole, estado: 'activo' as const }
        : user
    ));
  };

  const toggleUserAccess = (email: string) => {
    setRegisteredUsers(prev => prev.map(user =>
      user.email === email
        ? { ...user, estado: user.estado === 'activo' ? 'pendiente' as const : 'activo' as const }
        : user
    ));
  };

  const updateUserProfile = (email: string, updatedData: Partial<RegisteredUser>) => {
    setRegisteredUsers(prev => prev.map(user =>
      user.email === email
        ? { ...user, ...updatedData }
        : user
    ));

    // Actualizar el usuario actual si es el que se está editando
    if (currentUser?.email === email) {
      setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
    }
  };

  if (viewMode === 'public') {
    return (
      <PublicView
        onLoginClick={() => setViewMode('login')}
        onRegisterClick={() => setViewMode('register')}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  if (viewMode === 'dashboard') {
    return (
      <Dashboard
        onLogout={handleLogout}
        currentUser={currentUser}
        allUsers={registeredUsers}
        onUpdateUserRole={updateUserRole}
        onToggleUserAccess={toggleUserAccess}
        onUpdateUserProfile={updateUserProfile}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="size-full flex bg-background">
      {/* Panel Izquierdo - Imagen */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1771098403201-8d0d32e2a062?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjB0ZXh0aWxlJTIwZmFicmljJTIwc3RvcmUlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzY4NTg5NDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Yesmau Moda - Telas"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 dark:from-black/60 dark:to-black/40"></div>

        {/* Contenido sobre la imagen */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <h2 className="mb-2">YESMAU MODA</h2>
            <p className="text-white/90">Telas de calidad para tus creaciones</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-4">Tu aliado en telas y textiles</h3>
              <p className="text-white/80 max-w-md">
                Amplia variedad de telas, retazos y materiales textiles
                para confeccionar tus diseños más creativos.
              </p>
            </div>

            <div className="flex gap-8">
              <div>
                <div className="mb-1">+5,000</div>
                <p className="text-white/70">Clientes felices</p>
              </div>
              <div>
                <div className="mb-1">100%</div>
                <p className="text-white/70">Calidad</p>
              </div>
              <div>
                <div className="mb-1">24/7</div>
                <p className="text-white/70">Atención</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        <div className="bg-card rounded-[var(--radius-lg)] shadow-lg border border-border p-8">
          {/* Mensaje de éxito/error */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-[#d1fae5] dark:bg-[#065f46]/20 border border-[#34d399] text-[#065f46] dark:text-[#34d399]'
                : 'bg-[#fee2e2] dark:bg-[#991b1b]/20 border border-[#ef4444] text-[#991b1b] dark:text-[#ef4444]'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Logo/Título */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setViewMode('public')}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Volver al inicio
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {darkMode ? <Sun size={20} className="text-foreground" /> : <Moon size={20} className="text-foreground" />}
              </button>
            </div>
            <h1 className="text-foreground mb-2">
              {viewMode === 'login' ? 'Bienvenido' : viewMode === 'register' ? 'Crear cuenta' : 'Recuperar contraseña'}
            </h1>
            <p className="text-muted-foreground">
              {viewMode === 'login'
                ? 'Inicia sesión en tu cuenta'
                : viewMode === 'register'
                ? 'Regístrate en Yesmau Moda'
                : !resetEmail
                ? 'Ingresa tu correo para verificar tu cuenta'
                : 'Crea tu nueva contraseña'}
            </p>
          </div>

          {/* Formulario de Login */}
          {viewMode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-foreground">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                {...loginForm.register('email', {
                  required: 'El correo es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido'
                  }
                })}
                placeholder="tu@ejemplo.com"
                className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} />
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-foreground">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('forgot-password');
                    setMessage(null);
                  }}
                  className="text-primary hover:underline text-sm"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...loginForm.register('password', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} />
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Recordarme */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                {...loginForm.register('remember')}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 text-foreground cursor-pointer">
                Recordarme
              </label>
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
            >
              Iniciar sesión
            </button>
          </form>
          )}

          {/* Formulario de Registro */}
          {viewMode === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
            {/* Nombre Completo */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-foreground">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                {...registerForm.register('fullName', { required: 'El nombre es requerido' })}
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {registerForm.formState.errors.fullName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} />
                  {registerForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

            {/* Tipo y Número de Documento */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="documentType" className="block text-foreground">
                  Tipo de documento
                </label>
                <select
                  id="documentType"
                  {...registerForm.register('documentType')}
                  className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="CC">Cédula</option>
                  <option value="CE">Cédula Extranjería</option>
                  <option value="TI">Tarjeta Identidad</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="documentNumber" className="block text-foreground">
                  Número
                </label>
                <input
                  id="documentNumber"
                  type="text"
                  {...registerForm.register('documentNumber', {
                    required: 'El número de documento es requerido',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Solo números'
                    }
                  })}
                  placeholder="12345678"
                  className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                {registerForm.formState.errors.documentNumber && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle size={14} />
                    {registerForm.formState.errors.documentNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <label htmlFor="registerEmail" className="block text-foreground">
                Correo electrónico
              </label>
              <input
                id="registerEmail"
                type="email"
                {...registerForm.register('email', {
                  required: 'El correo es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido'
                  }
                })}
                placeholder="tu@ejemplo.com"
                className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} />
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Celular */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-foreground">
                Celular
              </label>
              <input
                id="phone"
                type="tel"
                {...registerForm.register('phone', {
                  required: 'El celular es requerido',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Debe tener 10 dígitos'
                  }
                })}
                placeholder="3001234567"
                className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {registerForm.formState.errors.phone && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} />
                  {registerForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <label htmlFor="address" className="block text-foreground">
                Dirección
              </label>
              <input
                id="address"
                type="text"
                {...registerForm.register('address', { required: 'La dirección es requerida' })}
                placeholder="Calle 123 #45-67"
                className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {registerForm.formState.errors.address && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} />
                  {registerForm.formState.errors.address.message}
                </p>
              )}
            </div>

            {/* Ciudad */}
            <div className="space-y-2">
              <label htmlFor="city" className="block text-foreground">
                Ciudad
              </label>
              <input
                id="city"
                type="text"
                {...registerForm.register('city', { required: 'La ciudad es requerida' })}
                placeholder="Bogotá"
                className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {registerForm.formState.errors.city && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} />
                  {registerForm.formState.errors.city.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label htmlFor="registerPassword" className="block text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="registerPassword"
                  type={showPassword ? 'text' : 'password'}
                  {...registerForm.register('password', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'Debe tener al menos 6 caracteres'
                    }
                  })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} />
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-foreground">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerForm.register('confirmPassword', {
                    required: 'Debes confirmar la contraseña'
                  })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle size={14} />
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Botón de Registro */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
            >
              Crear cuenta
            </button>
          </form>
          )}

          {/* Formulario de Recuperar Contraseña */}
          {viewMode === 'forgot-password' && (
            <>
              {!resetEmail ? (
                <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="forgot-email" className="block text-foreground">
                      Correo electrónico
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      {...forgotPasswordForm.register('email', {
                        required: 'El correo es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo electrónico inválido'
                        }
                      })}
                      placeholder="tu@ejemplo.com"
                      className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    {forgotPasswordForm.formState.errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle size={14} />
                        {forgotPasswordForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
                  >
                    Verificar Correo
                  </button>
                </form>
              ) : (
                <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="block text-foreground">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        {...resetPasswordForm.register('newPassword', {
                          required: 'La contraseña es requerida',
                          minLength: {
                            value: 6,
                            message: 'Debe tener al menos 6 caracteres'
                          }
                        })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {resetPasswordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle size={14} />
                        {resetPasswordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm-new-password" className="block text-foreground">
                      Confirmar nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-new-password"
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        {...resetPasswordForm.register('confirmNewPassword', {
                          required: 'Debes confirmar la contraseña'
                        })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-input-background rounded-[var(--radius-md)] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {resetPasswordForm.formState.errors.confirmNewPassword && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle size={14} />
                        {resetPasswordForm.formState.errors.confirmNewPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
                  >
                    Cambiar Contraseña
                  </button>
                </form>
              )}
            </>
          )}

          {/* Alternar entre Login, Registro y Recuperar Contraseña */}
          <p className="text-center mt-6 text-muted-foreground">
            {viewMode === 'login' ? (
              <>
                ¿No tienes una cuenta?{' '}
                <button
                  onClick={() => {
                    setViewMode('register');
                    setMessage(null);
                  }}
                  className="text-primary hover:underline"
                >
                  Regístrate
                </button>
              </>
            ) : viewMode === 'register' ? (
              <>
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => {
                    setViewMode('login');
                    setMessage(null);
                  }}
                  className="text-primary hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            ) : viewMode === 'forgot-password' ? (
              <>
                ¿Recordaste tu contraseña?{' '}
                <button
                  onClick={() => {
                    setViewMode('login');
                    setMessage(null);
                    setResetEmail('');
                    forgotPasswordForm.reset();
                    resetPasswordForm.reset();
                  }}
                  className="text-primary hover:underline"
                >
                  Volver a iniciar sesión
                </button>
              </>
            ) : null}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
