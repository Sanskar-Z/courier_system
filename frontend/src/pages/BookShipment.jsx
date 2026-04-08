import { useState } from 'react';
import axios from '../api/axios';

export default function BookShipment() {
    const [formData, setFormData] = useState({
        sender_name: '', sender_address: '',
        receiver_name: '', receiver_address: '',
        weight: '', service_type: 'Standard'
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Booking shipment...' });
        try {
            const res = await axios.post('/shipments', formData);
            setStatus({ type: 'success', message: `Booking Confirmed! Tracking No: ${res.data.tracking_no}` });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to book shipment' });
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Book a New Shipment</h2>
            
            {status.message && (
                <div className={`p-4 rounded mb-6 font-medium ${status.type === 'success' ? 'bg-green-100 text-green-800' : status.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">Sender Information</h3>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Sender Name</label>
                            <input type="text" name="sender_name" className="w-full border p-2 rounded" value={formData.sender_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Sender Address</label>
                            <textarea name="sender_address" className="w-full border p-2 rounded" value={formData.sender_address} onChange={handleChange} required></textarea>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">Receiver Information</h3>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Receiver Name</label>
                            <input type="text" name="receiver_name" className="w-full border p-2 rounded" value={formData.receiver_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Receiver Address</label>
                            <textarea name="receiver_address" className="w-full border p-2 rounded" value={formData.receiver_address} onChange={handleChange} required></textarea>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                        <input type="number" step="0.01" name="weight" className="w-full border p-2 rounded" value={formData.weight} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Service Level</label>
                        <select name="service_type" className="w-full border p-2 rounded bg-white" onChange={handleChange} value={formData.service_type}>
                            <option value="Standard">Standard (up to 72h)</option>
                            <option value="Express">Express (up to 24h)</option>
                            <option value="Overnight">Overnight (up to 12h)</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors shadow-md">
                    Confirm & Generate Tracking
                </button>
            </form>
        </div>
    );
}
