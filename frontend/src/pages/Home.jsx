import { useState } from 'react';
import axios from '../api/axios';
import { Search, MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function Home() {
    const [trackingNo, setTrackingNo] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        try {
            const res = await axios.get(`/tracking/${trackingNo}`);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Tracking number not found');
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Delivered': return <CheckCircle className="text-green-500" />;
            case 'Delayed': return <AlertTriangle className="text-red-500" />;
            case 'In Transit': return <MapPin className="text-blue-500" />;
            default: return <Clock className="text-gray-500" />;
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">Track Your Shipment</h1>
                <p className="text-gray-600 text-lg">Enter your tracking number below to see real-time updates.</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row shadow-lg rounded-full mb-10 overflow-hidden border border-gray-200">
                <input 
                    type="text" 
                    placeholder="e.g. TRK2023100101" 
                    className="flex-grow p-4 outline-none text-lg"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    required
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-semibold text-lg flex items-center justify-center transition-colors">
                    <Search className="mr-2" /> Track
                </button>
            </form>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center font-medium">
                    {error}
                </div>
            )}

            {result && (
                <div className="glass-panel rounded-2xl p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Shipment Details</h2>
                            <p className="text-gray-500">Tracking: <span className="font-semibold text-gray-700">{result.shipment.tracking_no}</span></p>
                            <p className="text-gray-500">Service: <span className="font-semibold text-gray-700">{result.shipment.service_type}</span></p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-lg font-semibold flex items-center justify-end gap-2">
                                Status: {getStatusIcon(result.shipment.current_status?.current_state)} 
                                <span className={`
                                    ${result.shipment.current_status?.current_state === 'Delivered' ? 'text-green-600' : ''}
                                    ${result.shipment.current_status?.current_state === 'Delayed' ? 'text-red-600' : ''}
                                `}>
                                    {result.shipment.current_status?.current_state || 'Booked'}
                                </span>
                            </h3>
                            {result.shipment.is_sla_breached ? (
                                <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase tracking-wider">SLA Breached</span>
                            ) : (
                                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider">SLA Met</span>
                            )}
                        </div>
                    </div>

                    <div className="relative pl-6 border-l-2 border-blue-200 space-y-8">
                        {result.events.map((evt, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[31px] bg-white border-4 border-blue-500 w-5 h-5 rounded-full"></div>
                                <h4 className="font-bold text-gray-800">{evt.status} &mdash; <span className="font-normal text-gray-500">{new Date(evt.event_time).toLocaleString()}</span></h4>
                                <p className="text-gray-600 font-medium">{evt.location}</p>
                                {evt.description && <p className="text-gray-500 text-sm mt-1">{evt.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
