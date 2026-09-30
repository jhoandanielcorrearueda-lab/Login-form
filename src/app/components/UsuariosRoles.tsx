import { useState } from 'react';
import { Users, Shield, Edit2, Trash2, Plus, Save, X, CheckCircle, Clock, Lock, Unlock, UserCheck } from 'lucide-react';

type Role = 'admin' | 'empleado' | 'cliente' | 'proveedor' | 'pendiente';

interface Permission {
  id: string;
  name: string;
  category: string;
}

interface RolePermissions {
  role: Role;
  roleName: string;
  permissions: string[];
}

interface User {
  email: string;
  password: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  address: string;
  city: string;
  role: Role;
  estado: 'activo' | 'pendiente';
}

interface UsuariosRolesProps {
  allUsers: User[];
  onUpdateUserRole: (email: string, newRole: Role) => void;
  onToggleUserAccess: (email: string) => void;
}

const allPermissions: Permission[] = [
  // Dashboard
  { id: 'view_dashboard', name: 'Ver dashboard', category: 'Dashboard' },
  { id: 'view_metrics', name: 'Ver métricas', category: 'Dashboard' },

  // Usuarios
  { id: 'view_users', name: 'Ver usuarios', category: 'Usuarios' },
  { id: 'create_users', name: 'Crear usuarios', category: 'Usuarios' },
  { id: 'edit_users', name: 'Editar usuarios', category: 'Usuarios' },
  { id: 'delete_users', name: 'Eliminar usuarios', category: 'Usuarios' },
  { id: 'manage_permissions', name: 'Gestionar permisos', category: 'Usuarios' },

  // Productos
  { id: 'view_products', name: 'Ver productos', category: 'Productos' },
  { id: 'create_products', name: 'Crear productos', category: 'Productos' },
  { id: 'edit_products', name: 'Editar productos', category: 'Productos' },
  { id: 'delete_products', name: 'Eliminar productos', category: 'Productos' },
  { id: 'manage_prices', name: 'Gestionar precios', category: 'Productos' },

  // Inventario
  { id: 'view_inventory', name: 'Ver inventario', category: 'Inventario' },
  { id: 'update_inventory', name: 'Actualizar inventario', category: 'Inventario' },
  { id: 'view_stock_alerts', name: 'Ver alertas de stock', category: 'Inventario' },

  // Ventas
  { id: 'view_sales', name: 'Ver ventas', category: 'Ventas' },
  { id: 'create_sales', name: 'Crear ventas', category: 'Ventas' },
  { id: 'cancel_sales', name: 'Cancelar ventas', category: 'Ventas' },
  { id: 'apply_discounts', name: 'Aplicar descuentos', category: 'Ventas' },

  // Facturación
  { id: 'view_invoices', name: 'Ver facturas', category: 'Facturación' },
  { id: 'create_invoices', name: 'Crear facturas', category: 'Facturación' },
  { id: 'void_invoices', name: 'Anular facturas', category: 'Facturación' },

  // Proveedores
  { id: 'view_suppliers', name: 'Ver proveedores', category: 'Proveedores' },
  { id: 'create_suppliers', name: 'Crear proveedores', category: 'Proveedores' },
  { id: 'edit_suppliers', name: 'Editar proveedores', category: 'Proveedores' },
  { id: 'create_orders', name: 'Crear órdenes de compra', category: 'Proveedores' },

  // Reportes
  { id: 'view_reports', name: 'Ver reportes', category: 'Reportes' },
  { id: 'export_reports', name: 'Exportar reportes', category: 'Reportes' },

  // Auditoría
  { id: 'view_audit', name: 'Ver auditoría', category: 'Auditoría' },
];

