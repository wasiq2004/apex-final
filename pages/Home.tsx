
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, ChevronRight, Award, Zap, Globe, Phone, Mail, ChevronLeft, Briefcase, Cpu, Code, Database, BarChart, Server, Clock, FileCheck, Users, Target, Rocket, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PARTNERS, TESTIMONIALS } from '../constants';
import EnquiryForm from '../components/EnquiryForm';
import AnimatedLogoReveal from '../components/AnimatedLogoReveal';

// Added className prop to Reveal to handle layout requirements in loops
import { API_URL } from '../src/config';

const Reveal = ({ children, delay = 0, y = 30, className }: { children?: React.ReactNode, delay?: number, y?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);


type PartnerLogoProps = {
  name: string;
  logo: string;
};

const PartnerLogo = ({ name, logo }: PartnerLogoProps) => {
  return (
    <div className="mx-8 md:mx-16 flex items-center justify-center group cursor-default">
      <div className="w-32 h-12 md:w-40 md:h-12 flex items-center justify-center bg-black/90">
        <img
          src={logo}
          alt={name}
          className="max-h-8 object-contain opacity-100 group-hover:opacity-100 transition-all duration-500"
        />
      </div>
    </div>
  );
};


const MENTORSHIP_SLIDES = [
  {
    icon: <Award className="w-10 h-10 text-[#D4AF37]" strokeWidth={1} />,
    title: "Skill Development",
    description: "Industry-aligned training across technical and professional domains with a strong focus on practical application and outcome-based learning.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200"
  },
  {
    icon: <Zap className="w-10 h-10 text-[#D4AF37]" strokeWidth={1} />,
    title: "Internship Programs",
    description: "Project-based internships simulating real-world work environments. Gain hands-on domain exposure with mentor support.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
  },
  {
    icon: <Globe className="w-10 h-10 text-[#D4AF37]" strokeWidth={1} />,
    title: "Career Readiness",
    description: "From resume development to mock interviews and aptitude training, we ensure you are ready for elite global opportunities.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
  }
];

const MentorshipCarousel = () => {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % MENTORSHIP_SLIDES.length);
  const prev = () => setActive((prev) => (prev - 1 + MENTORSHIP_SLIDES.length) % MENTORSHIP_SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative group w-full">
      <div className="overflow-hidden rounded-sm border border-white/5 bg-zinc-900/40 shadow-2xl relative min-h-[450px] flex items-stretch">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row w-full"
          >
            <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center space-y-8 relative z-10">
              <div className="inline-block p-4 bg-black/50 border border-[#D4AF37]/20 rounded-sm w-fit">
                {MENTORSHIP_SLIDES[active].icon}
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                  {MENTORSHIP_SLIDES[active].title.split(' ')[0]} <br />
                  <span className="text-gold">{MENTORSHIP_SLIDES[active].title.split(' ')[1]}</span>
                </h2>
                <div className="w-16 h-1 bg-gold-metallic"></div>
              </div>
              <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-lg">
                {MENTORSHIP_SLIDES[active].description}
              </p>
            </div>
            <div className="lg:w-1/2 relative min-h-[350px]">
              <img
                src={MENTORSHIP_SLIDES[active].image}
                className="absolute inset-0 w-full h-full object-cover "
                alt={MENTORSHIP_SLIDES[active].title}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/20 to-transparent"></div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-10 right-10 flex space-x-4 z-20">
          <button onClick={prev} className="p-3 border border-white/10 hover:border-[#D4AF37] text-white transition-all bg-black/50 hover:bg-gold-metallic hover:text-black">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="p-3 border border-white/10 hover:border-[#D4AF37] text-white transition-all bg-black/50 hover:bg-gold-metallic hover:text-black">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [bestSellingCourses, setBestSellingCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/courses/best-selling`)
      .then(res => res.json())
      .then(data => {
        setBestSellingCourses(data.data || []);
      })
      .catch(err => console.error('Failed to load best selling courses', err));
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(heroProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.4], [1, 1.02]);

  return (
    <div className="bg-[#050505]">

      {/* Animated Logo Reveal - First thing users see */}
      <AnimatedLogoReveal />

      {/* Partner Marquee Section */}
      <section className="py-16 bg-black/60 border-y border-white/5 relative z-10 overflow-hidden">
        <div className="relative flex overflow-x-hidden ">
          <div className="animate-marquee py-4 flex items-center">
            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
              <React.Fragment key={`${partner.name}-${i}`}>
                <PartnerLogo
                  name={partner.name}
                  logo={partner.logo}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Advantage Section */}
      <section className="py-16 lg:py-24 bg-[#050505]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <Reveal delay={0.1}>
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase">Professional <span className="text-gold">Advantage</span></h2>
              <div className="w-24 h-1 bg-gold-metallic mx-auto opacity-50"></div>
              <p className="text-zinc-500 tracking-[0.2em] text-[10px] uppercase font-black mt-4">Building Industry-Ready Talent</p>
            </div>
          </Reveal>
          <Reveal delay={0.2} y={30}>
            <MentorshipCarousel />
          </Reveal>
        </div>
      </section>

      {/* Internship Programs Section */}
      <section className="py-16 lg:py-24 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[150px] opacity-40 -z-10"></div>
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <Reveal delay={0.1}>
                <div className="inline-block px-5 py-2 bg-zinc-900 border border-white/5 rounded-sm mb-4">
                  <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">Operational Framework</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                  Internship <br /><span className="text-gold">Protocols</span>
                </h2>
                <div className="w-20 h-1 bg-gold-metallic mt-8 opacity-50"></div>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-xl">
                  Our internship programs provide practical industry exposure through guided projects and mentor support, designed for absolute immersion.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex items-center space-x-4 bg-zinc-900/40 p-6 border border-white/5 rounded-sm">
                  <GraduationCap className="text-[#D4AF37] w-8 h-8" />
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Global Eligibility</p>
                    <p className="text-white font-bold text-sm">Open to students from all academic backgrounds.</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <Clock size={20} />, title: "Duration", detail: "1–3 Months of Intensive Training" },
                { icon: <Briefcase size={20} />, title: "Assignments", detail: "Industry-Oriented Project Work" },
                { icon: <Users size={20} />, title: "Guidance", detail: "Continuous Mentor Performance Reviews" },
                { icon: <FileCheck size={20} />, title: "Certification", detail: "Official Completion Credentials" },
                { icon: <Zap size={20} />, title: "Benefits", detail: "Performance-Based Incentives", span: "col-span-1 md:col-span-2" }
              ].map((item, i) => (
                <Reveal key={i} delay={0.4 + i * 0.1} className={item.span}>
                  <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-sm hover:border-[#D4AF37]/30 transition-all duration-500 h-full">
                    <div className="text-[#D4AF37] mb-6">{item.icon}</div>
                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">{item.title}</h4>
                    <p className="text-lg font-black text-white tracking-tight">{item.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career & Placement Support Section */}
      <section className="py-16 lg:py-24 bg-[#050505]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 text-center mb-24">
          <Reveal delay={0.1}>
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase">Placement <span className="text-gold">Intelligence</span></h2>
              <div className="w-24 h-1 bg-gold-metallic mx-auto opacity-50"></div>
              <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium mt-8 leading-relaxed">
                We support learners beyond training through structured career guidance and elite placement readiness services.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { icon: <Target />, title: "Resume Design", desc: "Professional profile & portfolio development." },
              { icon: <Users />, title: "Mock Sessions", desc: "Technical & HR interview simulations." },
              { icon: <BarChart />, title: "Assessments", desc: "Aptitude, reasoning, and domain skill tests." },
              { icon: <Handshake />, title: "Placement", desc: "Internship-to-full-time transition assistance." },
              { icon: <Rocket />, title: "Hiring Access", desc: "Direct access to corporate hiring drives." }
            ].map((service, i) => (
              <Reveal key={i} delay={0.2 + i * 0.1}>
                <div className="group p-10 bg-zinc-900/20 border border-white/5 rounded-sm h-full hover:bg-zinc-900/40 hover:border-[#D4AF37]/30 transition-all duration-500 text-center">
                  <div className="mx-auto w-16 h-16 bg-black border border-white/10 rounded-sm flex items-center justify-center text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform duration-500">
                    {/* Fix: Explicitly cast React.ReactElement to allow passing custom props to cloneElement to avoid TypeScript error */}
                    {React.cloneElement(service.icon as React.ReactElement<any>, { size: 28, strokeWidth: 1 })}
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight mb-4 group-hover:text-gold transition-colors">{service.title}</h4>
                  <p className="text-[11px] text-zinc-600 font-medium leading-relaxed tracking-wide uppercase">{service.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section id="courses" className="py-16 lg:py-24 bg-black border-y border-white/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-24 gap-10">
            <Reveal delay={0.1}>
              <div className="space-y-6">
                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">Elite <span className="text-gold">Programs</span></h2>
                <p className="text-lg text-zinc-500 max-w-2xl font-medium leading-relaxed">Comprehensive, industry-aligned training across technical and professional domains.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <Link to="/programs" className="group inline-flex items-center text-[#D4AF37] border border-[#D4AF37]/20 px-8 py-4 rounded-sm font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gold-metallic hover:text-black transition-all">
                All Domains <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {bestSellingCourses.map((course, idx) => (
              <Reveal key={course.id} delay={idx * 0.1}>
                <div className="group bg-zinc-900/40 border border-white/5 rounded-sm p-12 hover:border-[#D4AF37]/30 transition-all duration-700 flex flex-col h-full relative overflow-hidden">
                  <div className="space-y-10 flex-grow">
                    <div className="flex justify-between items-center text-[9px] font-black tracking-[0.3em] text-[#D4AF37]">
                      <span className="bg-[#D4AF37]/10 px-3 py-1 rounded-sm uppercase">{course.category}</span>
                      <span className="opacity-50 uppercase">{course.duration}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{course.title}</h3>
                    <p className="text-base text-zinc-500 font-medium leading-relaxed">{course.short_description}</p>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-600 tracking-widest uppercase mb-1">Status</span>
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Enrolling Now</span>
                    </div>
                    <Link to="/programs" className="p-4 bg-zinc-800 text-[#D4AF37] rounded-sm group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-[#050505]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 text-center">
          <Reveal delay={0.1}>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase mb-20">Student <span className="text-gold">Testimonials</span></h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={0.2 + i * 0.1}>
                <div className="p-10 border border-white/5 bg-zinc-900/20 rounded-sm italic text-zinc-400 font-medium leading-relaxed">
                  "{t.text}"
                  <p className="mt-6 not-italic font-black text-[9px] text-[#D4AF37] tracking-widest uppercase">— {t.author}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Section */}
      <section id="enquiry" className="py-16 lg:py-24 bg-[#050505] relative border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-16">
              <Reveal delay={0.1}>
                <div className="space-y-8">
                  <h2 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                    Skill & <br /><span className="text-gold">Career.</span>
                  </h2>
                  <p className="text-xl text-zinc-500 max-w-xl font-medium leading-relaxed">Bridge the gap between academic education and modern industry requirements. Submit your roadmap request below.</p>
                </div>
              </Reveal>
              <div className="space-y-10">
                <Reveal delay={0.2}>
                  <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 bg-zinc-900 border border-white/5 flex items-center justify-center rounded-sm">
                      <Phone className="text-[#D4AF37]" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase mb-1">Reach Us Out</p>
                      <p className="text-xl font-black text-white tracking-tight">+91- 8073625691</p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 bg-zinc-900 border border-white/5 flex items-center justify-center rounded-sm">
                      <Mail className="text-[#D4AF37]" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase mb-1">Corporate Admissions</p>
                      <p className="text-xl font-black text-white tracking-tight">admissions@apexskill.in</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
            <Reveal delay={0.4} y={30}>
              <EnquiryForm />
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  );
};

// Helper component for Handshake icon which isn't imported from lucide-react above
const Handshake = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 17h2" />
    <path d="M18 9l-2 2-2-2" />
    <path d="M18 13l-2 2-2-2" />
    <path d="M2 13a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
    <path d="M13 13a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2z" />
  </svg>
);

export default Home;
