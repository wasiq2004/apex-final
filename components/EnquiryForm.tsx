import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, ChevronDown, ArrowRight } from 'lucide-react';

import { API_URL } from '../src/config';

const EnquiryForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });

  const programs = [
    "Full Stack Web Development", "Python Programming & Automation", "Data Science & Analytics",
    "AI & Machine Learning", "Cloud Computing & DevOps", "Cyber Security Fundamentals",
    "Digital Marketing & Growth Strategies", "Business & Management Skills",
    "Human Resource Fundamentals", "Communication & Workplace Readiness"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await fetch(`${API_URL}/api/forms/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(data.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', interest: '', message: '' });
    } catch (err: any) {
      console.error('Form submission error:', err);

      // Provide specific error messages
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please ensure the backend is running at ' + API_URL);
      } else if (err.name === 'TypeError') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-zinc-900/40 backdrop-blur-3xl border border-[#D4AF37]/30 p-16 lg:p-24 rounded-sm text-center space-y-8 shadow-gold-glow">
        <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto animate-pulse" strokeWidth={1} />
        <div className="space-y-4">
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Intake Received</h3>
          <p className="text-lg text-zinc-500 font-medium">An Apex Skills strategist will reach out to you within 24 hours.</p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-[#D4AF37] font-black tracking-[0.5em] text-[10px] hover:text-white transition-all uppercase pt-8 border-t border-white/10 w-full"
        >
          SUBMIT NEW ENQUIRY
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900/20 backdrop-blur-3xl p-8 lg:p-16 rounded-sm border border-white/5 shadow-2xl">
      <div className="mb-12 text-left space-y-4 border-l-2 border-[#D4AF37] pl-8">
        <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none">
          Reach Us <span className="text-gold">Out</span>
        </h3>
        <p className="text-zinc-500 font-medium text-[10px] tracking-[0.4em] uppercase">let us know</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Full Legal Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm placeholder:text-zinc-800"
              placeholder="YOUR NAME"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Area of Interest</label>
            <div className="relative">
              <select
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 px-6 py-4 text-zinc-400 text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm appearance-none cursor-pointer">
                <option value="">SELECT DOMAIN</option>
                {programs.map(p => <option key={p} value={p} className="bg-zinc-900">{p.toUpperCase()}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Email Address</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm placeholder:text-zinc-800"
              placeholder="CONTACT@DOMAIN.COM"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Mobile Number</label>
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
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase ml-1">Message / Career Objective</label>
          <textarea
            required
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 px-6 py-5 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium min-h-[160px] rounded-sm resize-none placeholder:text-zinc-800"
            placeholder="OUTLINE YOUR PROFESSIONAL GOALS AND PROJECT INTERESTS..."
          ></textarea>
        </div>

        <div className="pt-4">
          <button
            disabled={isLoading}
            type="submit"
            className="group relative w-full lg:w-max px-12 py-5 bg-gold-metallic text-black font-black text-[11px] tracking-[0.5em] rounded-sm transition-all flex items-center justify-center space-x-4 shadow-gold-glow hover:scale-[1.02] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black"></div>
            ) : (
              <>
                <span>SEND MESSAGE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnquiryForm;