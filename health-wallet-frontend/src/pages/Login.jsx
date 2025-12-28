import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            console.log(res.data);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('email', JSON.stringify(res.data.email));

            navigate('/');
        } catch (err) {
            alert("Login Failed: Check credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md space-y-8 p-10 border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50">
                <div className="text-center">
                    <div className="inline-flex bg-blue-600 p-3 rounded-2xl text-white mb-4">
                        <Activity size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Health Wallet</h2>
                    <p className="text-slate-500 mt-2">Sign in to access your medical records</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                required
                                placeholder="Email Address"
                                /* Added border-slate-300 and text-slate-900 for high visibility */
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input type="password" required placeholder="Password"
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        Sign In
                    </button>
                </form>
                {/* --- NEW USER REGISTRATION LINK --- */}
                <div className="pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">
                        Don't have an account yet?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
                        >
                            Create New Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Login;