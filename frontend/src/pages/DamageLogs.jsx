import { useEffect, useState } from 'react';
import {
    ShieldAlert, ChevronLeft, ChevronRight,
    Plus, X, Hash, AlertTriangle
} from 'lucide-react';
import axios from '../api/axios';

// ─── severity config ─────────────────────────────────────────────────────────
const SEVERITY = {
    Minor:    { pill: 'bg-yellow-50 text-yellow-700 ring-yellow-100', dot: 'bg-yellow-400' },
    Major:    { pill: 'bg-orange-50 text-orange-700 ring-orange-100', dot: 'bg-orange-500' },
    Critical: { pill: 'bg-red-50    text-red-700    ring-red-100',    dot: 'bg-red-600'    },
};

const SeverityBadge = ({ value }) => {
    const cfg = SEVERITY[value] || SEVERITY.Minor;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cfg.pill}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {value}
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

export default function DamageLogs() {
    const [logs, setLogs]           = useState([]);
    const [total, setTotal]         = useState(0);
    const [page, setPage]           = useState(1);
    const [showForm, setShowForm]   = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast]         = useState('');

    const [form, setForm] = useState({
        shipment_id: '',
        damage_description: '',
        severity: 'Minor',
    });

    // ── fetch ────────────────────────────────────────────────────────────────
    const fetchLogs = async () => {
        try {
            const res = await axios.get(`/damage-logs?page=${page}&limit=10`);
            setLogs(res.data.logs || []);
            setTotal(res.data.total || 0);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchLogs(); }, [page]);

    // ── submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('/damage-logs', {
                shipment_id:        parseInt(form.shipment_id),
                damage_description: form.damage_description,
                severity:           form.severity,
            });
            setToast('Damage report filed successfully.');
            setShowForm(false);
            setForm({ shipment_id: '', damage_description: '', severity: 'Minor' });
            fetchLogs();
        } catch (err) {
            setToast(err.response?.data?.error || 'Failed to file report.');
        } finally {
            setSubmitting(false);
            setTimeout(() => setToast(''), 3500);
        }
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
                    <h1 className="text-2xl font-bold text-gray-900">Damage Logs</h1>
                    <p className="mt-1 text-sm text-gray-400">Package damage incidents reported by staff during transit</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                        <ShieldAlert className="h-4 w-4" />
                        {total} incidents
                    </div>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
                    >
                        {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {showForm ? 'Cancel' : 'Report Damage'}
                    </button>
                </div>
            </div>

            {/* ── Severity Legend ── */}
            <div className="flex flex-wrap gap-3">
                {Object.entries(SEVERITY).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`h-2 w-2 rounded-full ${val.dot}`} />
                        {key}
                    </div>
                ))}
            </div>

            {/* ── Add Form ── */}
            {showForm && (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
                    <h2 className="mb-5 text-base font-semibold text-gray-900">File Damage Report</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <Field label="Shipment ID">
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                <input
                                    className={`${inp} pl-9`}
                                    type="number" placeholder="e.g. 2"
                                    value={form.shipment_id}
                                    onChange={e => setForm({ ...form, shipment_id: e.target.value })}
                                    required
                                />
                            </div>
                        </Field>

                        <Field label="Severity Level">
                            <select
                                className={inp}
                                value={form.severity}
                                onChange={e => setForm({ ...form, severity: e.target.value })}
                            >
                                <option value="Minor">Minor — cosmetic damage, contents intact</option>
                                <option value="Major">Major — product may be compromised</option>
                                <option value="Critical">Critical — contents lost or destroyed</option>
                            </select>
                        </Field>

                        <Field label="Damage Description">
                            <textarea
                                className={`${inp} resize-none sm:col-span-2`} rows={3}
                                placeholder="e.g. Outer carton crushed at one corner, inner items visually intact after inspection"
                                value={form.damage_description}
                                onChange={e => setForm({ ...form, damage_description: e.target.value })}
                                required
                            />
                        </Field>

                        <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowForm(false)}
                                className="rounded-2xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60 transition">
                                {submitting ? 'Filing…' : 'File Report'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Table ── */}
            <div className="rounded-3xl border border-gray-100 bg-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <h2 className="text-sm font-semibold text-gray-700">Incident Reports</h2>
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
                                {['#', 'Tracking No', 'Sender', 'Receiver', 'Severity', 'Description', 'Reported By', 'Time'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center">
                                        <AlertTriangle className="mx-auto h-8 w-8 text-gray-200 mb-2" />
                                        <p className="text-gray-300 text-sm">No damage incidents recorded.</p>
                                    </td>
                                </tr>
                            ) : logs.map(l => (
                                <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3.5 text-gray-300 text-xs">#{l.id}</td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{l.tracking_no}</td>
                                    <td className="px-5 py-3.5 text-gray-600 text-xs">{l.sender_name}</td>
                                    <td className="px-5 py-3.5 text-gray-600 text-xs">{l.receiver_name}</td>
                                    <td className="px-5 py-3.5"><SeverityBadge value={l.severity || 'Minor'} /></td>
                                    <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate" title={l.damage_description}>{l.damage_description}</td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">{l.reported_by_user || '—'}</td>
                                    <td className="px-5 py-3.5 text-gray-300 text-xs whitespace-nowrap">
                                        {new Date(l.reported_at).toLocaleString()}
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
