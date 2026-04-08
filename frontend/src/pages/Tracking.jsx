import { useState } from 'react';
import { Search, MapPin, Clock, AlertTriangle, Package } from 'lucide-react';
import axios from '../api/axios';

export default function Tracking() {
    const [trackingNo, setTrackingNo] = useState('');
    const [shipment, setShipment] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        setError('');
        setShipment(null);
        setEvents([]);
        setIsLoading(true);
        try {
            const res = await axios.get(`/tracking/${trackingNo}`);
            setShipment(res.data.shipment);
            setEvents(res.data.events);
        } catch (err) {
            setError(err.response?.data?.error || 'Tracking failed');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Delivered') return 'text-emerald-600 bg-emerald-50';
        if (status === 'Delayed') return 'text-rose-600 bg-rose-50';
        return 'text-sky-600 bg-sky-50';
    };

    return (
        <div className="space-y-8">
            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Shipment Tracking</h1>
                        <p className="mt-2 text-gray-600 max-w-2xl">Track your order with a shipment ID and see a status timeline instantly.</p>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                        <Package className="h-6 w-6 text-blue-600" />
                        <MapPin className="h-6 w-6 text-sky-600" />
                        <Clock className="h-6 w-6 text-emerald-600" />
                    </div>
                </div>
            </div>

            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 p-8">
                <form onSubmit={handleTrack} className="grid gap-6 lg:grid-cols-[1fr_auto] items-end">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Tracking number</label>
                        <div className="mt-2 relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="e.g. TRK2023100101"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-4 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                value={trackingNo}
                                onChange={(e) => setTrackingNo(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-white font-semibold shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {isLoading ? 'Searching...' : 'Track Shipment'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700">{error}</div>
                )}
            </div>

            {shipment && (
                <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-3xl bg-white shadow-xl border border-gray-200 p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Shipment Overview</h2>
                                <p className="mt-2 text-gray-600">Detailed delivery status for shipment {shipment.tracking_no}.</p>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(shipment.current_status)}`}>
                                {shipment.current_status || 'Booked'}
                            </span>
                        </div>

                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100">
                                <p className="text-sm text-slate-500">Sender</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">{shipment.sender_name}</p>
                                <p className="mt-1 text-slate-600">{shipment.sender_address}</p>
                            </div>
                            <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100">
                                <p className="text-sm text-slate-500">Receiver</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">{shipment.receiver_name}</p>
                                <p className="mt-1 text-slate-600">{shipment.receiver_address}</p>
                            </div>
                            <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100">
                                <p className="text-sm text-slate-500">Estimated Delivery</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">{new Date(shipment.expected_delivery_date).toLocaleDateString()}</p>
                            </div>
                            <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100">
                                <p className="text-sm text-slate-500">Service</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">{shipment.service_type}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking History</h3>
                            <div className="space-y-4">
                                {events.length > 0 ? events.map((event, idx) => (
                                    <div key={idx} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{event.status}</p>
                                                <p className="mt-1 text-sm text-slate-600">{event.location}</p>
                                            </div>
                                            <span className="text-sm text-slate-500">{new Date(event.event_time).toLocaleString()}</span>
                                        </div>
                                        {event.description && <p className="mt-3 text-sm text-slate-600">{event.description}</p>}
                                    </div>
                                )) : (
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">No tracking events have been recorded yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl">
                            <h3 className="text-xl font-semibold">Need faster updates?</h3>
                            <p className="mt-3 text-sm text-blue-100">Upgrade to priority notifications and get proactive delivery alerts for every movement.</p>
                        </div>
                        <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-slate-700">
                                <MapPin className="h-5 w-5 text-sky-600" />
                                <p className="font-medium">Live estimated delivery windows</p>
                            </div>
                            <div className="mt-4 flex items-center gap-3 text-slate-700">
                                <Clock className="h-5 w-5 text-emerald-600" />
                                <p className="font-medium">SLA breach alerts and recovery actions</p>
                            </div>
                            <div className="mt-4 flex items-center gap-3 text-slate-700">
                                <AlertTriangle className="h-5 w-5 text-rose-600" />
                                <p className="font-medium">Delay reason tracking for every incident</p>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}