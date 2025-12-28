import React, { useState } from 'react';
import { X, Send, ShieldCheck, Mail } from 'lucide-react';
import axios from 'axios';

const ShareModal = ({ isOpen, onClose, reportId }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        // Backend API call to store permission
        try {

            await axios.post('http://localhost:5000/api/share', {
                reportId,
                sharedWithEmail: email,
                permission: 'read-only',
                headers: { Authorization: `Bearer ${token}` }

            });
            alert("Report shared successfully!");
            onClose();
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" /> Share Access
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleShare} className="p-6 space-y-4">
                    <p className="text-sm text-slate-500">
                        Enter the email of the Doctor or Family member. They will receive <strong>Read-Only</strong> access to this specific report.
                    </p>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="email"
                            required
                            placeholder="doctor@hospital.com"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? "Processing..." : <><Send size={18} /> Grant Access</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShareModal;