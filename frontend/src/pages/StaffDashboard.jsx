import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Truck, MapPin, ShieldCheck, Users, Activity } from 'lucide-react';
import axios from '../api/axios';

export default function StaffDashboard() {
    const role = localStorage.getItem('role');
    const [activeTab, setActiveTab] = useState('events');
    const [formData, setFormData] = useState({});
    const [statusMsg, setStatusMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [couriers, setCouriers] = useState([]);
    const [couriersLoading, setCouriersLoading] = useState(false);
    const [couriersError, setCouriersError] = useState('');

    const availableTabs = useMemo(() => (
        role === 'admin'
            ? ['events', 'delay', 'delivery', 'hub', 'courier', 'assign']
            : ['events', 'delay', 'delivery', 'assign']
    ), [role]);

    const loadCouriers = async () => {
        setCouriersLoading(true);
        setCouriersError('');
        try {
            const response = await axios.get('/couriers');
            setCouriers(response.data);
        } catch {
            setCouriersError('Unable to load courier list.');
        } finally {
            setCouriersLoading(false);
        }
    };

    useEffect(() => {
        if (role !== 'customer') {
            loadCouriers();
        }
    }, [role]);

    useEffect(() => {
        if (!availableTabs.includes(activeTab)) {
            setActiveTab('events');
        }
    }, [activeTab, availableTabs]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAction = async (e, endpoint, isPut = false) => {
        e.preventDefault();
        setStatusMsg('');
        setIsLoading(true);
        try {
            const method = isPut ? axios.put : axios.post;
            await method(endpoint, formData);
            setStatusMsg('Action completed successfully!');
            setFormData({});
            if (activeTab === 'courier') {
                loadCouriers();
            }
        } catch (err) {
            setStatusMsg(err.response?.data?.error || 'Action failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (role === 'customer') {
        return (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
                <p className="text-xl font-semibold">Unauthorized</p>
                <p className="mt-2 text-sm text-rose-600">Staff and admin users can access this section.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Operations Console</h1>
                        <p className="mt-2 text-gray-600">Manage events, assign couriers, and keep delivery operations running smoothly.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                            <ClipboardList className="mx-auto h-6 w-6 text-blue-600" />
                            <p className="mt-3 text-sm text-slate-500">Event Logs</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                            <Truck className="mx-auto h-6 w-6 text-green-600" />
                            <p className="mt-3 text-sm text-slate-500">Dispatch</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                            <ShieldCheck className="mx-auto h-6 w-6 text-indigo-600" />
                            <p className="mt-3 text-sm text-slate-500">Compliance</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
                        <p className="mt-1 text-gray-600">Pick the workflow you need and complete operational updates in one place.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {availableTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                                {tab === 'events' ? 'Log Event' : tab === 'delay' ? 'Report Delay' : tab === 'delivery' ? 'Record Delivery' : tab === 'hub' ? 'Add Hub' : tab === 'courier' ? 'Add Courier' : 'Assign Courier'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Need a record ID?</p>
                    <p className="mt-2">Use the courier list below for courier IDs, and open Dashboard for shipment IDs. If you just created a courier, the new courier will appear in the list so you can copy its ID immediately.</p>
                </div>

                {statusMsg && (
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-sky-50 p-4 text-sm font-medium text-sky-700">
                        {statusMsg}
                    </div>
                )}

                <div className="mt-8 grid gap-10 xl:grid-cols-[0.65fr_0.35fr]">
                    <section className="space-y-8">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Current Workflow</p>
                                    <h3 className="mt-3 text-xl font-semibold text-slate-900">
                                        {activeTab === 'events' ? 'Log shipment event' : activeTab === 'delay' ? 'Report a delay' : activeTab === 'delivery' ? 'Record delivery outcome' : activeTab === 'hub' ? 'Create new hub' : activeTab === 'courier' ? 'Add a courier' : 'Assign courier'}
                                    </h3>
                                </div>
                                <Activity className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <form onSubmit={(e) => handleAction(e, activeTab === 'events' ? '/tracking/event' : activeTab === 'delay' ? '/tracking/delay' : activeTab === 'delivery' ? '/deliveries' : activeTab === 'hub' ? '/hubs' : activeTab === 'courier' ? '/couriers' : `/shipments/${formData.id}/assign`, activeTab === 'assign')} className="space-y-6">
                                {(activeTab === 'events' || activeTab === 'delay' || activeTab === 'delivery') && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <input type="number" name="shipment_id" placeholder="Shipment ID" value={formData.shipment_id || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                                        {activeTab === 'delivery' && (
                                            <input type="number" name="courier_id" placeholder="Courier ID" value={formData.courier_id || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                                        )}
                                    </div>
                                )}

                                {activeTab === 'events' && (
                                    <>
                                        <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required>
                                            <option value="">Select Status</option>
                                            <option value="In Transit">In Transit</option>
                                            <option value="Arrived at Hub">Arrived at Hub</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                        </select>
                                        <input type="text" name="location" placeholder="Current Location" value={formData.location || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                                        <textarea name="description" placeholder="Description / Notes" value={formData.description || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" rows="4" />
                                    </>
                                )}

                                {activeTab === 'delay' && (
                                    <>
                                        <textarea name="reason" placeholder="Delay Reason" value={formData.reason || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" rows="4" required />
                                    </>
                                )}

                                {activeTab === 'delivery' && (
                                    <>
                                        <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required>
                                            <option value="">Select Status</option>
                                            <option value="Successful">Successful</option>
                                            <option value="Failed">Failed</option>
                                        </select>
                                        <input type="text" name="recipient_signature" placeholder="Recipient Name" value={formData.recipient_signature || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" />
                                        <textarea name="notes" placeholder="Notes" value={formData.notes || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" rows="4" />
                                    </>
                                )}

                                {activeTab === 'hub' && (
                                    <>
                                        <input type="text" name="name" placeholder="Hub Name" value={formData.name || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                                        <input type="text" name="location" placeholder="Address / Location" value={formData.location || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                                        <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" />
                                    </>
                                )}

                                {activeTab === 'courier' && (
                                    <>
                                        <input type="text" name="name" placeholder="Courier Name" value={formData.name || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                                        <input type="text" name="vehicle_type" placeholder="Vehicle Type" value={formData.vehicle_type || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" />
                                        <input type="text" name="contact_number" placeholder="Contact Phone" value={formData.contact_number || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                                    </>
                                )}

                                {activeTab === 'assign' && (
                                    <>
                                        <input type="number" name="id" placeholder="Shipment ID" value={formData.id || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                                        <input type="number" name="courier_id" placeholder="Courier ID" value={formData.courier_id || ''} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" required />
                                    </>
                                )}

                                <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    {isLoading ? 'Processing...' : 'Submit Action'}
                                </button>
                            </form>
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <div className="flex items-center gap-3">
                                <Users className="h-6 w-6 text-slate-700" />
                                <div>
                                    <p className="text-sm text-slate-500">Team Operations</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">Aligned across hubs</p>
                                </div>
                            </div>
                            <p className="mt-4 text-slate-600">Maintain consistent courier assignments, route updates, and delivery reporting without leaving the dashboard.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <div className="flex items-center gap-3">
                                <Truck className="h-6 w-6 text-green-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Courier IDs</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">Available couriers</p>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-slate-600">
                                {couriersLoading ? (
                                    <p>Loading courier list...</p>
                                ) : couriersError ? (
                                    <p>{couriersError}</p>
                                ) : couriers.length > 0 ? (
                                    <div className="space-y-2">
                                        {couriers.map((courier) => (
                                            <div key={courier.id} className="rounded-2xl bg-slate-100 px-3 py-2">
                                                <p className="font-medium text-slate-800">ID: {courier.id}</p>
                                                <p className="text-slate-500">{courier.name} · {courier.vehicle_type || 'No vehicle type'}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No couriers found yet. Add one using the Add Courier tab.</p>
                                )}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-6 w-6 text-sky-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Coverage</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">Regional hub support</p>
                                </div>
                            </div>
                            <div className="mt-4 space-y-3 text-slate-600">
                                <p>• Fast route updates</p>
                                <p>• SLA tracking</p>
                                <p>• Incident logging</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
