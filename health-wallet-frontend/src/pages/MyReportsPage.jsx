import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReportList from '../components/ReportList';
import axios from 'axios';
import ShareModal from '../components/ShareModal';
const MyReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [activeReportId, setActiveReportId] = useState(null);

    // Function to trigger when "Share" is clicked on a report
    const handleOpenShare = (reportId) => {
        setActiveReportId(reportId);
        setIsShareModalOpen(true);
    };

    useEffect(() => {
        // Fetch all reports
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/api/reports/1', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setReports(res.data));
    }, []);

    // Filter Logic: Search by Title or Filter by Type (Blood Test, etc.)
    const filteredReports = reports.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || r.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <Link to="/" className="text-blue-600 flex items-center gap-2 text-sm font-bold mb-4">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Medical Records</h1>
                    <p className="text-slate-500">Search and retrieve your health history.</p>
                </header>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search reports by name..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 font-medium text-slate-700"
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Blood Test">Blood Test</option>
                            <option value="X-Ray">X-Ray</option>
                            <option value="MRI">MRI</option>
                            <option value="Vaccination">Vaccination</option>
                        </select>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <ReportList reports={filteredReports} onShareClick={handleOpenShare} />
                </div>
                {/* The Share Modal Component */}
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    reportId={activeReportId}
                />
            </div>
        </div>
    );
};

export default MyReportsPage;