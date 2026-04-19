import { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
    TrendingUp, Users, MapPin, Package, BarChart2,
    AlertTriangle, Truck, Zap, Activity, ShieldCheck,
    Clock, DollarSign, ArrowUpRight
} from 'lucide-react';

// ─── Primitives ───────────────────────────────────────────────────────────────

const Card = ({ children, className = '' }) => (
    <div className={`rounded-3xl bg-white shadow-lg border border-gray-100 overflow-hidden ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ icon: Icon, title, subtitle, accent = 'blue' }) => {
    const accents = {
        blue:   'bg-blue-50   text-blue-600',
        green:  'bg-green-50  text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        red:    'bg-red-50    text-red-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        teal:   'bg-teal-50   text-teal-600',
    };
    return (
        <div className="px-6 py-5 border-b border-gray-50 flex items-start gap-4">
            <div className={`rounded-2xl p-2.5 ${accents[accent]}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
};

const DataTable = ({ heads, rows, emptyText = 'No records found.' }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
            <thead>
                <tr className="bg-gray-50/60">
                    {heads.map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {rows.length === 0
                    ? <tr><td colSpan={heads.length} className="px-5 py-10 text-center text-gray-300 text-sm">{emptyText}</td></tr>
                    : rows}
            </tbody>
        </table>
    </div>
);

const Pill = ({ label, variant = 'blue' }) => {
    const styles = {
        green:  'bg-green-50  text-green-700  ring-green-100',
        red:    'bg-red-50    text-red-700    ring-red-100',
        orange: 'bg-orange-50 text-orange-700 ring-orange-100',
        blue:   'bg-blue-50   text-blue-700   ring-blue-100',
        purple: 'bg-purple-50 text-purple-700 ring-purple-100',
        gray:   'bg-gray-50   text-gray-600   ring-gray-100',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[variant]}`}>
            {label}
        </span>
    );
};

const StatCard = ({ icon: Icon, label, value, sub, accent = 'blue' }) => {
    const accents = {
        blue:   'from-blue-500   to-blue-600',
        green:  'from-green-500  to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
    };
    return (
        <div className={`rounded-3xl bg-gradient-to-br ${accents[accent]} p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
                <div className="rounded-2xl bg-white/20 p-2.5">
                    <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/60" />
            </div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm font-medium mt-1 text-white/80">{label}</p>
            {sub && <p className="text-xs mt-1 text-white/60">{sub}</p>}
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Reports() {
    const [slaReport,     setSlaReport]     = useState([]);
    const [tracking,      setTracking]      = useState([]);
    const [delayLogs,     setDelayLogs]     = useState([]);
    const [hubActivity,   setHubActivity]   = useState([]);
    const [topCustomers,  setTopCustomers]  = useState([]);
    const [slaCustomers,  setSlaCustomers]  = useState([]);
    const [heavyShips,    setHeavyShips]    = useState([]);
    const [latestEvents,  setLatestEvents]  = useState([]);
    const [hubPairs,      setHubPairs]      = useState([]);
    const [weightMatch,   setWeightMatch]   = useState([]);
    const [hubCoverage,   setHubCoverage]   = useState([]);
    const [breachedTypes, setBreachedTypes] = useState([]);
    const [revenue,       setRevenue]       = useState([]);
    const [heaviestUD,    setHeaviestUD]    = useState([]);
    const [fnSlaStatus,   setFnSlaStatus]   = useState([]);
    const [fnDelay,       setFnDelay]       = useState([]);
    const [loading,       setLoading]       = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [
                advRes, delayRes, hubActRes, topCustRes,
                slaBreachRes, heavyRes, latestRes, pairsRes,
                weightRes, coverageRes, btRes, revRes,
                hdRes, fnRes
            ] = await Promise.allSettled([
                axios.get('/reports/advanced'),
                axios.get('/delay-logs?limit=20'),
                axios.get('/reports/hub-activity'),
                axios.get('/reports/top-customers'),
                axios.get('/reports/sla-breached-customers'),
                axios.get('/reports/heavy-shipments'),
                axios.get('/reports/latest-tracking'),
                axios.get('/reports/courier-hub-pairs'),
                axios.get('/reports/sla-weight-match'),
                axios.get('/reports/hub-coverage'),
                axios.get('/reports/breached-service-types'),
                axios.get('/reports/revenue'),
                axios.get('/reports/heaviest-undelivered'),
                axios.get('/reports/function-report'),
            ]);

            if (advRes.status === 'fulfilled') {
                setSlaReport(advRes.value.data.slaReport || []);
                setTracking(advRes.value.data.tracking || []);
            }
            if (delayRes.status     === 'fulfilled') setDelayLogs(delayRes.value.data.logs || []);
            if (hubActRes.status    === 'fulfilled') setHubActivity(hubActRes.value.data.hubs || []);
            if (topCustRes.status   === 'fulfilled') setTopCustomers(topCustRes.value.data.customers || []);
            if (slaBreachRes.status === 'fulfilled') setSlaCustomers(slaBreachRes.value.data.customers || []);
            if (heavyRes.status     === 'fulfilled') setHeavyShips(heavyRes.value.data.shipments || []);
            if (latestRes.status    === 'fulfilled') setLatestEvents(latestRes.value.data.results || []);
            if (pairsRes.status     === 'fulfilled') setHubPairs(pairsRes.value.data.pairs || []);
            if (weightRes.status    === 'fulfilled') setWeightMatch(weightRes.value.data.results || []);
            if (coverageRes.status  === 'fulfilled') setHubCoverage(coverageRes.value.data.hubs || []);
            if (btRes.status        === 'fulfilled') setBreachedTypes(btRes.value.data.types || []);
            if (revRes.status       === 'fulfilled') setRevenue(revRes.value.data.revenue || []);
            if (hdRes.status        === 'fulfilled') setHeaviestUD(hdRes.value.data.shipments || []);
            if (fnRes.status        === 'fulfilled') {
                setFnSlaStatus(fnRes.value.data.slaStatus || []);
                setFnDelay(fnRes.value.data.delayDuration || []);
            }
            setLoading(false);
        };
        load();
    }, []);

    // Stat summary values derived from loaded data
    const totalShipments = slaReport.reduce((a, r) => a + (r.total_shipments || 0), 0);
    const totalBreached  = slaReport.reduce((a, r) => a + (r.breached_count  || 0), 0);
    const totalRevenue   = revenue.reduce((a, r) => a + Number(r.total_revenue || 0), 0);
    const avgBreachPct   = totalShipments > 0 ? ((totalBreached / totalShipments) * 100).toFixed(1) : 0;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                <p className="text-sm text-slate-400 font-medium">Loading analytics…</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">

            {/* ── Page header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="mt-1 text-sm text-gray-400">Live data across all shipments, couriers, hubs and SLA policies</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['SLA', 'Hubs', 'Revenue', 'Logistics', 'Customers'].map(tag => (
                        <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">{tag}</span>
                    ))}
                </div>
            </div>

            {/* ── Summary stat cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Package}     label="Total Shipments"    value={totalShipments}               accent="blue"   sub="All service types" />
                <StatCard icon={ShieldCheck} label="SLA Breach Rate"    value={`${avgBreachPct}%`}           accent="orange" sub={`${totalBreached} violations`} />
                <StatCard icon={DollarSign}  label="Total Revenue"      value={`₹${totalRevenue.toLocaleString()}`} accent="green"  sub="Across all services" />
                <StatCard icon={Clock}       label="Delayed Shipments"  value={delayLogs.length}             accent="purple" sub="Logged delay events" />
            </div>

            {/* ── SLA Compliance by Service ── */}
            <Card>
                <CardHeader icon={ShieldCheck} title="SLA Compliance by Service Type" subtitle="Breach rate per service tier" accent="blue" />
                <DataTable
                    heads={['Service', 'Total', 'Breached', 'On Time', 'Breach Rate']}
                    rows={slaReport.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-gray-800">{r.service_type}</td>
                            <td className="px-5 py-3.5 text-gray-600">{r.total_shipments}</td>
                            <td className="px-5 py-3.5 text-red-500 font-semibold">{r.breached_count}</td>
                            <td className="px-5 py-3.5 text-green-600">{r.total_shipments - r.breached_count}</td>
                            <td className="px-5 py-3.5">
                                <Pill label={`${r.breach_percentage}%`} variant={r.breach_percentage > 20 ? 'red' : 'green'} />
                            </td>
                        </tr>
                    ))}
                />
            </Card>

            {/* ── Revenue Analytics ── */}
            <Card>
                <CardHeader icon={TrendingUp} title="Revenue by Service Type" subtitle="Charges across all active shipments" accent="green" />
                <DataTable
                    heads={['Service', 'Shipments', 'Avg Charge (₹)', 'Min (₹)', 'Max (₹)', 'Total Revenue (₹)']}
                    rows={revenue.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-gray-800">{r.service_type}</td>
                            <td className="px-5 py-3.5 text-gray-600">{r.total_shipments}</td>
                            <td className="px-5 py-3.5 text-gray-600">{r.avg_charge}</td>
                            <td className="px-5 py-3.5 text-gray-600">{r.min_charge}</td>
                            <td className="px-5 py-3.5 text-gray-600">{r.max_charge}</td>
                            <td className="px-5 py-3.5 font-bold text-green-700">{Number(r.total_revenue).toLocaleString()}</td>
                        </tr>
                    ))}
                />
            </Card>

            {/* ── Live Shipment Tracking Feed ── */}
            <Card>
                <CardHeader icon={Activity} title="Live Shipment Status" subtitle="Most recent state of each shipment" accent="indigo" />
                <DataTable
                    heads={['Tracking No', 'Sender', 'Receiver', 'Status', 'Last Location', 'Expected', 'SLA']}
                    rows={tracking.map((t, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{t.tracking_no}</td>
                            <td className="px-5 py-3.5 text-gray-700">{t.sender_name}</td>
                            <td className="px-5 py-3.5 text-gray-700">{t.receiver_name}</td>
                            <td className="px-5 py-3.5"><Pill label={t.current_state || 'Booked'} variant="blue" /></td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">{t.last_location || '—'}</td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">
                                {t.expected_delivery_date ? new Date(t.expected_delivery_date).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-5 py-3.5">
                                {t.is_sla_breached
                                    ? <Pill label="Breached" variant="red" />
                                    : <Pill label="On Track"  variant="green" />}
                            </td>
                        </tr>
                    ))}
                />
            </Card>

            {/* ── Latest Event per Shipment ── */}
            <Card>
                <CardHeader icon={Activity} title="Latest Tracking Event per Shipment" subtitle="Current last-known status for every shipment" accent="indigo" />
                <DataTable
                    heads={['Tracking No', 'Sender', 'Receiver', 'Status', 'Location', 'Time']}
                    rows={latestEvents.map((e, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{e.tracking_no}</td>
                            <td className="px-5 py-3.5 text-gray-700">{e.sender_name}</td>
                            <td className="px-5 py-3.5 text-gray-700">{e.receiver_name}</td>
                            <td className="px-5 py-3.5"><Pill label={e.latest_status} variant="blue" /></td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">{e.latest_location}</td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(e.latest_event_time).toLocaleString()}</td>
                        </tr>
                    ))}
                />
            </Card>

            {/* ── Delay Log ── */}
            <Card>
                <CardHeader icon={Clock} title="Delay Log" subtitle="Shipments that had delivery delays reported" accent="orange" />
                <DataTable
                    heads={['Tracking No', 'Service', 'Reason', 'Expected Delivery', 'Reported']}
                    rows={delayLogs.map((d, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{d.tracking_no}</td>
                            <td className="px-5 py-3.5 text-gray-700">{d.service_type}</td>
                            <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">{d.delay_reason}</td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">
                                {d.expected_delivery_date ? new Date(d.expected_delivery_date).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(d.reported_at).toLocaleString()}</td>
                        </tr>
                    ))}
                />
            </Card>

            {/* ── Two-column: top customers + SLA-breached customers ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader icon={Users} title="High-Value Customers" subtitle="Customers with 3+ shipments" accent="purple" />
                    <DataTable
                        heads={['Customer', 'Email', 'Shipments', 'Total (₹)']}
                        rows={topCustomers.map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-gray-800">{c.full_name}</td>
                                <td className="px-5 py-3.5 text-gray-400 text-xs">{c.email}</td>
                                <td className="px-5 py-3.5"><Pill label={c.total_shipments} variant="purple" /></td>
                                <td className="px-5 py-3.5 font-semibold text-gray-700">{Number(c.total_charged || 0).toLocaleString()}</td>
                            </tr>
                        ))}
                    />
                </Card>

                <Card>
                    <CardHeader icon={AlertTriangle} title="Customers Affected by SLA Breach" subtitle="Accounts with at least one late delivery" accent="red" />
                    <DataTable
                        heads={['#', 'Customer', 'Email']}
                        rows={slaCustomers.map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3.5 text-gray-300 text-xs">#{c.id}</td>
                                <td className="px-5 py-3.5 font-medium text-gray-800">{c.full_name}</td>
                                <td className="px-5 py-3.5 text-gray-400 text-xs">{c.email}</td>
                            </tr>
                        ))}
                    />
                </Card>
            </div>

            {/* ── Two-column: heavy shipments + top 5 undelivered ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader icon={Package} title="Above-Average Weight Shipments" subtitle="Shipments heavier than network average" accent="blue" />
                    <DataTable
                        heads={['Tracking No', 'Weight', 'Service', 'Charge (₹)']}
                        rows={heavyShips.map((s, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{s.tracking_no}</td>
                                <td className="px-5 py-3.5 font-bold text-gray-800">{s.weight} kg</td>
                                <td className="px-5 py-3.5 text-gray-600">{s.service_type}</td>
                                <td className="px-5 py-3.5 text-gray-600">{s.base_charge}</td>
                            </tr>
                        ))}
                    />
                </Card>

                <Card>
                    <CardHeader icon={Package} title="Top 5 Heaviest Pending Deliveries" subtitle="Undelivered shipments sorted by weight" accent="orange" />
                    <DataTable
                        heads={['Tracking No', 'Weight', 'Service', 'Status']}
                        rows={heaviestUD.map((s, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{s.tracking_no}</td>
                                <td className="px-5 py-3.5 font-bold text-gray-800">{s.weight} kg</td>
                                <td className="px-5 py-3.5 text-gray-600">{s.service_type}</td>
                                <td className="px-5 py-3.5"><Pill label={s.current_state} variant="orange" /></td>
                            </tr>
                        ))}
                    />
                </Card>
            </div>

            {/* ── Hub Overview ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader icon={MapPin} title="Hub Activity" subtitle="Shipments linked to each hub" accent="green" />
                    <DataTable
                        heads={['Hub', 'Location', 'Capacity', 'Linked Shipments']}
                        rows={hubActivity.map((h, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-gray-800">{h.hub_name}</td>
                                <td className="px-5 py-3.5 text-gray-400 text-xs">{h.location}</td>
                                <td className="px-5 py-3.5 text-gray-600">{h.capacity}</td>
                                <td className="px-5 py-3.5"><Pill label={h.active_shipments} variant="green" /></td>
                            </tr>
                        ))}
                    />
                </Card>

                <Card>
                    <CardHeader icon={MapPin} title="Hub Network Coverage" subtitle="All hubs including those with no current activity" accent="teal" />
                    <DataTable
                        heads={['Hub', 'Location', 'Capacity', 'Activity']}
                        rows={hubCoverage.map((h, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-gray-800">{h.hub_name}</td>
                                <td className="px-5 py-3.5 text-gray-400 text-xs">{h.location}</td>
                                <td className="px-5 py-3.5 text-gray-600">{h.capacity}</td>
                                <td className="px-5 py-3.5">
                                    <Pill
                                        label={h.linked_shipments === 0 ? 'Idle' : `${h.linked_shipments} shipments`}
                                        variant={h.linked_shipments === 0 ? 'gray' : 'green'}
                                    />
                                </td>
                            </tr>
                        ))}
                    />
                </Card>
            </div>

            {/* ── Courier Pairs at Same Hub ── */}
            <Card>
                <CardHeader icon={Truck} title="Courier Co-location" subtitle="Active couriers currently stationed at the same hub" accent="purple" />
                <DataTable
                    heads={['Courier A', 'Courier B', 'Shared Hub']}
                    rows={hubPairs.length === 0
                        ? []
                        : hubPairs.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-gray-800">#{p.courier1_id} — {p.courier1_name}</td>
                                <td className="px-5 py-3.5 font-medium text-gray-800">#{p.courier2_id} — {p.courier2_name}</td>
                                <td className="px-5 py-3.5"><Pill label={p.hub_name} variant="purple" /></td>
                            </tr>
                        ))
                    }
                    emptyText="No couriers currently co-located."
                />
            </Card>

            {/* ── SLA Weight Match ── */}
            <Card>
                <CardHeader icon={BarChart2} title="SLA Policy Match by Weight" subtitle="Shipments matched to their SLA tier based on weight range" accent="blue" />
                <DataTable
                    heads={['Tracking No', 'Weight', 'Service', 'Max Delivery (hrs)', 'SLA Policy']}
                    rows={weightMatch.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{r.tracking_no}</td>
                            <td className="px-5 py-3.5 font-medium text-gray-800">{r.weight} kg</td>
                            <td className="px-5 py-3.5 text-gray-600">{r.service_type}</td>
                            <td className="px-5 py-3.5 text-gray-600">{r.max_delivery_hours}h</td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs max-w-xs truncate">{r.sla_policy}</td>
                        </tr>
                    ))}
                />
            </Card>

            {/* ── Breached service types — tag cloud ── */}
            <Card>
                <CardHeader icon={AlertTriangle} title="Service Types with SLA Breach History" subtitle="Categories that have recorded at least one breach" accent="red" />
                <div className="p-6 flex flex-wrap gap-3">
                    {breachedTypes.length === 0
                        ? <p className="text-sm text-gray-300">No breach history — all service types are compliant.</p>
                        : breachedTypes.map((t, i) => (
                            <span key={i} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                                <AlertTriangle className="h-3.5 w-3.5" /> {t.service_type}
                            </span>
                        ))
                    }
                </div>
            </Card>

            {/* ── SLA status per shipment (fn_sla_status) ── */}
            <Card>
                <CardHeader icon={ShieldCheck} title="Per-Shipment SLA Status" subtitle="Computed delivery compliance for every shipment" accent="green" />
                <DataTable
                    heads={['Tracking No', 'Service', 'Expected Delivery', 'SLA Result']}
                    rows={fnSlaStatus.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{s.tracking_no}</td>
                            <td className="px-5 py-3.5 text-gray-700">{s.service_type}</td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">
                                {s.expected_delivery_date ? new Date(s.expected_delivery_date).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-5 py-3.5">
                                <Pill
                                    label={s.sla_status}
                                    variant={s.sla_status === 'Met' ? 'green' : s.sla_status === 'Breached' ? 'red' : 'orange'}
                                />
                            </td>
                        </tr>
                    ))}
                />
            </Card>

            {/* ── Delay duration per shipment (fn_delay_duration) ── */}
            <Card>
                <CardHeader icon={Zap} title="Delivery Delay Analysis" subtitle="Hours late per successfully delivered shipment" accent="orange" />
                <DataTable
                    heads={['Tracking No', 'Service', 'Expected', 'Delivered', 'Hours Late']}
                    rows={fnDelay.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-xs text-blue-500">{s.tracking_no}</td>
                            <td className="px-5 py-3.5 text-gray-700">{s.service_type}</td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">
                                {s.expected_delivery_date ? new Date(s.expected_delivery_date).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">
                                {s.delivery_time ? new Date(s.delivery_time).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-5 py-3.5 font-bold text-orange-500">{s.delay_hours}h</td>
                        </tr>
                    ))}
                />
            </Card>

        </div>
    );
}
