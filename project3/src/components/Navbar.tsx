import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, BarChart3, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    ...(user?.role === 'admin' ? [{ id: '/', icon: Package, label: 'Inventario' }] : []),
    { id: '/productos', icon: Package, label: 'Productos' },
    { id: '/ventas', icon: ShoppingCart, label: 'Ventas' },
    ...(user?.role === 'admin' ? [{ id: '/reportes', icon: BarChart3, label: 'Reportes' }] : []),
  ];

  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          <span className="text-xl font-bold">Ferretería El Constructor</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            {navItems.map(({ id, icon: Icon, label }) => (
              <Link
                key={id}
                to={id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${location.pathname === id ? 'bg-slate-700' : 'hover:bg-slate-700'}`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 border-l pl-4 ml-4">
            <span className="text-sm">
              {user?.name} ({user?.role === 'admin' ? 'Administrador' : 'Cliente'})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-gray-300"
            >
              <LogOut className="h-5 w-5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};