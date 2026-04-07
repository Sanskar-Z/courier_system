import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login to Portal</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium">{error}</div>}
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Sign In
                    </button>
                    <p className="text-sm text-center text-gray-500">Seed user: admin1 / password123</p>
                </form>
            </div>
        </div>
    );
}
