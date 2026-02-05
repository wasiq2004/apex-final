import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Course } from '../types';

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

const Programs: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/courses`);

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.data || []);
    } catch (error: any) {
      console.error('Failed to fetch courses:', error);
      setError(error.message || 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="pt-44 pb-32 overflow-hidden min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="mb-24 space-y-8">
          <Reveal delay={0.1}>
            <p className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-[10px]">Strategic Specializations</p>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none uppercase">
              Elite <span className="text-gold">Courses</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="w-16 h-1 bg-gold-metallic mb-8 opacity-50"></div>
            <p className="text-xl text-zinc-500 max-w-2xl font-medium leading-relaxed">
              Curated precision curriculums engineered to transition elite talent from core logic to high-scale production dominance.
            </p>
          </Reveal>
        </div>



        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
            <p className="text-white/60 font-medium">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-900/20 border border-red-500/30 p-8 rounded-lg text-center">
            <p className="text-red-400 font-medium mb-4">{error}</p>
            <button
              onClick={fetchCourses}
              className="px-6 py-3 bg-[#D4AF37] text-black font-black text-sm tracking-wider uppercase rounded-sm hover:scale-105 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 mb-40">
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-white/60 font-medium text-lg">No courses available.</p>
              </div>
            ) : (
              courses.map((course, idx) => (
                <Reveal key={course.id} delay={0.1 + (idx % 4) * 0.1}>
                  <div className="group h-full bg-zinc-900/30 border border-white/5 rounded-sm p-8 hover:border-[#D4AF37]/40 transition-all duration-700 flex flex-col shadow-xl relative overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-10 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 shadow-lg border border-white/5">
                      <img
                        src={course.thumbnail || `https://picsum.photos/seed/c${course.id}/800/600`}
                        alt={course.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
                      />
                      {course.is_best_seller && (
                        <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-[9px] font-black uppercase px-3 py-1.5 rounded-sm shadow-xl">Elite Priority</span>
                      )}
                    </div>

                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <Star className="text-[#D4AF37] w-4 h-4 fill-current" />
                          <span className="text-xs font-black text-white">{Number(course.rating || 0).toFixed(1)}</span>
                        </div>
                        <span className="text-[12px] font-bold text-white uppercase tracking-widest">{course.enrollments} ENROLLED</span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-5 uppercase leading-tight group-hover:text-[#D4AF37] transition-colors tracking-tight">{course.title}</h3>
                      <p className="text-base text-zinc-500 mb-10 font-medium line-clamp-3 leading-relaxed">{course.short_description}</p>

                      <div className="mt-auto space-y-6 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between text-[15px] font-black text-white uppercase tracking-widest">
                          <span className="bg-white/5 px-2 py-0.5 rounded-sm">{course.modules} Modules</span>
                          <span>{course.duration}</span>
                        </div>
                        {/* <div className="flex items-center justify-between text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                          <span className="bg-white/5 px-2 py-0.5 rounded-sm">{course.mode}</span>
                          {course.price && <span className="text-[#D4AF37]">₹{Number(course.price).toFixed(0)}</span>}
                        </div> */}
                        <Link
                          to={`/courses/${course.slug}`}
                          className="flex items-center justify-between w-full py-4 px-8 bg-zinc-900/60 text-white border border-white/10 rounded-sm font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gold-metallic hover:text-black hover:border-transparent transition-all shadow-lg group/btn"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;