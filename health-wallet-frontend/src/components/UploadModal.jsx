import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, Upload, Activity, Thermometer, Droplets, Heart } from 'lucide-react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Essential for the calendar look

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [metadata, setMetadata] = useState({
        title: '',
        type: 'Blood Test',
        date: new Date().toISOString().split('T')[0],
        bp_sys: '',
        bp_dia: '',
        sugar: '',
        heart_rate: ''
    });

    if (!isOpen) return null;

    const handleDateChange = (date) => {
        setStartDate(date);
        setMetadata({ ...metadata, date: date.toISOString().split('T')[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('report', file);
        formData.append('userId', 1); // Mock user ID
        Object.keys(metadata).forEach(key => formData.append(key, metadata[key]));
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:5000/api/upload', formData,{
                headers: { Authorization: `Bearer ${token}` }
            });
            onUploadSuccess();
            onClose();
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[95vh] flex flex-col border border-slate-200">

                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">Upload Health Report</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">

                    {/* File Dropzone */}
                    <div className="border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center bg-blue-50/30 relative hover:bg-blue-50 transition-colors">
                        <input
                            type="file"
                            required
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <Upload className="mx-auto text-blue-500 mb-2" size={28} />
                        <p className="text-sm font-bold text-slate-700">
                            {file ? file.name : "Click to select medical report"}
                        </p>
                        <p className="text-xs text-slate-500">Supports PDF, JPG, PNG</p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Report Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. LabCorp Blood Work, Dr. Smith X-Ray"
                                className="w-full p-3 bg-white border border-slate-300 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">
                                Test Date
                            </label>
                            <div className="relative w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 pointer-events-none">
                                    <CalendarIcon size={18} />
                                </div>

                                <DatePicker
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    maxDate={new Date()} // Prevent selecting future dates for medical reports
                                    dateFormat="MMMM d, yyyy"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
                     transition-all cursor-pointer shadow-sm"
                                    // This makes the calendar container look modern
                                    calendarClassName="shadow-2xl border-none rounded-2xl overflow-hidden font-sans"
                                    popperClassName="z-[70]" // Ensure it pops over the modal
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
                            <select
                                className="w-full p-3 bg-white border border-slate-300 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                onChange={(e) => setMetadata({ ...metadata, type: e.target.value })}
                            >
                                <option value="Blood Test">Blood Test</option>
                                <option value="X-Ray">X-Ray</option>
                                <option value="MRI">MRI</option>
                                <option value="Vaccination">Vaccination</option>
                            </select>
                        </div>
                    </div>

                    {/* Vitals Section */}
                    <div className="bg-blue-[50/50] p-5 rounded-2xl space-y-4 border border-blue-100">
                        <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                            <Activity size={16} className="text-blue-600" /> Record Vitals (Optional)
                        </h3>

                        {/* Changed to grid-cols-2 for better horizontal layout on desktops */}
                        <div className="grid grid-cols-2 gap-4">
                            <VitalInput
                                label="BP (Sys/Dia)"
                                icon={<Heart size={14} className="text-rose-500" />}
                                placeholder="120/80"
                                onChange={(e) => {
                                    const [sys, dia] = e.target.value.split('/');
                                    setMetadata({ ...metadata, bp_sys: sys, bp_dia: dia });
                                }}
                            />
                            <VitalInput
                                label="Sugar"
                                icon={<Droplets size={14} className="text-blue-500" />}
                                placeholder="95 mg/dL"
                                onChange={(e) => setMetadata({ ...metadata, sugar: e.target.value })}
                            />
                            <div className="col-span-2 sm:col-span-1">
                                <VitalInput
                                    label="Heart Rate"
                                    icon={<Activity size={14} className="text-emerald-500" />}
                                    placeholder="72 bpm"
                                    onChange={(e) => setMetadata({ ...metadata, heart_rate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.99] transition-all mt-2"
                    >
                        Save to Health Wallet
                    </button>
                </form>
            </div>
        </div>
    );
};

const VitalInput = ({ label, icon, placeholder, onChange }) => (
    <div className="w-full">
        <label className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1.5 mb-1.5 ml-1">
            {icon} {label}
        </label>
        <input
            type="text"
            placeholder={placeholder}
            className="w-full p-2.5 bg-white border border-slate-300 text-slate-900 rounded-xl text-sm 
                   placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   outline-none transition-all shadow-sm"
            onChange={onChange}
        />
    </div>
);

export default UploadModal;