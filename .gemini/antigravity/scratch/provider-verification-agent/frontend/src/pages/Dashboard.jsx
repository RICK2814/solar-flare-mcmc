import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, Search, RefreshCw } from 'lucide-react';

const Dashboard = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const res = await api.get('/providers');
            setProviders(res.data);
        } catch (error) {
            console.error("Error fetching providers", error);
        } finally {
            setLoading(false);
        }
    };

    const runValidation = async () => {
        setValidating(true);
        try {
            await api.post('/providers/validate-all');
            // Re-fetch after a short delay to see updates
            setTimeout(fetchProviders, 2000);
        } catch (error) {
            console.error("Error running validation", error);
        } finally {
            setValidating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'VERIFIED': return 'bg-green-100 text-green-800';
            case 'FLAGGED': return 'bg-red-100 text-red-800';
            case 'NEEDS_REVIEW': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Provider Directory</h1>
                        <p className="text-slate-600">Manage and validate healthcare provider data</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={runValidation}
                            disabled={validating}
                            className={`flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors ${validating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <RefreshCw size={20} className={validating ? "animate-spin" : ""} />
                            {validating ? 'Validating...' : 'Run Auto-Validation'}
                        </button>
                    </div>
                </div>

                {/* Stats Cards could go here */}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="p-4">Provider</th>
                                    <th className="p-4">NPI</th>
                                    <th className="p-4">Specialty</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Confidence</th>
                                    <th className="p-4">Last Verified</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {providers.map((provider) => (
                                    <tr key={provider.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-slate-900">{provider.first_name} {provider.last_name}</div>
                                            <div className="text-xs text-slate-500">{provider.email}</div>
                                        </td>
                                        <td className="p-4 font-mono">{provider.npi}</td>
                                        <td className="p-4">{provider.specialty}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.verification_status)}`}>
                                                {provider.verification_status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${provider.confidence_score > 80 ? 'bg-green-500' : provider.confidence_score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${provider.confidence_score}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs">{provider.confidence_score}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {provider.last_verified_at ? new Date(provider.last_verified_at).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => navigate(`/provider/${provider.id}`)}
                                                className="text-accent hover:text-blue-700 font-medium"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
