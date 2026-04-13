import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function DeliveryFailures() {
    const [failures, setFailures] = useState([]);
    useEffect(() => {
        axios.get('/delivery-failures').then(res => setFailures(res.data)).catch(console.error);
    }, []);
    return (
        <div className="p-8"><h1 className="text-2xl font-bold mb-4">Delivery Failures</h1>
            <div className="bg-white rounded shadow text-sm p-4">
                {failures.length > 0 ? failures.map(f => <div key={f.id}>{f.shipment_id}: {f.failure_reason}</div>) : <p>No delivery failures found.</p>}
            </div>
        </div>
    );
}
