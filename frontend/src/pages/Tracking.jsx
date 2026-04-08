import { useState } from 'react';
import axios from '../api/axios';

export default function Tracking() {
    const [trackingNo, setTrackingNo] = useState('');
    const [shipment, setShipment] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.get(`/tracking/${trackingNo}`);
            setShipment(res.data.shipment);
            setEvents(res.data.events);
        } catch (err) {
            setError(err.response?.data?.error || 'Tracking failed');
            setShipment(null);
            setEvents([]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Track Your Shipment</h2>
            
            <form onSubmit={handleTrack} className="mb-8">
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        placeholder="Enter Tracking Number (e.g. TRK123456789)" 
                        className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        value={trackingNo}
                        onChange={(e) => setTrackingNo(e.target.value)}
                        required
                    />
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Track</button>
                </div>
            </form>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

            {shipment && (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Shipment Details</h3>
                        <p><strong>Tracking No:</strong> {shipment.tracking_no}</p>
                        <p><strong>Status:</strong> {shipment.current_status || 'Booked'}</p>
                        <p><strong>Sender:</strong> {shipment.sender_name} ({shipment.sender_address})</p>
                        <p><strong>Receiver:</strong> {shipment.receiver_name} ({shipment.receiver_address})</p>
                        <p><strong>Weight:</strong> {shipment.weight} kg</p>
                        <p><strong>Service:</strong> {shipment.service_type}</p>
                        <p><strong>Expected Delivery:</strong> {new Date(shipment.expected_delivery_date).toLocaleDateString()}</p>
                        {shipment.delivery && <p><strong>Delivered At:</strong> {new Date(shipment.delivery.delivery_time).toLocaleString()}</p>}
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-4">Tracking History</h3>
                        {events.length > 0 ? (
                            <div className="space-y-3">
                                {events.map((event, idx) => (
                                    <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                                        <p className="font-medium">{event.status}</p>
                                        <p className="text-sm text-gray-600">{event.location} - {event.description}</p>
                                        <p className="text-xs text-gray-500">{new Date(event.event_time).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No tracking events yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}