export default function UsuariosRoles({ allUsers, onUpdateUserRole, onToggleUserAccess }: UsuariosRolesProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions'>('users');
  const [userFilter, setUserFilter] = useState<'empleado' | 'proveedor' | 'cliente'>('empleado');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [showConfirmToggle, setShowConfirmToggle] = useState<string | null>(null);

  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([
    {
      role: 'admin',
      roleName: 'Administrador',
      permissions: allPermissions.map(p => p.id)
    },
    {
      role: 'empleado',
      roleName: 'Empleado',
      permissions: ['view_dashboard', 'view_products', 'create_sales', 'view_inventory', 'view_suppliers']
    },
    {
      role: 'cliente',
      roleName: 'Cliente',
      permissions: ['view_products', 'create_sales']
    },
    {
      role: 'proveedor',
      roleName: 'Proveedor',
      permissions: ['view_products', 'view_suppliers', 'create_orders']
    },
    {
      role: 'pendiente',
      roleName: 'Pendiente de Asignación',
      permissions: []
    }
  ]);

  const handleAssignRole = (userEmail: string) => {
    if (selectedRole && selectedRole !== 'pendiente') {
      onUpdateUserRole(userEmail, selectedRole);
      setEditingUser(null);
      setSelectedRole('');
    }
  };

  const handleToggleAccess = (userEmail: string) => {
    onToggleUserAccess(userEmail);
    setShowConfirmToggle(null);
  };

  const togglePermission = (role: Role, permissionId: string) => {
    setRolePermissions(prev => prev.map(rp => {
      if (rp.role === role) {
        const hasPermission = rp.permissions.includes(permissionId);
        return {
          ...rp,
          permissions: hasPermission
            ? rp.permissions.filter(p => p !== permissionId)
            : [...rp.permissions, permissionId]
        };
      }
      return rp;
    }));
  };

  const getRolePermissions = (role: Role) => {
    return rolePermissions.find(rp => rp.role === role)?.permissions || [];
  };

  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">Usuarios & Roles</h2>
          <p className="text-muted-foreground">Gestiona usuarios y asigna permisos a cada rol</p>
        </div>
        {activeTab === 'users' && (
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Nuevo usuario
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} />
              Usuarios
            </div>
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'permissions'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={20} />
              Permisos por Rol
            </div>
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Información y Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-blue-50 dark:bg-[#24545A]/40 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" size={24} />
                <div>
                  <p className="text-2xl text-foreground">{allUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-[#24545A]/50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <UserCheck className="text-green-600" size={24} />
                <div>
                  <p className="text-2xl text-foreground">{allUsers.filter(u => u.estado === 'activo').length}</p>
                  <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="text-indigo-600" size={24} />
                <div>
                  <p className="text-2xl text-foreground">{allUsers.filter(u => u.role === 'empleado').length}</p>
                  <p className="text-sm text-muted-foreground">Empleados</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-[#B7654A]/25 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="text-amber-600" size={24} />
                <div>
                  <p className="text-2xl text-foreground">{allUsers.filter(u => u.role === 'proveedor').length}</p>
                  <p className="text-sm text-muted-foreground">Proveedores</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="text-emerald-600" size={24} />
                <div>
                  <p className="text-2xl text-foreground">{allUsers.filter(u => u.role === 'cliente').length}</p>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="bg-blue-50 dark:bg-[#24545A]/40 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-600 dark:text-[#5E8587] flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-foreground mb-1">Panel de Control de Acceso</h4>
                <p className="text-sm text-muted-foreground">
                  Gestiona roles, permisos y acceso de usuarios. Todos se registran como <strong>Cliente</strong> por defecto.
                  Puedes cambiar roles o bloquear/desbloquear acceso cuando sea necesario.
                </p>
              </div>
            </div>
          </div>

          {/* Sub-Tabs para filtrar usuarios por rol */}
          <div className="border-b border-border">
            <div className="flex gap-2">
              <button
                onClick={() => setUserFilter('empleado')}
                className={`px-6 py-3 border-b-2 transition-colors ${
                  userFilter === 'empleado'
                    ? 'border-[#818cf8] text-[#818cf8] bg-[#818cf8]/10'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Empleados</span>
                  <span className="text-xs bg-[#818cf8]/20 px-2 py-0.5 rounded-full">
                    {allUsers.filter(u => u.role === 'empleado').length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setUserFilter('proveedor')}
                className={`px-6 py-3 border-b-2 transition-colors ${
                  userFilter === 'proveedor'
                    ? 'border-[#fbbf24] text-[#fbbf24] bg-[#fbbf24]/10'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Proveedores</span>
                  <span className="text-xs bg-[#fbbf24]/20 px-2 py-0.5 rounded-full">
                    {allUsers.filter(u => u.role === 'proveedor').length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setUserFilter('cliente')}
                className={`px-6 py-3 border-b-2 transition-colors ${
                  userFilter === 'cliente'
                    ? 'border-[#34d399] text-[#34d399] bg-[#34d399]/10'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Clientes</span>
                  <span className="text-xs bg-[#34d399]/20 px-2 py-0.5 rounded-full">
                    {allUsers.filter(u => u.role === 'cliente').length}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Tabla filtrada por rol */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-muted px-6 py-3 flex items-center justify-between">
              <h3 className="text-foreground capitalize">{userFilter}s</h3>
              <div className="flex gap-2 text-sm">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {allUsers.filter(u => u.role === userFilter && u.estado === 'activo').length} Activos
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                  {allUsers.filter(u => u.role === userFilter && u.estado === 'pendiente').length} Bloqueados
                </span>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 text-foreground">Nombre</th>
                  <th className="text-left px-6 py-3 text-foreground">Correo</th>
                  <th className="text-left px-6 py-3 text-foreground">Rol</th>
                  <th className="text-left px-6 py-3 text-foreground">Acceso</th>
                  <th className="text-left px-6 py-3 text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.filter(u => u.role === userFilter).map((user) => (
                  <tr key={user.email} className="border-t border-border">
                    <td className="px-6 py-4 text-foreground">{user.fullName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      {editingUser === user.email && user.email !== 'admin@yesmau.com' ? (
                        <select
                          value={selectedRole || user.role}
                          onChange={(e) => setSelectedRole(e.target.value as Role)}
                          className="px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="empleado">Empleado</option>
                          <option value="cliente">Cliente</option>
                          <option value="proveedor">Proveedor</option>
                          {user.role === 'admin' && <option value="admin">Administrador</option>}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          user.role === 'admin' ? 'bg-[#B7654A]/20 text-[#B7654A]' :
                          user.role === 'empleado' ? 'bg-[#818cf8]/20 text-[#818cf8]' :
                          user.role === 'cliente' ? 'bg-[#34d399]/20 text-[#34d399]' :
                          'bg-[#fbbf24]/20 text-[#fbbf24]'
                        }`}>
                          {rolePermissions.find(rp => rp.role === user.role)?.roleName}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.estado === 'activo' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[#34d399]/20 text-[#34d399]">
                          <Unlock size={14} />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-700">
                          <Lock size={14} />
                          Bloqueado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.email === 'admin@yesmau.com' ? (
                        <span className="text-xs text-muted-foreground">Administrador principal</span>
                      ) : (
                        <div className="flex gap-2">
                          {editingUser === user.email ? (
                            <>
                              <button
                                onClick={() => {
                                  if (selectedRole) handleAssignRole(user.email);
                                }}
                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(null);
                                  setSelectedRole('');
                                }}
                                className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingUser(user.email)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                title="Cambiar rol"
                              >
                                <Edit2 size={16} className="text-foreground" />
                              </button>
                              {showConfirmToggle === user.email ? (
                                <div className="flex items-center gap-2 bg-amber-50 dark:bg-[#B7654A]/25 px-3 py-1 rounded-lg border border-amber-200">
                                  <span className="text-xs text-foreground whitespace-nowrap">
                                    {user.estado === 'activo' ? '¿Bloquear?' : '¿Desbloquear?'}
                                  </span>
                                  <button
                                    onClick={() => handleToggleAccess(user.email)}
                                    className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    title="Confirmar"
                                  >
                                    <CheckCircle size={14} />
                                  </button>
                                  <button
                                    onClick={() => setShowConfirmToggle(null)}
                                    className="p-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                    title="Cancelar"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setShowConfirmToggle(user.email)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    user.estado === 'activo'
                                      ? 'hover:bg-amber-50 dark:hover:bg-[#B7654A]/25 dark:bg-[#B7654A]/25 text-amber-600'
                                      : 'hover:bg-green-50 dark:hover:bg-[#24545A]/50 dark:bg-[#24545A]/50 text-green-600'
                                  }`}
                                  title={user.estado === 'activo' ? 'Bloquear acceso' : 'Desbloquear acceso'}
                                >
                                  {user.estado === 'activo' ? (
                                    <Lock size={16} />
                                  ) : (
                                    <Unlock size={16} />
                                  )}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {allUsers.filter(u => u.role === userFilter).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Users size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                      <p className="text-foreground mb-2">No hay {userFilter}s registrados</p>
                      <p className="text-sm text-muted-foreground">
                        Los usuarios que se registren como {userFilter}s aparecerán aquí
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rolePermissions.map((rolePerms) => (
            <div key={rolePerms.role} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    rolePerms.role === 'admin' ? 'bg-[#B7654A]/20' :
                    rolePerms.role === 'empleado' ? 'bg-[#818cf8]/20' :
                    rolePerms.role === 'cliente' ? 'bg-[#34d399]/20' :
                    'bg-[#fbbf24]/20'
                  }`}>
                    <Shield size={20} className={
                      rolePerms.role === 'admin' ? 'text-[#B7654A]' :
                      rolePerms.role === 'empleado' ? 'text-[#818cf8]' :
                      rolePerms.role === 'cliente' ? 'text-[#34d399]' :
                      'text-[#fbbf24]'
                    } />
                  </div>
                  <div>
                    <h3 className="text-foreground">{rolePerms.roleName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {rolePerms.permissions.length} permisos activos
                    </p>
                  </div>
                </div>
                {editingRole === rolePerms.role ? (
                  <button
                    onClick={() => setEditingRole(null)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 text-sm"
                  >
                    <Save size={16} />
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingRole(rolePerms.role)}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg hover:bg-accent text-sm"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="text-sm text-muted-foreground mb-2">{category}</h4>
                    <div className="space-y-2">
                      {permissions.map((permission) => {
                        const isChecked = rolePerms.permissions.includes(permission.id);
                        const isDisabled = editingRole !== rolePerms.role || rolePerms.role === 'admin';

                        return (
                          <label
                            key={permission.id}
                            className={`flex items-center gap-3 p-2 rounded-lg ${
                              !isDisabled ? 'hover:bg-secondary cursor-pointer' : 'cursor-not-allowed opacity-60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isDisabled}
                              onChange={() => togglePermission(rolePerms.role, permission.id)}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-foreground">{permission.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
