import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function StaffDashboard() {
    const [activeTab, setActiveTab] = useState('events');
    const [formData, setFormData] = useState({});
    const [statusMsg, setStatusMsg] = useState('');
    const role = localStorage.getItem('role');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAction = async (e, endpoint, isPut = false) => {
        e.preventDefault();
        try {
            const method = isPut ? axios.put : axios.post;
            await method(endpoint, formData);
            setStatusMsg('Action completed successfully!');
            setFormData({});
        } catch (err) {
            setStatusMsg(err.response?.data?.error || 'Action failed');
        }
    };

    if (role === 'customer') return <div className="p-10 text-center">Unauthorized.</div>;

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow border">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Staff & Admin Operations</h2>
            
            <div className="flex gap-4 border-b mb-6">
                <button onClick={() => setActiveTab('events')} className={`pb-2 px-4 font-semibold ${activeTab === 'events' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Log Event</button>
                <button onClick={() => setActiveTab('delay')} className={`pb-2 px-4 font-semibold ${activeTab === 'delay' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Report Delay</button>
                <button onClick={() => setActiveTab('delivery')} className={`pb-2 px-4 font-semibold ${activeTab === 'delivery' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Record Delivery</button>
                {role === 'admin' && (
                    <>
                        <button onClick={() => setActiveTab('hub')} className={`pb-2 px-4 font-semibold ${activeTab === 'hub' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Add Hub</button>
                        <button onClick={() => setActiveTab('courier')} className={`pb-2 px-4 font-semibold ${activeTab === 'courier' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Add Courier</button>
                        <button onClick={() => setActiveTab('assign')} className={`pb-2 px-4 font-semibold ${activeTab === 'assign' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Assign Courier</button>
                    </>
                )}
            </div>

            {statusMsg && <div className="bg-gray-100 p-3 mb-6 rounded text-center font-medium text-blue-800">{statusMsg}</div>}

            {activeTab === 'events' && (
                <form onSubmit={(e) => handleAction(e, '/tracking/event')} className="space-y-4 max-w-md">
                    <input type="number" name="shipment_id" placeholder="Shipment ID" className="w-full border p-2" onChange={handleChange} required />
                    <select name="status" className="w-full border p-2" onChange={handleChange} required>
                        <option value="">Select Status</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Arrived at Hub">Arrived at Hub</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                    </select>
                    <input type="text" name="location" placeholder="Current Location" className="w-full border p-2" onChange={handleChange} required />
                    <textarea name="description" placeholder="Description/Notes" className="w-full border p-2" onChange={handleChange}></textarea>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Event</button>
                </form>
            )}

            {activeTab === 'delay' && (
                <form onSubmit={(e) => handleAction(e, '/tracking/delay')} className="space-y-4 max-w-md">
                    <input type="number" name="shipment_id" placeholder="Shipment ID" className="w-full border p-2" onChange={handleChange} required />
                    <textarea name="reason" placeholder="Delay Reason" className="w-full border p-2" onChange={handleChange} required></textarea>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded">Log Delay & Recalculate SLA</button>
                </form>
            )}

            {activeTab === 'delivery' && (
                <form onSubmit={(e) => handleAction(e, '/deliveries')} className="space-y-4 max-w-md">
                    <input type="number" name="shipment_id" placeholder="Shipment ID" className="w-full border p-2" onChange={handleChange} required />
                    <input type="number" name="courier_id" placeholder="Courier ID" className="w-full border p-2" onChange={handleChange} required />
                    <select name="status" className="w-full border p-2" onChange={handleChange} required>
                        <option value="">Select Status</option>
                        <option value="Successful">Successful</option>
                        <option value="Failed">Failed</option>
                    </select>
                    <input type="text" name="recipient_signature" placeholder="Recipient Name" className="w-full border p-2" onChange={handleChange} />
                    <textarea name="notes" placeholder="Notes" className="w-full border p-2" onChange={handleChange}></textarea>
                    <button className="bg-green-600 text-white px-4 py-2 rounded">Record Delivery</button>
                </form>
            )}

            {activeTab === 'hub' && role === 'admin' && (
                <form onSubmit={(e) => handleAction(e, '/hubs')} className="space-y-4 max-w-md">
                    <input type="text" name="name" placeholder="Hub Name" className="w-full border p-2" onChange={handleChange} required />
                    <input type="text" name="location" placeholder="Address/Location" className="w-full border p-2" onChange={handleChange} required />
                    <input type="number" name="capacity" placeholder="Capacity" className="w-full border p-2" onChange={handleChange} />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Hub</button>
                </form>
            )}

            {activeTab === 'courier' && role === 'admin' && (
                <form onSubmit={(e) => handleAction(e, '/couriers')} className="space-y-4 max-w-md">
                    <input type="text" name="name" placeholder="Courier Name" className="w-full border p-2" onChange={handleChange} required />
                    <input type="text" name="vehicle_type" placeholder="Vehicle Type (e.g. Van)" className="w-full border p-2" onChange={handleChange} />
                    <input type="text" name="contact_number" placeholder="Contact Phone" className="w-full border p-2" onChange={handleChange} required />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Courier</button>
                </form>
            )}
            
            {activeTab === 'assign' && role === 'admin' && (
                <form onSubmit={(e) => handleAction(e, `/shipments/${formData.id}/assign`, true)} className="space-y-4 max-w-md">
                    <input type="number" name="id" placeholder="Shipment ID" className="w-full border p-2" onChange={handleChange} required />
                    <input type="number" name="courier_id" placeholder="Courier ID to Assign" className="w-full border p-2" onChange={handleChange} required />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Assign Courier</button>
                </form>
            )}
        </div>
    );
}
