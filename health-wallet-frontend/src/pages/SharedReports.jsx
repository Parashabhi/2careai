import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert,ArrowLeft} from 'lucide-react';
import ReportList from '../components/ReportList';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SharedReports = () => {
    const [sharedReports, setSharedReports] = useState([]);
    const userData = JSON.parse(localStorage.getItem('user')) || { email: 'Guest', name: 'User' };

    const userEmail = userData.email|| "john.doe@example.com"; // Mocking current user email
    useEffect(() => {
        const token = localStorage.getItem('token');
        // Fetch reports shared WITH this user
        axios.get(`http://localhost:5000/api/shared-with-me?email=${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setSharedReports(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <header className="mb-8">
                <Link to="/" className="text-blue-600 flex items-center gap-2 text-sm font-bold mb-4">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="text-emerald-600" /> Shared With Me
                </h1>
                <p className="text-slate-500 text-sm">Reports shared by family members or doctors.</p>
            </header>

            {sharedReports.length > 0 ? (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    {/* We reuse the ReportList component to keep UI consistent */}
                    <ReportList reports={sharedReports} />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <ShieldAlert size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No shared reports yet</h3>
                    <p className="text-slate-500 text-center max-w-xs">
                        When someone shares a medical record with you, it will appear here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SharedReports;