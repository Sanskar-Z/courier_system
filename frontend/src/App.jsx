import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookShipment from './pages/BookShipment';
import Tracking from './pages/Tracking';
import StaffDashboard from './pages/StaffDashboard';
import ShipmentDetail from './pages/ShipmentDetail';
import AuditLogs from './pages/AuditLogs';
import DeliveryFailures from './pages/DeliveryFailures';
import DamageLogs from './pages/DamageLogs';
import EmployeeManagement from './pages/EmployeeManagement';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="book" element={<BookShipment />} />
        <Route path="track" element={<Tracking />} />
        <Route path="staff" element={<StaffDashboard />} />
        <Route path="shipment/:id" element={<ShipmentDetail />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="delivery-failures" element={<DeliveryFailures />} />
        <Route path="damage-logs" element={<DamageLogs />} />
        <Route path="employee-management" element={<EmployeeManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
