import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Search, MapPin, CheckCircle, Clock, AlertTriangle, Package, Truck, Shield, Zap } from 'lucide-react';

export default function Home() {
    const [trackingNo, setTrackingNo] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setIsLoading(true);
        try {
            const res = await axios.get(`/tracking/${trackingNo}`);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Tracking number not found');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <CheckCircle className="text-green-500" />;
            case 'Delayed':
                return <AlertTriangle className="text-red-500" />;
            case 'In Transit':
                return <MapPin className="text-blue-500" />;
            default:
                return <Clock className="text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <Package className="h-8 w-8 text-blue-600" />
                            <span className="font-bold text-xl text-gray-900">SwiftTrack Logistics</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Track Your Shipments with
                        <span className="text-blue-600"> Precision</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Real-time tracking, reliable delivery, and complete visibility into your logistics operations.
                        Join thousands of businesses that trust SwiftTrack.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto mb-16">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Shipment</h2>
                            <p className="text-gray-600">Enter your tracking number for instant updates</p>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Enter tracking number (e.g. TRK2023100101)"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                    value={trackingNo}
                                    onChange={(e) => setTrackingNo(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Tracking...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-5 w-5" />
                                        Track Shipment
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                                <AlertTriangle className="inline h-5 w-5 mr-2" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center">
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
                        <p className="text-gray-600">Get instant notifications and live tracking updates for all your shipments.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                        <p className="text-gray-600">Enterprise-grade security with 99.9% uptime and guaranteed delivery SLAs.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Network</h3>
                        <p className="text-gray-600">Worldwide coverage with local expertise and customs clearance support.</p>
                    </div>
                </div>

                {result && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Shipment Details</h2>
                                        <p className="text-blue-100 mt-1">Tracking: {result.shipment.tracking_no}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-2 text-white">
                                            {getStatusIcon(result.shipment.current_status?.current_state)}
                                            <span className="text-lg font-semibold">
                                                {result.shipment.current_status?.current_state || 'Booked'}
                                            </span>
                                        </div>
                                        {result.shipment.is_sla_breached ? (
                                            <span className="inline-block mt-2 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                                SLA Breached
                                            </span>
                                        ) : (
                                            <span className="inline-block mt-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                                SLA Met
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600">Service Type</p>
                                        <p className="font-semibold text-gray-900">{result.shipment.service_type}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600">Origin</p>
                                        <p className="font-semibold text-gray-900">{result.shipment.origin}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600">Destination</p>
                                        <p className="font-semibold text-gray-900">{result.shipment.destination}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
                                    <div className="relative">
                                        {result.events.map((evt, idx) => (
                                            <div key={idx} className="flex items-start space-x-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                                                    {idx < result.events.length - 1 && (
                                                        <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-8">
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-semibold text-gray-900">{evt.status}</h4>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(evt.event_time).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 font-medium">{evt.location}</p>
                                                        {evt.description && (
                                                            <p className="text-gray-600 text-sm mt-1">{evt.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
