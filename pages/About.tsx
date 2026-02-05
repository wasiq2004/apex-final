import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, TrendingUp, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

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

const About: React.FC = () => {
  const stats = [
    { label: 'MASTERS', value: '20K+', icon: <Users className="w-7 h-7 text-[#D4AF37]" /> },
    { label: 'DOMAINS', value: '10+', icon: <Award className="w-7 h-7 text-[#D4AF37]" /> },
    { label: 'TRAINERS', value: '100+', icon: <UserCheck className="w-7 h-7 text-[#D4AF37]" /> },
    { label: 'SUCCESS', value: '95%', icon: <TrendingUp className="w-7 h-7 text-[#D4AF37]" /> },
  ];

  const focusAreas = [
    { title: "Industry-Aligned", desc: "Curriculum based on current job roles and evolving global standards.", icon: <ShieldCheck /> },
    { title: "Project-Based", desc: "Hands-on learning methodologies that simulate real-world work environments.", icon: <Briefcase /> },
    { title: "Career-Oriented", desc: "Measurable skill growth with outcome-driven mentorship for every learner.", icon: <TrendingUp /> },
    { title: "Professional Intake", desc: "Continuous assessment and structured feedback from experienced industry trainers.", icon: <UserCheck /> },
  ];

  return (
    <div className="pt-44 pb-20 bg-[#050505] overflow-hidden min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center mb-52">
          <div className="space-y-12">
            <Reveal delay={0.1}>
              <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 text-[#D4AF37] px-5 py-2 rounded-sm text-[9px] font-black uppercase tracking-[0.4em]">Organization Summary</div>
            </Reveal>
            <Reveal delay={0.2}>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter uppercase">
                Bridging the <br /><span className="text-gold">Academic Gap</span> <br />with Precision.
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="w-20 h-1 bg-gold-metallic mb-8"></div>
              <p className="text-xl text-zinc-500 leading-relaxed font-medium max-w-2xl">
                Apex Skills Technology Pvt. Ltd. is a professional skill development and career enablement organization focused on building industry-ready talent through structured training and internships.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 gap-8">
              {stats.map((s, i) => (
                <Reveal key={i} delay={0.4 + i * 0.1}>
                  <div className="p-10 bg-zinc-900/30 border border-white/5 rounded-sm h-full hover:border-[#D4AF37]/30 transition-all duration-500 shadow-xl">
                    <div className="mb-8">{s.icon}</div>
                    <h4 className="text-4xl font-black text-white tracking-tighter">{s.value}</h4>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] mt-3">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-24 bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10"></div>
            <div className="relative rounded-sm overflow-hidden border border-white/5 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600" className="object-cover w-full aspect-[4/5]" alt="Apex Skills Leadership" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
            <Reveal delay={0.8} y={30}>
              <div className="absolute -bottom-10 -right-8 bg-gold-metallic text-black p-12 rounded-sm shadow-2xl">
                <p className="text-5xl font-black mb-2 tracking-tighter uppercase">Apex Skills</p>
                <p className="text-black font-black tracking-[0.4em] uppercase text-[10px] opacity-80">Tech Pvt. Ltd.</p>
              </div>
            </Reveal>
          </motion.div>
        </div>

        <section className="mb-24 py-20 bg-zinc-900/10 border border-white/5 rounded-sm px-10 lg:px-20 text-center">
          <Reveal delay={0.1}>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-8 leading-none">Our Focus <span className="text-gold">Areas</span></h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium mb-24 leading-relaxed">Combining structured learning pathways, hands-on project exposure, and continuous assessment.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">
            {focusAreas.map((area, idx) => (
              <Reveal key={idx} delay={0.3 + idx * 0.1}>
                <div className="space-y-8 group">
                  <div className="mx-auto w-20 h-20 bg-zinc-900/60 rounded-sm text-[#D4AF37] flex items-center justify-center border border-white/5 group-hover:bg-gold-metallic group-hover:text-black transition-all duration-500 shadow-xl">
                    {/* Fix: Explicitly cast React.ReactElement to allow passing custom props to cloneElement */}
                    {React.cloneElement(area.icon as React.ReactElement<any>, { size: 28, strokeWidth: 1.5 })}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{area.title}</h4>
                    <p className="text-sm text-zinc-600 font-medium leading-relaxed">{area.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
