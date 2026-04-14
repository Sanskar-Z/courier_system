import { useEffect, useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import axios from '../api/axios';

export default function DeliveryFailures() {
    const [failures, setFailures] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchFailures = async () => {
            try {
                const res = await axios.get(`/delivery-failures?page=${page}`);
                setFailures(res.data.failures);
                setTotal(res.data.total);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFailures();
    }, [page]);

    return (
        <div className="space-y-8">
            <div className="rounded-3xl bg-white shadow-xl border border-red-100 p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Delivery Failures</h1>
                        <p className="mt-2 text-gray-600">Track and manage unsuccessful delivery attempts across the network.</p>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-3xl bg-red-50 px-5 py-4 text-red-700 border border-red-200">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                            <p className="text-sm">Recorded Failures</p>
                            <p className="font-semibold text-red-900">{total}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Recent Failures</h2>
                            <p className="mt-1 text-sm text-gray-600">Review failure reasons and tracking statuses.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </button>
                            <button onClick={() => setPage(page + 1)} disabled={page * 10 >= total} className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
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
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Reason</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Retry Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {failures.map(f => (
                                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{f.id}</td>
                                    <td className="px-6 py-4 text-sm text-blue-600 font-medium">#{f.shipment_id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{f.failure_reason || f.reason}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {f.retry_scheduled ? 
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"><RefreshCcw className="h-3 w-3" /> Scheduled</span> 
                                            : 
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Not Scheduled</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(f.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                            {failures.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No delivery failures found.
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
