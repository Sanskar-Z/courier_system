import { useEffect, useState } from 'react';
import { ShieldAlert, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import axios from '../api/axios';

export default function DamageLogs() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get(`/damage-logs?page=${page}`);
                setLogs(res.data.logs);
                setTotal(res.data.total);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLogs();
    }, [page]);

    const getSeverityBadge = (severity) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">Critical</span>;
            case 'major':
                return <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">Major</span>;
            case 'minor':
                return <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">Minor</span>;
            default:
                return <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">{severity}</span>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="rounded-3xl bg-white shadow-xl border border-orange-100 p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Damage Logs</h1>
                        <p className="mt-2 text-gray-600">Review and assess reported damages to packages in transit.</p>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-3xl bg-orange-50 px-5 py-4 text-orange-700 border border-orange-200">
                        <ShieldAlert className="h-5 w-5 text-orange-600" />
                        <div>
                            <p className="text-sm">Reported Incidents</p>
                            <p className="font-semibold text-orange-900">{total}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Incident Reports</h2>
                            <p className="mt-1 text-sm text-gray-600">Filter through recent damage cases.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </button>
                            <button onClick={() => setPage(page + 1)} disabled={page * 10 >= total} className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50">
                                Next <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Log ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Shipment ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Severity</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map(l => (
                                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{l.id}</td>
                                    <td className="px-6 py-4 text-sm text-blue-600 font-medium">#{l.shipment_id}</td>
                                    <td className="px-6 py-4 text-sm">{getSeverityBadge(l.severity || '')}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">{l.damage_description || l.description}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(l.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <AlertTriangle className="h-10 w-10 text-gray-300 mb-2" />
                                        <p>No damage logs found.</p>
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
