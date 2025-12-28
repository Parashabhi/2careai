import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, User, Mail, Lock, Shield } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Owner' // Default role
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md space-y-6 p-10 border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50">
                <div className="text-center">
                    <div className="inline-flex bg-blue-600 p-3 rounded-2xl text-white mb-4">
                        <Activity size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                    <p className="text-slate-500 mt-2">Join 2Care Digital Health Wallet</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text" required placeholder="Full Name"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="email" required placeholder="Email Address"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="password" required placeholder="Password"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="Owner">Account Owner (Patient)</option>
                            <option value="Viewer">Viewer (Doctor/Family)</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;