import { useEffect, useState } from 'react';
import {
    AlertCircle, ChevronLeft, ChevronRight,
    RefreshCcw, Plus, X, Trash2, Calendar, Hash
} from 'lucide-react';
import axios from '../api/axios';


// ─── small shared primitives ─────────────────────────────────────────────────
const Pill = ({ label, variant }) => {
    const v = {
        amber: 'bg-amber-50 text-amber-700 ring-amber-100',
        gray:  'bg-gray-50  text-gray-500  ring-gray-100',
        red:   'bg-red-50   text-red-700   ring-red-100',
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${v[variant]}`}>
            {label}
        </span>
    );
};

const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</label>
        {children}
    </div>
);

const inp = 'w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition';

export default function DeliveryFailures() {
    const role = localStorage.getItem('role');
    const [failures, setFailures]   = useState([]);
    const [total, setTotal]         = useState(0);
    const [page, setPage]           = useState(1);
    const [showForm, setShowForm]   = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast]         = useState('');

    const [form, setForm] = useState({
        shipment_id: '',
        attempt_number: '1',
        failure_reason: '',
        retry_scheduled: '',
    });

    // ── fetch list ──────────────────────────────────────────────────────────
    const fetchFailures = async () => {
        try {
            const res = await axios.get(`/delivery-failures?page=${page}&limit=10`);
            setFailures(res.data.failures || []);
            setTotal(res.data.total || 0);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchFailures(); }, [page]);

    // ── submit new failure ───────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('/delivery-failures', {
                shipment_id:    parseInt(form.shipment_id),
                attempt_number: parseInt(form.attempt_number),
                failure_reason: form.failure_reason,
                retry_scheduled: form.retry_scheduled || null,
            });
            setToast('Delivery failure logged successfully.');
            setShowForm(false);
            setForm({ shipment_id: '', attempt_number: '1', failure_reason: '', retry_scheduled: '' });
            fetchFailures();
        } catch (err) {
            setToast(err.response?.data?.error || 'Failed to log failure.');
        } finally {
            setSubmitting(false);
            setTimeout(() => setToast(''), 3500);
        }
    };

    // ── resolve (admin only) ─────────────────────────────────────────────────
    const handleResolve = async (id) => {
        if (!window.confirm('Permanently delete this failure record? This cannot be undone.')) return;
        try {
            await axios.delete(`/delivery-failures/${id}`);
            setToast('Record resolved and permanently deleted.');
            fetchFailures();
        } catch (err) {
            setToast(err.response?.data?.error || 'Delete failed.');
        } finally { setTimeout(() => setToast(''), 3500); }
    };

    const totalPages = Math.ceil(total / 10);

    return (
        <div className="space-y-6 pb-12">

            {/* Toast */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 text-sm text-white shadow-2xl">
                    {toast}
                    <button onClick={() => setToast('')}><X className="h-4 w-4 opacity-60 hover:opacity-100" /></button>
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Delivery Failures</h1>
                    <p className="mt-1 text-sm text-gray-400">Unresolved failed delivery attempts across the network</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        {total} unresolved
                    </div>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
                    >
                        {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {showForm ? 'Cancel' : 'Log Failure'}
                    </button>
                </div>
            </div>

            {/* ── Add Form ── */}
            {showForm && (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
                    <h2 className="mb-5 text-base font-semibold text-gray-900">Log New Delivery Failure</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Shipment ID">
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                <input
                                    className={`${inp} pl-9`}
                                    type="number" placeholder="e.g. 4"
                                    value={form.shipment_id}
                                    onChange={e => setForm({ ...form, shipment_id: e.target.value })}
                                    required
                                />
                            </div>
                        </Field>

                        <Field label="Attempt Number">
                            <select
                                className={inp}
                                value={form.attempt_number}
                                onChange={e => setForm({ ...form, attempt_number: e.target.value })}
                            >
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>Attempt {n}</option>)}
                            </select>
                        </Field>

                        <Field label="Failure Reason">
                            <textarea
                                className={`${inp} resize-none`} rows={3}
                                placeholder="e.g. Customer not home during delivery window"
                                value={form.failure_reason}
                                onChange={e => setForm({ ...form, failure_reason: e.target.value })}
                                required
                            />
                        </Field>

                        <Field label="Retry Scheduled (optional)">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                <input
                                    className={`${inp} pl-9`}
                                    type="datetime-local"
                                    value={form.retry_scheduled}
                                    onChange={e => setForm({ ...form, retry_scheduled: e.target.value })}
                                />
                            </div>
                        </Field>

                        <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowForm(false)}
                                className="rounded-2xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition">
                                {submitting ? 'Saving…' : 'Log Failure'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Table ── */}
            <div className="rounded-3xl border border-gray-100 bg-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <h2 className="text-sm font-semibold text-gray-700">Failure Records</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-xl border border-gray-100 p-1.5 hover:bg-gray-50 disabled:opacity-30 transition"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span>Page {page} of {Math.max(1, totalPages)}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages}
                            className="rounded-xl border border-gray-100 p-1.5 hover:bg-gray-50 disabled:opacity-30 transition"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50/60">
                            <tr>
                                {['#', 'Tracking No', 'Receiver', 'Attempt', 'Failure Reason', 'Retry Scheduled', 'Action'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {failures.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <AlertCircle className="mx-auto h-8 w-8 text-gray-200 mb-2" />
                                        <p className="text-gray-300 text-sm">No unresolved delivery failures.</p>
                                    </td>
                                </tr>
                            ) : failures.map(f => (
                                <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3.5 text-gray-300 text-xs">#{f.id}</td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{f.tracking_no}</td>
                                    <td className="px-5 py-3.5 text-gray-700">{f.receiver_name}</td>
                                    <td className="px-5 py-3.5">
                                        <Pill label={`Attempt ${f.attempt_number}`} variant="gray" />
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">{f.failure_reason}</td>
                                    <td className="px-5 py-3.5">
                                        {f.retry_scheduled
                                            ? <Pill label={new Date(f.retry_scheduled).toLocaleDateString()} variant="amber" />
                                            : <span className="text-gray-300 text-xs">—</span>}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {role === 'admin' && (
                                            <button
                                                onClick={() => handleResolve(f.id)}
                                                title="Resolve & permanently delete"
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
