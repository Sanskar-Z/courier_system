import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Package size={28} />
            <span className="font-bold text-xl tracking-wide">SwiftTrack Logistics</span>
          </Link>
          <div className="space-x-4 flex items-center">
            {token ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
                {role === 'customer' && <Link to="/book" className="hover:text-blue-200 transition">Book Shipment</Link>}
                {role === 'customer' && <Link to="/track" className="hover:text-blue-200 transition">Track Shipment</Link>}
                {(role === 'admin' || role === 'staff') && <Link to="/staff" className="hover:text-blue-200 transition">Staff Panel</Link>}
                <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded shadow-sm text-sm font-semibold">Logout</button>
              </>
            ) : (
              <>
                  <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
                  <Link to="/register" className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded shadow-sm text-sm font-semibold">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
