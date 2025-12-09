import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { BarChart, PieChart, Activity, Users, CheckCircle, AlertTriangle } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState({
        total: 0,
        verified: 0,
        flagged: 0,
        avgConfidence: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/providers');
            const providers = res.data;
            const total = providers.length;
            const verified = providers.filter(p => p.verification_status === 'VERIFIED').length;
            const flagged = providers.filter(p => p.verification_status === 'FLAGGED').length;
            const avgConfidence = total > 0
                ? Math.round(providers.reduce((acc, p) => acc + p.confidence_score, 0) / total)
                : 0;

            setStats({ total, verified, flagged, avgConfidence });
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Analytics & Reporting</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <Users size={24} />
                            </div>
                            <div className="text-slate-500 font-medium">Total Providers</div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <CheckCircle size={24} />
                            </div>
                            <div className="text-slate-500 font-medium">Verified</div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">{stats.verified}</div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="text-slate-500 font-medium">Flagged</div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">{stats.flagged}</div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                <Activity size={24} />
                            </div>
                            <div className="text-slate-500 font-medium">Avg Confidence</div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">{stats.avgConfidence}%</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-80 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <BarChart size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Validation Trends (Placeholder)</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-80 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <PieChart size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Status Distribution (Placeholder)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
