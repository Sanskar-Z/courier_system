import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function DamageLogs() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        axios.get('/damage-logs').then(res => setLogs(res.data)).catch(console.error);
    }, []);
    return (
        <div className="p-8"><h1 className="text-2xl font-bold mb-4">Damage Logs</h1>
            <div className="bg-white rounded shadow text-sm p-4">
                {logs.length > 0 ? logs.map(l => <div key={l.id}>{l.shipment_id}: {l.damage_description}</div>) : <p>No damage logs found.</p>}
            </div>
        </div>
    );
}
