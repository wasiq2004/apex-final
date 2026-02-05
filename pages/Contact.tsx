import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Youtube, Linkedin, Plus, Minus } from 'lucide-react';
import EnquiryForm from '../components/EnquiryForm';


const FAQ_DATA = {
  "Common FAQs": [
    { q: "What courses do you offer?", a: "We offer skill-based and academic courses designed to help learners achieve real-world success." },
    { q: "Who can enroll in your courses?", a: "Anyone can enroll—students, professionals, beginners, or advanced learners." },
    { q: "Are the courses online or offline?", a: "Our courses are available online, with some programs offering live or hybrid sessions." },
    { q: "Do I need prior knowledge to join?", a: "No prior experience is required unless specifically mentioned for advanced courses." }
  ],
  "Enrollment & Booking FAQs": [
    { q: "How do I book a course slot?", a: "You can book a slot directly through our website/payment link by completing the registration and payment." },
    { q: "Can I change my batch or slot after booking?", a: "Batch changes are subject to availability and approval by our team." },
    { q: "Is there a refund policy?", a: "Once a slot is booked, the fee is non-refundable." }
  ],
  "Learning & Support FAQs": [
    { q: "Will I get live classes or recorded sessions?", a: "We offer live classes, recorded sessions, or a combination depending on the course." },
    { q: "Can I interact with instructors and other students?", a: "Yes! Our platform supports live interaction, doubt-clearing sessions, and peer collaboration." },
    { q: "What if I miss a class?", a: "Recorded sessions will be available so you can catch up anytime." }
  ],
  "Certification & Outcomes": [
    { q: "Will I receive a certificate?", a: "Yes, a certificate of completion will be provided after successfully finishing the course." },
    { q: "Are the certificates industry-recognized?", a: "Our certificates are designed to add value to your academic and professional profile." }
  ],
  "Technical FAQs": [
    { q: "What devices are supported?", a: "You can access our platform on mobile, tablet, laptop, or desktop." },
    { q: "Who do I contact for technical support?", a: "You can reach our support team via email, chat, or the help section on our platform." }
  ]
};

const Reveal = ({ children, delay = 0, y = 30 }: { children?: React.ReactNode, delay?: number, y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const Contact: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Common FAQs");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="pt-44 pb-32 overflow-hidden min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="text-left mb-24 space-y-6">
          <Reveal delay={0.1}>
            <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none uppercase">
              Get in <span className="text-gold">Touch</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="w-16 h-1 bg-gold-metallic mb-6 opacity-50"></div>
            <p className="text-lg lg:text-xl text-zinc-500 max-w-2xl font-medium leading-relaxed">
              Reach out to our professional strategists for elite career advisory and corporate intake.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          {/* Info Side */}
          <div className="lg:col-span-4 space-y-16">
            <div className="space-y-10">
              <Reveal delay={0.3}>
                <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4">Protocol Support</h3>
              </Reveal>
              <div className="space-y-12">
                <Reveal delay={0.4}>
                  <div className="flex items-start space-x-6 group">
                    <div className="bg-zinc-900/60 p-5 rounded-sm border border-white/5 text-[#D4AF37] group-hover:bg-gold-metallic group-hover:text-black transition-all duration-500 shadow-xl">
                      <Mail className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-600 uppercase tracking-[0.4em] text-[8px] mb-2">Corporate Relations</h4>
                      <p className="text-lg font-black text-white tracking-tight">admissions@apexskill.in</p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.5}>
                  <div className="flex items-start space-x-6 group">
                    <div className="bg-zinc-900/60 p-5 rounded-sm border border-white/5 text-[#D4AF37] group-hover:bg-gold-metallic group-hover:text-black transition-all duration-500 shadow-xl">
                      <Phone className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-600 uppercase tracking-[0.4em] text-[8px] mb-2">Operational Line</h4>
                      <p className="text-lg font-black text-white tracking-tight">+91 80882 79615</p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.6}>
                  <div className="flex items-start space-x-6 group">
                    <div className="bg-zinc-900/60 p-5 rounded-sm border border-white/5 text-[#D4AF37] group-hover:bg-gold-metallic group-hover:text-black transition-all duration-500 shadow-xl">
                      <MapPin className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-600 uppercase tracking-[0.4em] text-[8px] mb-2">HQ Address</h4>
                      <p className="text-base text-white font-bold leading-relaxed">HSR Layout, Singasandra,<br />Bengaluru, Karnataka 560068</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            <Reveal delay={0.7}>
              <div className="space-y-6 pt-10 border-t border-white/5">
                <h3 className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Digital Protocol</h3>
                <div className="flex space-x-4">
                  {[Linkedin, Instagram, Youtube].map((Icon, i) => (
                    <a key={i} href="#" className="p-4 bg-zinc-900/40 border border-white/5 rounded-sm text-zinc-500 hover:text-[#D4AF37] transition-all duration-500">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form Side - Given more columns (8 of 12) for more width */}
          <div className="lg:col-span-8 w-full">
            <Reveal delay={0.4} y={30}>
              <EnquiryForm />
            </Reveal>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-5xl mx-auto">
          <Reveal delay={0.2}>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter">
                Frequently Asked <span className="text-gold">Questions</span>
              </h2>
              <div className="w-12 h-1 bg-gold-metallic mx-auto opacity-50"></div>
            </div>
          </Reveal>

          {/* Categories */}
          <Reveal delay={0.3}>
            <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-3 mb-12 pb-2 scrollbar-hide">
              {Object.keys(FAQ_DATA).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveTab(category);
                    setOpenFAQ(null);
                  }}
                  className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === category
                    ? 'bg-gold-metallic text-black shadow-lg shadow-gold-glow'
                    : 'bg-zinc-900/40 text-zinc-500 border border-white/5 hover:text-white hover:border-[#D4AF37]/50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Questions */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {FAQ_DATA[activeTab as keyof typeof FAQ_DATA].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-zinc-900/40 border border-white/5 rounded-lg overflow-hidden transition-all duration-300 ${openFAQ === index ? 'border-[#D4AF37]/50 shadow-lg' : 'hover:border-white/10'
                      }`}
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    >
                      <span className={`font-bold text-lg transition-colors duration-300 ${openFAQ === index ? 'text-[#D4AF37]' : 'text-zinc-300 group-hover:text-white'
                        }`}>
                        {faq.q}
                      </span>
                      <div className={`p-2 rounded-full transition-all duration-300 ${openFAQ === index ? 'bg-gold-metallic text-black' : 'bg-white/5 text-zinc-500 group-hover:text-white'
                        }`}>
                        {openFAQ === index ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {openFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;