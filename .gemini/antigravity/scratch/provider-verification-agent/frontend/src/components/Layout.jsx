import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BarChart2, LogOut, Shield } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-10">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Shield className="text-accent" />
                        <span>ProviderAgent</span>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-accent text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>

                    <Link
                        to="/review"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/review') ? 'bg-accent text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <CheckSquare size={20} />
                        Manual Review
                    </Link>

                    <Link
                        to="/analytics"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/analytics') ? 'bg-accent text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <BarChart2 size={20} />
                        Analytics
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 w-full rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {children}
            </main>
        </div>
    );
};

export default Layout;
