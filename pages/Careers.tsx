import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { JOBS } from '../constants';
import CareerApplicationModal from '../components/CareerApplicationModal';
import { API_URL } from '../src/config';

const Reveal = ({ children, delay = 0, y = 30 }: { children?: React.ReactNode, delay?: number, y?: number, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const Careers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [modalType, setModalType] = useState<'internship' | 'mentor' | 'job'>('job');
  const [selectedInternshipId, setSelectedInternshipId] = useState<number | undefined>(undefined);
  const [internships, setInternships] = useState<any[]>([]);

  React.useEffect(() => {
    fetch(`${API_URL}/api/internships`)
      .then(res => res.json())
      .then(data => setInternships(data.data || []))
      .catch(err => console.error('Failed to load internships', err));
  }, []);

  const handleApplyClick = (position: string, type: 'internship' | 'mentor' | 'job' = 'job', id?: number) => {
    setSelectedPosition(position);
    setModalType(type);
    setSelectedInternshipId(id);
    setIsModalOpen(true);
  };
  return (
    <div className="pt-44 pb-32 overflow-hidden min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <Reveal delay={0.1}>
          <div className="bg-zinc-900/10 border border-white/5 rounded-sm p-16 lg:p-24 text-center relative overflow-hidden mb-40 shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[150px] opacity-40"></div>
            <div className="relative z-10 space-y-10">
              <p className="text-[#D4AF37] font-black uppercase tracking-[0.5em] text-[10px]">Human Capital Protocol</p>
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-none tracking-tighter uppercase">
                Join the <span className="text-gold">Architects.</span>
              </h1>
              <div className="w-24 h-1 bg-gold-metallic mx-auto mb-10"></div>
              <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium">
                We're recruiting elite educators, high-status engineers, and visionary creative architects to define the future of global mastery.
              </p>
              <button className="px-14 py-5 bg-gold-metallic text-black rounded-sm font-black text-xs tracking-[0.4em] uppercase shadow-gold-glow hover:scale-105 transition-all mt-8">Open Protocol Board</button>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-12 mb-40">
          {[
            { title: 'Remote Hierarchy', desc: 'Work from any global hub with absolute operational flexibility and autonomy.' },
            { title: 'Intellectual Cap', desc: 'Unlimited investment in your constant evolution, elite courses, and personal mastery.' },
            { title: 'Prestige Growth', desc: 'Fast-track your professional status in an elite high-status environment.' }
          ].map((benefit, i) => (
            <Reveal key={i} delay={0.2 + i * 0.1}>
              <div className="p-12 bg-zinc-900/30 rounded-sm border border-white/5 h-full hover:border-[#D4AF37]/30 transition-all duration-500 shadow-xl group">
                <div className="w-14 h-14 bg-black/50 border border-white/5 rounded-sm flex items-center justify-center mb-10 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                  <Star className="w-6 h-6 text-[#D4AF37] group-hover:text-black" strokeWidth={1.5} />
                </div>
                <h4 className="text-2xl font-black text-white mb-5 uppercase tracking-tight group-hover:text-gold transition-colors">{benefit.title}</h4>
                <p className="text-base text-zinc-600 font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mentor Section */}
        <div className="mb-40 text-center">
          <Reveal>
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-[#D4AF37]/20 p-16 rounded-sm relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl lg:text-5xl font-black text-white uppercase mb-6">Share Your <span className="text-gold">Mastery</span></h2>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-medium">
                  Join our elite network of mentors and shape the next generation of architects.
                </p>
                <button
                  onClick={() => handleApplyClick('Mentor Application', 'mentor')}
                  className="px-12 py-4 bg-[#D4AF37] text-black font-black text-xs tracking-[0.3em] uppercase rounded-sm hover:scale-105 transition-all shadow-gold-glow"
                >
                  Apply as Mentor
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Internships Section */}
        {internships.length > 0 && (
          <div className="mb-40 space-y-16">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 gap-8">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">Student <span className="text-gold">program</span></h2>
                  <p className="text-lg text-zinc-500 tracking-[0.2em] font-medium uppercase mt-2">Internship Opportunities</p>
                </div>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-8">
              {internships.filter(i => i.is_active).map((internship, i) => (
                <Reveal key={internship.id} delay={i * 0.1}>
                  <div className="bg-zinc-900/30 border border-white/5 p-8 hover:border-[#D4AF37]/30 transition-all group">
                    <h3 className="text-2xl font-black text-white uppercase mb-2 group-hover:text-[#D4AF37] transition-colors">{internship.title}</h3>
                    <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-2" /> {internship.location}</span>
                      <span>⏱️ {internship.duration}</span>
                      <span>💰 {internship.stipend}</span>
                    </div>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed">{internship.description}</p>
                    <button
                      onClick={() => handleApplyClick(internship.title, 'internship', internship.id)}
                      className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center"
                    >
                      Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-12 gap-8">
            <Reveal delay={0.1}>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">Global <span className="text-gold">Roles</span></h2>
                <p className="text-lg text-zinc-500 tracking-[0.2em] font-medium uppercase">Active Opportunities in our Elite Grid</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <span className="bg-zinc-900 text-[#D4AF37] border border-[#D4AF37]/20 px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.4em] shadow-lg">{JOBS.length} POSITIONS SECURED</span>
            </Reveal>
          </div>

          <div className="space-y-8">
            {JOBS.map((job, idx) => (
              <Reveal key={job.id} delay={0.1 + idx * 0.1}>
                <div className="group p-10 bg-zinc-900/40 rounded-sm border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-700 flex flex-col xl:flex-row xl:items-center justify-between gap-10 shadow-xl relative overflow-hidden">
                  <div className="space-y-6 relative z-10 flex-grow">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="px-5 py-1.5 bg-black text-[#D4AF37] rounded-sm text-[9px] font-black uppercase tracking-[0.3em] border border-[#D4AF37]/10">{job.type}</span>
                      <span className="px-5 py-1.5 bg-white/5 text-zinc-500 rounded-sm text-[9px] font-black uppercase tracking-[0.3em]">{job.department}</span>
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-gold transition-colors">{job.role}</h3>
                    <div className="flex items-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                      <MapPin className="w-4 h-4 mr-2 text-[#D4AF37]" strokeWidth={1.5} />
                      {job.location}
                    </div>
                  </div>
                  <button
                    onClick={() => handleApplyClick(job.role)}
                    className="px-12 py-5 bg-zinc-900/60 text-white border border-white/10 rounded-sm font-black text-[10px] tracking-[0.4em] uppercase hover:bg-gold-metallic hover:text-black hover:border-transparent transition-all shadow-xl group-hover:scale-105 shrink-0">
                    Apply Now <ArrowRight className="ml-3 w-5 h-5 inline group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div> */}
      </div>

      <CareerApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        position={selectedPosition}
        type={modalType}
        internshipId={selectedInternshipId}
      />
    </div>
  );
};

export default Careers;