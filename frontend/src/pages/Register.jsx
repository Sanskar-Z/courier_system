import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '', password: '', full_name: '', phone: '', email: '', address: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.details?.[0] || err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-10">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create an Account</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium">{error}</div>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" name="username" className="w-full border p-2 rounded" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" name="password" className="w-full border p-2 rounded" onChange={handleChange} required minLength="6"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="full_name" className="w-full border p-2 rounded" onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" className="w-full border p-2 rounded" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                            <input type="tel" name="phone" className="w-full border p-2 rounded" onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea name="address" className="w-full border p-2 rounded" onChange={handleChange} required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors mt-4">
                        Register
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
