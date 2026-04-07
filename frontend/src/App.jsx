import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookShipment from './pages/BookShipment';
import StaffDashboard from './pages/StaffDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book" element={<BookShipment />} />
          <Route path="/staff" element={<StaffDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
