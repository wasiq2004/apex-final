import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6 border-t border-white/5 relative z-10">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">

        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 pb-8 border-b border-white/5">

          {/* BRAND */}
          <div className="space-y-1">
            <Link to="/" className="inline-flex group">
              <img
                src="/Logobgblack-removebg-preview.png"
                alt="Apex Skill Technologies"
                className="scale-70 object-contain transition-transform group-hover:scale-110"
              />
            </Link>
            {/* <p className="text-[11px] tracking-widest leading-relaxed uppercase text-white/70 max-w-sm">
              Skill Development · Internships · Career Enablement.
              Bridging the gap between academic education and modern industry needs.
            </p> */}
          </div>

          {/* COURSES
          <div>
            <h4 className="text-xs font-black tracking-[0.35em] uppercase mb-6 text-[#D4AF37]">
              Courses
            </h4>
            <ul className="space-y-4 text-[11px] tracking-widest uppercase text-white/80">
              <li><Link to="/courses/full-stack" className="hover:text-[#D4AF37] transition-all">Full Stack Development</Link></li>
              <li><Link to="/courses/data-science" className="hover:text-[#D4AF37] transition-all">Data Science & AI</Link></li>
              <li><Link to="/courses/cyber-security" className="hover:text-[#D4AF37] transition-all">Cyber Security</Link></li>
              <li><Link to="/courses/cloud-computing" className="hover:text-[#D4AF37] transition-all">Cloud Computing</Link></li>
              <li><Link to="/courses/digital-marketing" className="hover:text-[#D4AF37] transition-all">Digital Marketing</Link></li>
            </ul>
          </div> */}

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-xs font-black tracking-[0.35em] uppercase mb-6 text-[#D4AF37]">
              Quick Links
            </h4>
            <ul className="space-y-4 text-[11px] tracking-widest uppercase text-white/80">
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-all">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-[#D4AF37] transition-all">Programs</Link></li>
              <li><Link to="/careers" className="hover:text-[#D4AF37] transition-all">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4AF37] transition-all">Contact</Link></li>
              <li><Link to="/admin" className="hover:text-[#D4AF37] transition-all font-bold">Admin Panel</Link></li>
            </ul>
          </div>

          {/* CONTACT + SOCIAL */}
          <div>
            <h4 className="text-xs font-black tracking-[0.35em] uppercase mb-6 text-[#D4AF37]">
              Connect
            </h4>

            <div className="space-y-4 text-[11px] tracking-widest uppercase text-white/80">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>info@apexskill.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>+91-8073625691</span>
              </div>
            </div>

            <div className="flex gap-6 mt-6">
              {[Linkedin, Instagram, Youtube, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-white/60 hover:text-[#D4AF37] transition-all"
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black tracking-[0.35em] uppercase text-white/60">
          <p>© 2026 Apex Skill Technologies Pvt. Ltd. All Rights Reserved.</p>

          <div className="flex gap-10">
            <Link to="/privacy-policy" className="hover:text-[#D4AF37] transition-all">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#D4AF37] transition-all">Terms</Link>
            <Link to="/refund-policy" className="hover:text-[#D4AF37] transition-all">Refund Policy</Link>
          </div>

          <p className="text-[#D4AF37]/60 tracking-[0.2em]">
            Made with <span className="text-red-500">♥</span> by Digieagles
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
