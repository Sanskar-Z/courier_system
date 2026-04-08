import { useEffect, useState } from 'react';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from '../api/axios';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get(`/audit-logs?page=${page}`);
                setLogs(res.data.logs);
                setTotal(res.data.total);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLogs();
    }, [page]);

    return (
        <div className="space-y-8">
            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Audit Logs</h1>
                        <p className="mt-2 text-gray-600">Review system changes and monitor user activity across the platform.</p>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-50 px-5 py-4 text-slate-700 border border-slate-200">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                        <div>
                            <p className="text-sm">Total records</p>
                            <p className="font-semibold text-slate-900">{total}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Recent log activity</h2>
                            <p className="mt-1 text-sm text-gray-600">Load more pages or filter events in the future.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </button>
                            <button onClick={() => setPage(page + 1)} disabled={page * 10 >= total} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                                Next <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Table</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Record ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-700">{log.action}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{log.table_name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{log.record_id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{log.username || 'System'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{new Date(log.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}