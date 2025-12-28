import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Plus, FileText, Share2, Menu, X as CloseIcon, User ,LogOut} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockVitals } from '../data/mockData';
import ReportList from '../components/ReportList';
import UploadModal from '../components/UploadModal';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import ShareModal from '../components/ShareModal';


const Dashboard = () => {
    const [chartKey, setChartKey] = useState(0);
    const [reports, setReports] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [vitals, setVitals] = useState(mockVitals);
    const [timeRange, setTimeRange] = useState('7');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [activeReportId, setActiveReportId] = useState(null);

    // Function to trigger when "Share" is clicked on a report
    const handleOpenShare = (reportId) => {
        setActiveReportId(reportId);
        setIsShareModalOpen(true);
    };
    // Retrieve the stored user object
    const userData = JSON.parse(localStorage.getItem('user')) || { email: 'Guest', name: 'User' };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };
    // --- FIX: SCROLL LOCK LOGIC ---
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    // Force re-render the chart once the layout settles
    useEffect(() => {
        const timer = setTimeout(() => {
            setChartKey(prev => prev + 1);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await axios.get('http://localhost:5000/api/reports/1', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(res.data);
        } catch (err) {
            console.error("Error fetching reports", err);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Filter Logic for Vitals
    const filteredVitals = useMemo(() => {
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - parseInt(timeRange));

        // If 'All' is selected, return everything, else filter by date
        if (timeRange === 'all') return vitals;

        return vitals.filter(v => new Date(v.date) >= cutoff);
    }, [vitals, timeRange]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <Activity size={20} /> <span>2Care.ai</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <CloseIcon /> : <Menu />}
                </button>
            </div>

            {/* Sidebar (Responsive) */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-6 transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:block
            `}>
                <div className="hidden md:flex items-center gap-2 mb-10">
                    <div className="bg-blue-600 p-2 rounded-lg text-white"><Activity size={24} /></div>
                    <span className="font-bold text-xl">2Care.ai</span>
                </div>
                <nav className="space-y-2">
                    <NavItem icon={<Activity size={20} />} label="Dashboard" to="/" />
                    <NavItem icon={<FileText size={20} />} label="My Reports" to="/reports" />
                    <NavItem icon={<Share2 size={20} />} label="Shared with me" to="/shared" />
                </nav>
                {/* --- USER EMAIL SECTION --- */}
                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                                <User size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                    {userData.name}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate italic">
                                    {userData.email}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all w-full"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Health Overview</h1>
                        <p className="text-slate-500 text-sm">Latest vitals and reports.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-blue-700"
                    >
                        <Plus size={20} /> Upload Report
                    </button>
                </div>

                {/* Vitals Cards (Responsive Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <StatCard title="Blood Pressure" value="120/80" unit="mmHg" color="blue" />
                    <StatCard title="Heart Rate" value="72" unit="bpm" color="rose" />
                    <StatCard title="Blood Sugar" value="95" unit="mg/dL" color="emerald" />
                </div>

                {/* Chart Card */}
                <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Vitals Analytics</h3>

                    {/* TIME RANGE FILTER UI */}
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                        {['7', '30', 'all'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {range === 'all' ? 'All Time' : `Last ${range}D`}
                            </button>
                        ))}
                    </div>

                    {/* FIX: Ensure this container has a height and min-width */}
                    <div className="h-[300px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%" aspect={window.innerWidth < 640 ? 1.5 : 3}>
                            <AreaChart data={mockVitals}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="heart_rate"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-8">
                    <ReportList reports={reports} onShareClick={handleOpenShare} />
                </div>

                <UploadModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUploadSuccess={fetchReports}
                />
                {/* The Share Modal Component */}
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    reportId={activeReportId}
                />
            </main >
            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        </div >
    );
};

const NavItem = ({ icon, label, to }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
        ${isActive
                ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
      `}
    >
        {icon}
        <span className="font-semibold">{label}</span>
    </NavLink>
);

const StatCard = ({ title, value, unit, color }) => (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 font-medium text-xs mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-slate-900">{value}</span>
            <span className="text-slate-400 text-xs font-medium">{unit}</span>
        </div>
    </div>
);

export default Dashboard;