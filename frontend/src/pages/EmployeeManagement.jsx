import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        axios.get('/employees').then(res => setEmployees(res.data)).catch(console.error);
    }, []);
    return (
        <div className="p-8"><h1 className="text-2xl font-bold mb-4">Employee Management</h1>
            <div className="bg-white rounded shadow text-sm p-4">
                {employees.length > 0 ? employees.map(e => <div key={e.id}>{e.role} - Hub: {e.hub_id}</div>) : <p>No employees found.</p>}
            </div>
        </div>
    );
}
