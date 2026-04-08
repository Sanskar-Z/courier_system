import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, AlertTriangle, Clock, TrendingUp, Truck, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
    const [shipments, setShipments] = useState([]);
    const [report, setReport] = useState(null);
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const shipRes = await axios.get('/shipments');
                setShipments(shipRes.data.shipments || []);

                if (role === 'admin' || role === 'staff') {
                    const repRes = await axios.get('/shipments/report');
                    setReport(repRes.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [role]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your shipments.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-green-50 px-3 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">System Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            {report && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{report.total_shipments}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600 font-medium">+12% from last month</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">SLA Breaches</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{report.sla_breaches}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-sm text-red-600 font-medium">Requires attention</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Delayed Shipments</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{report.delayed_shipments}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <Clock className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-sm text-orange-600 font-medium">Under monitoring</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">On Time Delivery</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {report.total_shipments > 0 ? Math.round(((report.total_shipments - report.delayed_shipments) / report.total_shipments) * 100) : 0}%
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-sm text-green-600 font-medium">Performance rate</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Charts Section */}
            {report?.by_service && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipments by Service Type</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={report.by_service}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="service_type"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Status Overview</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'On Time', value: report.total_shipments - report.delayed_shipments, fill: '#10b981' },
                                            { name: 'Delayed', value: report.delayed_shipments, fill: '#f59e0b' },
                                            { name: 'SLA Breached', value: report.sla_breaches, fill: '#ef4444' }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#10b981" />
                                        <Cell fill="#f59e0b" />
                                        <Cell fill="#ef4444" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Shipments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Shipments</h2>
                    <p className="text-sm text-gray-600 mt-1">Track and manage your latest shipments</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {shipments.slice(0, 10).map(s => (
                                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                                            {s.tracking_no}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.service_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            s.current_status === 'Delivered'
                                                ? 'bg-green-100 text-green-800'
                                                : s.current_status === 'Delayed'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {s.current_status || 'Booked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.customer_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(s.expected_delivery_date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {shipments.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <p>No shipments found.</p>
                                        <p className="text-sm">Your shipments will appear here once created.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
