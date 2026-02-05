
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Play, Star, ArrowUpRight } from 'lucide-react';
import { MENTORS } from '../constants';

// Fix: Added optional children and key to prop type definition to resolve compilation errors
const Reveal = ({ children, delay = 0, y = 30 }: { children?: React.ReactNode, delay?: number, y?: number, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
  >
    {children}
  </motion.div>
);

const Mentors: React.FC = () => {
  return (
    <div className="pt-40 pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-32 space-y-6">
          <Reveal delay={0.1}>
            <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-xs">Our Experts</p>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="text-6xl lg:text-[5.5rem] font-black text-slate-950 tracking-tighter leading-none">Meet Our Mentors</h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Learn from industry veterans working at the world's most innovative companies, brought to you by Apex Skills Technologies.
            </p>
          </Reveal>
        </div>

        {/* Mentors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
          {MENTORS.map((mentor, idx) => (
            <Reveal key={mentor.id} delay={0.1 + idx * 0.1}>
              <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100 hover:shadow-2xl hover:bg-white transition-all text-center group h-full flex flex-col">
                <div className="relative mb-8 mx-auto w-48 h-48 group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-indigo-600/10 rounded-full scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src={mentor.image} alt={mentor.name} className="relative rounded-full object-cover w-full h-full shadow-2xl border-4 border-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 mb-1">{mentor.name}</h3>
                <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-6">{mentor.organization}</p>
                <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed flex-grow">{mentor.bio}</p>
                <div className="flex items-center justify-center space-x-3 mt-auto">
                  <a href={mentor.linkedIn} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs shadow-sm hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest">
                    Read More
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Success Stories */}
        <div className="mb-40">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
             <Reveal delay={0.1}>
               <div className="space-y-4">
                 <h2 className="text-5xl lg:text-6xl font-black text-slate-950 tracking-tighter">Learner Success Stories</h2>
                 <p className="text-lg text-slate-500 max-w-xl font-medium">Hear directly from our alumni who successfully transitioned into high-paying roles through Apex Skills Technologies.</p>
               </div>
             </Reveal>
             <Reveal delay={0.2}>
               <button className="text-indigo-600 font-black flex items-center gap-2 hover:underline">
                 View All Testimonials <ArrowUpRight className="w-5 h-5" />
               </button>
             </Reveal>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Yashika AI Testimonial */}
            <Reveal delay={0.1}>
              <div className="bg-slate-900 rounded-[3rem] p-10 space-y-8 text-white relative overflow-hidden group shadow-2xl h-full">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity -rotate-12">
                  <Play className="w-32 h-32 fill-current" />
                </div>
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <img src="https://picsum.photos/seed/yashika/100/100" className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-xl" />
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 p-1 rounded-full"><Play size={10} fill="white" /></div>
                  </div>
                  <div>
                    <h4 className="font-black text-lg">Yashika</h4>
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">AI Internship Graduate</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed italic font-medium">
                  "Apex Skills Technologies' ChatGPT Internships program was transformative. The hands-on AI projects cleared my path to top technical roles."
                </p>
                <div className="flex space-x-1 text-amber-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
            </Reveal>

            {/* Tanishka HR Testimonial */}
            <Reveal delay={0.2}>
              <div className="bg-indigo-600 rounded-[3rem] p-10 space-y-8 text-white shadow-2xl shadow-indigo-200 h-full">
                <div className="flex items-center space-x-5">
                  <img src="https://picsum.photos/seed/tanishka/100/100" className="w-16 h-16 rounded-full border-2 border-white shadow-xl" />
                  <div>
                    <h4 className="font-black text-lg">Tanishka</h4>
                    <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest">HR Internship Journey</p>
                  </div>
                </div>
                <p className="text-white text-lg leading-relaxed italic font-medium">
                  "My HR internship experience at Apex Skills Technologies helped me understand corporate dynamics. The mentorship was world-class."
                </p>
                <div className="flex space-x-1 text-white">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
            </Reveal>

            {/* Mahima AWS Testimonial */}
            <Reveal delay={0.3}>
              <div className="bg-slate-50 rounded-[3rem] p-10 space-y-8 text-slate-900 border border-slate-100 shadow-xl h-full">
                <div className="flex items-center space-x-5">
                  <img src="https://picsum.photos/seed/mahima/100/100" className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-xl" />
                  <div>
                    <h4 className="font-black text-lg">Mahima</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">AWS Internship Journey</p>
                  </div>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed italic font-medium">
                  "Highly recommend Apex Skills Technologies for cloud computing. The access to real infrastructure projects is absolutely priceless."
                </p>
                <div className="flex space-x-1 text-amber-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
            </Reveal>
          </div>

          {/* LinkedIn Testimonials */}
          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { name: "Bhukya Mamatha", text: "The best part of the journey was the hands-on exposure to real-world AI projects... truly transformative at Apex Skills Technologies." },
               { name: "Sagrika Pandey", text: "I have successfully nailed my Artificial Intelligence course from Apex Skills Technologies! Unbelievable journey." },
               { name: "Roso V G", text: "Successfully completed my Internship at Apex Skills Technologies. This experience has been incredibly enriching." }
             ].map((t, idx) => (
               <Reveal key={idx} delay={idx * 0.1}>
                 <div className="p-10 border border-slate-100 rounded-[2.5rem] bg-white hover:bg-indigo-50 transition-all group h-full">
                    <div className="flex items-center gap-2 text-indigo-600 mb-6">
                       <Linkedin size={24} />
                       <span className="font-black text-[10px] uppercase tracking-widest">Verified Alumnus</span>
                    </div>
                    <p className="text-slate-600 italic mb-8 font-medium">"{t.text}"</p>
                    <h4 className="font-black text-slate-900">— {t.name}</h4>
                 </div>
               </Reveal>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
