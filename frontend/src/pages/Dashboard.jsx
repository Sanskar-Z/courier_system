import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [shipments, setShipments] = useState([]);
    const [report, setReport] = useState(null);
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const shipRes = await axios.get('/shipments');
            setShipments(shipRes.data);

            if (role === 'admin' || role === 'staff') {
                const repRes = await axios.get('/shipments/report');
                setReport(repRes.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
            
            {/* Admin Metrics */}
            {report && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                        <h3 className="text-gray-500 font-medium">Total Shipments</h3>
                        <p className="text-3xl font-bold text-gray-800">{report.total_shipments}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
                        <h3 className="text-gray-500 font-medium">SLA Breaches</h3>
                        <p className="text-3xl font-bold text-gray-800">{report.sla_breaches}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
                        <h3 className="text-gray-500 font-medium">Delayed</h3>
                        <p className="text-3xl font-bold text-gray-800">{report.delayed_shipments}</p>
                    </div>
                </div>
            )}

            {/* Admin Charts */}
            {report?.by_service && (
                <div className="bg-white p-6 rounded-xl shadow mb-8 h-80">
                    <h3 className="font-semibold text-lg text-gray-700 mb-4">Shipments by Service Type</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={report.by_service}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="service_type" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Your Shipments</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 uppercase tracking-wider text-xs">
                                <th className="p-4 border-b">Tracking No</th>
                                <th className="p-4 border-b">Service</th>
                                <th className="p-4 border-b border-l">Status</th>
                                <th className="p-4 border-b">Client</th>
                                <th className="p-4 border-b">Expected</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.map(s => (
                                <tr key={s.id} className="hover:bg-gray-50 transition border-b">
                                    <td className="p-4 font-semibold text-blue-600">{s.tracking_no}</td>
                                    <td className="p-4">{s.service_type}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full font-bold text-xs
                                            ${s.current_status === 'Delivered' ? 'bg-green-100 text-green-700' : ''}
                                            ${s.current_status === 'Delayed' ? 'bg-red-100 text-red-700' : ''}
                                            ${['Delivered', 'Delayed'].includes(s.current_status) ? '' : 'bg-blue-100 text-blue-700'}
                                        `}>
                                            {s.current_status}
                                        </span>
                                    </td>
                                    <td className="p-4">{s.customer_name}</td>
                                    <td className="p-4">{new Date(s.expected_delivery_date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {shipments.length === 0 && (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No shipments found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
