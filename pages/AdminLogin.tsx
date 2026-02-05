import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../src/config';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm)
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({ error: 'Server error' }));
                throw new Error(data.error || `Server returned ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem('adminToken', data.data.token);
            localStorage.setItem('adminUsername', data.data.username);
            navigate('/admin/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);

            if (error.message === 'Failed to fetch') {
                setLoginError('Cannot connect to server. Please ensure the backend is running at ' + API_URL);
            } else if (error.name === 'TypeError') {
                setLoginError('Network error. Please check your internet connection.');
            } else {
                setLoginError(error.message || 'Invalid credentials. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-lg p-12 shadow-2xl">
                    {/* Logo/Icon */}
                    <div className="text-center mb-10">
                        <div className="w-28 h-28 bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-gold-glow border border-[#D4AF37]/20">
                            <img
                                src="/Logobgblack-removebg-preview.png"
                                alt="Apex Skill Technologies"
                                className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                            />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                            Admin Access
                        </h1>
                        <p className="text-white/60 text-sm tracking-wider uppercase font-bold">
                            Apex Skills Technologies
                        </p>
                    </div>


                    <form onSubmit={handleLogin} className="space-y-6">
                        {loginError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg text-red-400 text-sm"
                            >
                                {loginError}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                Username
                            </label>
                            <input
                                type="text"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg pr-12"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F9E076] text-black font-black text-sm tracking-wider uppercase rounded-lg shadow-gold-glow hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-white/40 text-xs">
                            Authorized personnel only
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
