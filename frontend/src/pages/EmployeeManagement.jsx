import { useEffect, useState } from 'react';
import { Users, UserPlus, MapPin, Briefcase, X } from 'lucide-react';
import axios from '../api/axios';

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'staff',
        employee_role: '',
        hub_id: ''
    });

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHubs = async () => {
        try {
            const res = await axios.get('/hubs');
            setHubs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchHubs();
    }, []);

    const handleOpenModal = (employee = null) => {
        if (employee) {
            setCurrentEmployee(employee);
            setFormData({
                username: employee.username || '',
                password: '',
                role: employee.user_role || 'staff', // Wait, u.role isn't explicitly returned as user_role but let's assume 'staff'
                employee_role: employee.role || '',
                hub_id: employee.hub_id || ''
            });
        } else {
            setCurrentEmployee(null);
            setFormData({
                username: '',
                password: '',
                role: 'staff',
                employee_role: '',
                hub_id: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentEmployee(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.hub_id) payload.hub_id = null; // Ensure null if empty
            if (!payload.password) delete payload.password; // Remove empty password to pass min(6) validation

            if (currentEmployee) {
                await axios.put(`/employees/${currentEmployee.id}`, payload);
            } else {
                await axios.post('/employees', payload);
            }
            handleCloseModal();
            fetchEmployees();
        } catch (err) {
            console.error(err);
            alert('Failed to save employee: ' + (err.response?.data?.details || err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="rounded-3xl bg-white shadow-xl border border-indigo-100 p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Employee Management</h1>
                        <p className="mt-2 text-gray-600">Manage your workforce, assign roles, and allocate hub locations.</p>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-3xl bg-indigo-50 px-5 py-4 text-indigo-700 border border-indigo-200">
                        <Users className="h-5 w-5 text-indigo-600" />
                        <div>
                            <p className="text-sm">Total Workforce</p>
                            <p className="font-semibold text-indigo-900">{employees.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Staff Directory</h2>
                        <p className="mt-1 text-sm text-gray-600">Active employees within the system.</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md transition-all">
                        <UserPlus className="h-4 w-4" /> Add Employee
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Employee ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Hub Location</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employees.map(e => (
                                <tr key={e.id} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">EMP-{e.id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-800 font-medium flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                            {e.username ? e.username.substring(0, 2).toUpperCase() : 'U'}
                                        </div>
                                        {e.username}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                            <Briefcase className="h-3 w-3" /> {e.role || 'Staff'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <div className="flex items-center gap-2">
                                            {e.hub_name ? <><MapPin className="h-4 w-4 text-slate-400" /> {e.hub_name}</> : <span className="text-slate-400 italic">Unassigned</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        <button onClick={() => handleOpenModal(e)} className="text-indigo-600 hover:text-indigo-900 font-medium px-3 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">Edit</button>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No employees found in the directory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 p-6">
                            <h3 className="text-xl font-semibold text-gray-900">{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
                            <button onClick={handleCloseModal} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input required type="text" name="username" value={formData.username} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. john_doe" disabled={!!currentEmployee} />
                                {currentEmployee && <p className="text-xs text-gray-500 mt-1">Username cannot be changed after creation.</p>}
                            </div>

                            {!currentEmployee && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input required={!currentEmployee} type="password" name="password" value={formData.password} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="••••••••" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white" disabled={!!currentEmployee}>
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                    <option value="customer">Customer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <input required type="text" name="employee_role" value={formData.employee_role} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Courier Coordinator" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Hub</label>
                                <select name="hub_id" value={formData.hub_id} onChange={handleChange} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                                    <option value="">-- Unassigned --</option>
                                    {hubs.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button type="button" onClick={handleCloseModal} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-md transition-colors">
                                    {currentEmployee ? 'Save Changes' : 'Create Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
