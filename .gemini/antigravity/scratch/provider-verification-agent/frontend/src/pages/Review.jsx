import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const Review = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const res = await api.get('/providers');
            // Filter for providers needing review
            const needsReview = res.data.filter(p =>
                p.verification_status === 'NEEDS_REVIEW' || p.verification_status === 'FLAGGED'
            );
            setProviders(needsReview);
        } catch (error) {
            console.error("Error fetching providers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, e) => {
        e.stopPropagation();
        // In a real app, this would call an approve endpoint
        alert(`Approved provider ${id}`);
        // Optimistic update
        setProviders(providers.filter(p => p.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Manual Review Queue</h1>
                <p className="text-slate-600 mb-8">Review providers flagged by the AI agents</p>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {providers.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                            <h3 className="text-lg font-medium text-slate-900">All Caught Up!</h3>
                            <p>No providers currently require manual review.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="p-4">Provider</th>
                                    <th className="p-4">Issue</th>
                                    <th className="p-4">Confidence</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {providers.map((provider) => (
                                    <tr key={provider.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/provider/${provider.id}`)}>
                                        <td className="p-4">
                                            <div className="font-medium text-slate-900">{provider.first_name} {provider.last_name}</div>
                                            <div className="text-xs text-slate-500">NPI: {provider.npi}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${provider.verification_status === 'FLAGGED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                <AlertTriangle size={14} />
                                                {provider.verification_status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-slate-900">
                                            {provider.confidence_score}%
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={(e) => handleApprove(provider.id, e)}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium text-xs"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 font-medium text-xs"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Review;
