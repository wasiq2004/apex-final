import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../src/config';

interface CareerModalProps {
    isOpen: boolean;
    onClose: () => void;
    position: string;
    type?: 'internship' | 'mentor' | 'job';
    internshipId?: number;
}

const CareerApplicationModal: React.FC<CareerModalProps> = ({ isOpen, onClose, position, type = 'job', internshipId }) => {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        resumeLink: '',
        coverLetter: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let url = `${API_URL}/api/forms/career`;
            let body: any = { ...formData, position };

            if (type === 'internship' || type === 'mentor') {
                url = `${API_URL}/api/applications`;
                body = {
                    type,
                    internshipId,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    resumeLink: formData.resumeLink,
                    message: formData.coverLetter // Mapping coverLetter to message
                };
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({ error: 'Server error' }));
                throw new Error(data.error || `Server returned ${response.status}`);
            }

            setSubmitted(true);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                resumeLink: '',
                coverLetter: ''
            });

            setTimeout(() => {
                onClose();
                setSubmitted(false);
            }, 3000);
        } catch (err: any) {
            console.error('Application error:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-3xl bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-sm shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
                        >
                            {submitted ? (
                                <div className="p-16 text-center space-y-8">
                                    <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto animate-pulse" strokeWidth={1} />
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Application Received</h3>
                                        <p className="text-lg text-zinc-500 font-medium">
                                            Thank you for applying! Our recruitment team will review your application and reach out within 48 hours.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="p-8 border-b border-white/5 flex items-start justify-between">
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                                                Apply for <span className="text-gold">{position}</span>
                                            </h2>
                                            <p className="text-zinc-500 font-medium text-sm tracking-[0.2em] uppercase">Career Application Protocol</p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-white/5 rounded-sm transition-colors text-zinc-500 hover:text-white"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                        {error && (
                                            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-sm flex items-start space-x-3">
                                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-red-400 text-sm font-medium">{error}</p>
                                            </div>
                                        )}

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Full Name *</label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm placeholder:text-zinc-800"
                                                    placeholder="YOUR FULL NAME"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Email Address *</label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm placeholder:text-zinc-800"
                                                    placeholder="EMAIL@DOMAIN.COM"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Phone Number *</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm placeholder:text-zinc-800"
                                                    placeholder="+91"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Resume Link</label>
                                                <input
                                                    type="url"
                                                    name="resumeLink"
                                                    value={formData.resumeLink}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm placeholder:text-zinc-800"
                                                    placeholder="GOOGLE DRIVE / DROPBOX LINK"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Cover Letter / Why You?</label>
                                            <textarea
                                                name="coverLetter"
                                                value={formData.coverLetter}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 px-6 py-5 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium min-h-[140px] rounded-sm resize-none placeholder:text-zinc-800"
                                                placeholder="TELL US WHY YOU'RE THE PERFECT FIT FOR THIS ROLE..."
                                            ></textarea>
                                        </div>

                                        <div className="flex items-center justify-end space-x-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-8 py-4 text-zinc-500 hover:text-white font-black text-[10px] tracking-[0.4em] uppercase transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                disabled={isLoading}
                                                type="submit"
                                                className="group px-12 py-4 bg-gold-metallic text-black font-black text-[10px] tracking-[0.5em] rounded-sm transition-all flex items-center space-x-3 shadow-gold-glow hover:scale-[1.02] disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black"></div>
                                                ) : (
                                                    <>
                                                        <span>SUBMIT APPLICATION</span>
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CareerApplicationModal;
