import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from '../api/axios';

export default function ShipmentDetail() {
    const { id } = useParams();
    const [shipment, setShipment] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`/shipments/${id}`);
                setShipment(res.data);
            } catch (err) {
                setError('Shipment not found');
            }
        };
        fetchDetail();
    }, [id]);

    const renderStatusBadge = (status) => {
        if (status === 'Delivered') return 'bg-emerald-100 text-emerald-800';
        if (status === 'Delayed') return 'bg-rose-100 text-rose-800';
        return 'bg-sky-100 text-sky-800';
    };

    if (error) return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">{error}</div>;
    if (!shipment) return <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-700 shadow-sm">Loading shipment details...</div>;

    return (
        <div className="space-y-8">
            <div className="rounded-3xl bg-white shadow-xl border border-gray-200 p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Shipment {shipment.tracking_no}</h1>
                        <p className="mt-2 text-gray-600">Detailed delivery record and current status for this shipment.</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${renderStatusBadge(shipment.current_status)}`}>
                        {shipment.current_status}
                    </span>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
                    <div className="flex items-center gap-4 text-slate-700">
                        <Package className="h-6 w-6 text-blue-600" />
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Shipment Summary</h2>
                            <p className="text-sm text-slate-500">Core details about this booking.</p>
                        </div>
                    </div>
                    <div className="mt-6 grid gap-4">
                        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                            <p className="text-sm text-slate-500">Service Level</p>
                            <p className="mt-2 font-semibold text-slate-900">{shipment.service_type}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                            <p className="text-sm text-slate-500">Weight</p>
                            <p className="mt-2 font-semibold text-slate-900">{shipment.weight} kg</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                            <p className="text-sm text-slate-500">Expected Delivery</p>
                            <p className="mt-2 font-semibold text-slate-900">{new Date(shipment.expected_delivery_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
                    <div className="flex items-center gap-4 text-slate-700">
                        <MapPin className="h-6 w-6 text-sky-600" />
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Route Information</h2>
                            <p className="text-sm text-slate-500">Pickup and delivery locations.</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-4">
                        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                            <p className="text-sm text-slate-500">Sender</p>
                            <p className="mt-2 font-semibold text-slate-900">{shipment.sender_name}</p>
                            <p className="mt-1 text-sm text-slate-600">{shipment.sender_address}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                            <p className="text-sm text-slate-500">Receiver</p>
                            <p className="mt-2 font-semibold text-slate-900">{shipment.receiver_name}</p>
                            <p className="mt-1 text-sm text-slate-600">{shipment.receiver_address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}