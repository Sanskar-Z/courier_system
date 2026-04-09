import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Package,
  Home,
  BarChart3,
  MapPin,
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Layout() {

  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['customer', 'admin', 'staff'] },
    { name: 'Book Shipment', href: '/book', icon: Package, roles: ['customer'] },
    { name: 'Track Shipment', href: '/track', icon: MapPin, roles: ['customer'] },
    { name: 'Staff Panel', href: '/staff', icon: BarChart3, roles: ['admin', 'staff'] },
    { name: 'Audit Logs', href: '/audit-logs', icon: FileText, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-slate-900">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">SwiftTrack</p>
                <p className="text-xs text-slate-500">Logistics</p>
              </div>
            </Link>

            {/* User role display */}
            {role && (
              <span className="ml-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            )}
          </div>


          <div className="hidden lg:flex items-center gap-2">
            {filteredNavigation.map(item => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

      </nav>

      {/* Page content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}