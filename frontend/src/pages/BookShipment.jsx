import { useState } from 'react';
import { ArrowRight, Package, MapPin, Truck } from 'lucide-react';
import axios from '../api/axios';

export default function BookShipment() {
    const [formData, setFormData] = useState({
        sender_name: '', sender_address: '',
        receiver_name: '', receiver_address: '',
        weight: '', service_type: 'Standard'
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Booking shipment...' });
        setIsLoading(true);
        try {
            const res = await axios.post('/shipments', formData);
            setStatus({ type: 'success', message: `Booking confirmed! Tracking No: ${res.data.tracking_no}` });
            setFormData({ sender_name: '', sender_address: '', receiver_name: '', receiver_address: '', weight: '', service_type: 'Standard' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to book shipment' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Book a Shipment</h1>
                        <p className="mt-2 text-gray-600 max-w-2xl">
                            Create a new order with fast dispatch options and full visibility across your delivery network.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                        <div className="rounded-2xl bg-blue-50 p-4">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="rounded-2xl bg-green-50 p-4">
                            <Truck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="rounded-2xl bg-indigo-50 p-4">
                            <MapPin className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                </div>
            </div>

            {status.message && (
                <div className={`rounded-2xl p-4 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : status.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                    {status.message}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipment Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                <h3 className="text-base font-semibold text-slate-900">Sender Information</h3>
                                <div>
                                    <label className="block text-sm text-slate-500 mb-2">Sender Name</label>
                                    <input type="text" name="sender_name" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.sender_name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-500 mb-2">Sender Address</label>
                                    <textarea name="sender_address" rows="4" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.sender_address} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                <h3 className="text-base font-semibold text-slate-900">Receiver Information</h3>
                                <div>
                                    <label className="block text-sm text-slate-500 mb-2">Receiver Name</label>
                                    <input type="text" name="receiver_name" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.receiver_name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-500 mb-2">Receiver Address</label>
                                    <textarea name="receiver_address" rows="4" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.receiver_address} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <label className="block text-sm text-slate-500 mb-2">Weight (kg)</label>
                                <input type="number" step="0.01" name="weight" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.weight} onChange={handleChange} required />
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <label className="block text-sm text-slate-500 mb-2">Service Level</label>
                                <select name="service_type" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" onChange={handleChange} value={formData.service_type}>
                                    <option value="Standard">Standard (up to 72h)</option>
                                    <option value="Express">Express (up to 24h)</option>
                                    <option value="Overnight">Overnight (up to 12h)</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                            {isLoading ? 'Booking...' : 'Confirm & Generate Tracking'}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Why choose premium logistics</p>
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">Fast, transparent and reliable</h3>
                        <p className="mt-3 text-slate-600">Optimize delivery performance with order tracking, SLA monitoring, and shipment alerts built for modern operations.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Current Priority</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">Express Dispatch</p>
                            </div>
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="mt-5 space-y-3 text-slate-600">
                            <p>• Dedicated route planning</p>
                            <p>• SLA tracking enabled</p>
                            <p>• Automatic confirmation email</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
