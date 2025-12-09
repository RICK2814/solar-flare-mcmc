import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Shield, GraduationCap, Activity } from 'lucide-react';

const ProviderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState(false);

    useEffect(() => {
        fetchProvider();
    }, [id]);

    const fetchProvider = async () => {
        try {
            const res = await api.get(`/providers/${id}`);
            setProvider(res.data);
        } catch (error) {
            console.error("Error fetching provider", error);
        } finally {
            setLoading(false);
        }
    };

    const runValidation = async () => {
        setValidating(true);
        try {
            await api.post(`/providers/${id}/validate`);
            await fetchProvider(); // Refresh data
        } catch (error) {
            console.error("Error validating provider", error);
        } finally {
            setValidating(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!provider) return <div className="p-8 text-center">Provider not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{provider.first_name} {provider.last_name}</h1>
                            <div className="flex items-center gap-4 text-slate-600">
                                <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm">NPI: {provider.npi}</span>
                                <span>{provider.specialty}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-500 mb-1">Confidence Score</div>
                            <div className="text-3xl font-bold text-slate-900">{provider.confidence_score}%</div>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Activity size={20} className="text-accent" />
                                Contact Information
                            </h3>
                            <div className="space-y-3 text-slate-600">
                                <p><span className="font-medium text-slate-900">Phone:</span> {provider.phone}</p>
                                <p><span className="font-medium text-slate-900">Email:</span> {provider.email}</p>
                                <p><span className="font-medium text-slate-900">Address:</span> {provider.address}, {provider.city}, {provider.state} {provider.zip_code}</p>
                                <p><span className="font-medium text-slate-900">Website:</span> <a href={provider.website} target="_blank" rel="noreferrer" className="text-accent hover:underline">{provider.website}</a></p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <GraduationCap size={20} className="text-accent" />
                                Education & Credentials
                            </h3>
                            {provider.educations && provider.educations.length > 0 ? (
                                <ul className="space-y-3">
                                    {provider.educations.map((edu, idx) => (
                                        <li key={idx} className="bg-slate-50 p-3 rounded-lg">
                                            <div className="font-medium text-slate-900">{edu.school}</div>
                                            <div className="text-sm text-slate-500">{edu.degree} • {edu.year}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-500 italic">No education data found.</p>
                            )}
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Shield size={20} className="text-accent" />
                                Validation History
                            </h3>
                            <button
                                onClick={runValidation}
                                disabled={validating}
                                className={`px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors ${validating ? 'opacity-50' : ''}`}
                            >
                                {validating ? 'Running Agents...' : 'Run Validation Agents'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {provider.validation_logs && provider.validation_logs.length > 0 ? (
                                provider.validation_logs.slice().reverse().map((log) => (
                                    <div key={log.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-start gap-4">
                                        <div className={`mt-1 ${log.action.includes('VERIFIED') ? 'text-green-500' : log.action.includes('FLAGGED') ? 'text-red-500' : 'text-blue-500'}`}>
                                            {log.action.includes('VERIFIED') ? <CheckCircle size={20} /> : log.action.includes('FLAGGED') ? <AlertTriangle size={20} /> : <Activity size={20} />}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{log.action} <span className="text-slate-400 font-normal text-sm">• {log.source}</span></div>
                                            <div className="text-slate-600 text-sm">{log.details}</div>
                                            <div className="text-slate-400 text-xs mt-1">{new Date(log.timestamp).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-500 py-4">No validation logs yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDetail;
