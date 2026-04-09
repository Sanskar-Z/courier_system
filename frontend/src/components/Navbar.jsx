import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, UserPlus, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">SwiftTrack</p>
            <p className="text-xs text-slate-500">Logistics</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  location.pathname === '/dashboard'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </Link>

              {role === 'customer' && (
                <>
                  <Link
                    to="/book"
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      location.pathname === '/book'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Book Shipment
                  </Link>

                  <Link
                    to="/track"
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      location.pathname === '/track'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Track Shipment
                  </Link>
                </>
              )}

              {(role === 'admin' || role === 'staff') && (
                <Link
                  to="/staff"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    location.pathname === '/staff'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Staff Panel
                </Link>
              )}

              {role === 'admin' && (
                <Link
                  to="/audit-logs"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    location.pathname === '/audit-logs'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Audit Logs
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  location.pathname === '/login'
                    ? 'bg-black text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className={`flex gap-2 rounded-full px-4 py-2 text-sm font-medium transition  ${
                  location.pathname === '/register'
                    ? 'bg-black text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <UserPlus size={19}/>Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}