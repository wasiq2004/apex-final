
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Search } from 'lucide-react';
import { BLOGS } from '../constants';

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

const Blogs: React.FC = () => {
  return (
    <div className="pt-40 pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <h1 className="text-6xl font-black text-slate-950 tracking-tighter leading-none">Knowledge Hub</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl text-slate-500 max-w-xl font-medium leading-relaxed">
                Insights, industry updates, and career tips from the experts at Apex Skills Technologies.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.3} y={20}>
            <div className="w-full lg:w-96 relative">
               <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
          </Reveal>
        </div>

        {/* Featured Post */}
        <Reveal delay={0.4} y={50}>
          <div className="mb-24 relative group cursor-pointer overflow-hidden rounded-[4rem] shadow-3xl border border-slate-50">
             <img src={BLOGS[0].image} className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000" alt="Featured Post" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
             <div className="absolute bottom-0 left-0 p-10 lg:p-20 text-white space-y-8">
                <Reveal delay={0.6}>
                  <span className="px-6 py-2 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{BLOGS[0].category}</span>
                </Reveal>
                <Reveal delay={0.7}>
                  <h2 className="text-4xl lg:text-6xl font-black max-w-3xl leading-tight tracking-tighter">{BLOGS[0].title}</h2>
                </Reveal>
                <Reveal delay={0.8}>
                  <div className="flex items-center space-x-10 text-xs font-black uppercase tracking-widest opacity-80">
                     <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {BLOGS[0].date}</span>
                     <span className="flex items-center group-hover:text-indigo-400 transition-colors">Read Full Article <ArrowRight className="ml-3 w-5 h-5" /></span>
                  </div>
                </Reveal>
             </div>
          </div>
        </Reveal>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
          {BLOGS.map((post, idx) => (
            <Reveal key={post.id} delay={0.1 + (idx % 3) * 0.1}>
              <div className="group space-y-8 h-full flex flex-col">
                <div className="overflow-hidden rounded-[2.5rem] aspect-[16/10] shadow-saas group-hover:shadow-saas-hover transition-all duration-500">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="space-y-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-indigo-600">{post.category}</span>
                    <span className="text-slate-400">{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight">{post.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed line-clamp-3 flex-grow">{post.excerpt}</p>
                  <button className="flex items-center font-black text-sm text-indigo-600 hover:text-slate-950 transition-colors uppercase tracking-widest">
                    Read Full Story <ArrowRight className="ml-3 w-5 h-5" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Pagination */}
        <Reveal delay={0.2}>
          <div className="flex justify-center space-x-3">
             <button className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black shadow-xl shadow-indigo-100">1</button>
             <button className="w-14 h-14 rounded-2xl bg-white text-slate-600 font-black hover:bg-slate-50 transition-all border border-slate-100">2</button>
             <button className="w-14 h-14 rounded-2xl bg-white text-slate-600 font-black hover:bg-slate-50 transition-all border border-slate-100">3</button>
             <button className="px-8 h-14 rounded-2xl bg-white text-slate-600 font-black hover:bg-slate-50 transition-all border border-slate-100 uppercase tracking-widest text-[10px]">Next Page</button>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Blogs;
