import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Star,
    Clock,
    Users,
    BookOpen,
    Award,
    ChevronRight,
    Loader2,
    ArrowLeft,
    MapPin,
    DollarSign
} from 'lucide-react';
import { Course } from '../types';
import { API_URL } from '../src/config';

const Reveal = ({ children, delay = 0 }: { children?: React.ReactNode, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
);

const CourseDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (slug) {
            fetchCourse();
        }
    }, [slug]);

    const fetchCourse = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/courses/slug/${slug}`);

            if (!response.ok) {
                if (response.status === 404) {
                    setError('Course not found');
                } else {
                    throw new Error('Failed to fetch course');
                }
                return;
            }

            const data = await response.json();
            setCourse(data.data);
        } catch (error: any) {
            console.error('Failed to fetch course:', error);
            setError(error.message || 'Failed to load course');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin mx-auto mb-4" />
                    <p className="text-white/60 font-medium">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="bg-red-900/20 border border-red-500/30 p-8 rounded-lg mb-6">
                        <p className="text-red-400 font-medium text-lg mb-4">{error || 'Course not found'}</p>
                        <p className="text-white/60 text-sm">The course you're looking for doesn't exist or has been removed.</p>
                    </div>
                    <Link
                        to="/programs"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-[#D4AF37] text-black font-black text-sm tracking-wider uppercase rounded-sm hover:scale-105 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Courses</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Back Button */}
                <Reveal delay={0.1}>
                    <Link
                        to="/programs"
                        className="inline-flex items-center space-x-2 text-white/60 hover:text-[#D4AF37] transition-colors mb-12 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm uppercase tracking-wider">Back to Courses</span>
                    </Link>
                </Reveal>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Hero Section */}
                        <Reveal delay={0.2}>
                            <div className="space-y-6">
                                {course.is_best_seller && (
                                    <span className="inline-block bg-[#D4AF37] text-black text-[9px] font-black uppercase px-4 py-2 rounded-sm shadow-xl">
                                        ⭐ Elite Priority Course
                                    </span>
                                )}
                                <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none uppercase">
                                    {course.title}
                                </h1>
                                <p className="text-xl text-zinc-400 font-medium leading-relaxed">
                                    {course.short_description}
                                </p>

                                {/* Stats Bar */}
                                <div className="flex flex-wrap gap-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-5 h-5 text-[#D4AF37] fill-current" />
                                        <span className="text-white font-black">{course.rating.toFixed(1)}</span>
                                        <span className="text-white/60 text-sm">Rating</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-5 h-5 text-[#D4AF37]" />
                                        <span className="text-white font-black">{course.enrollments}</span>
                                        <span className="text-white/60 text-sm">Enrolled</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                                        <span className="text-white font-black">{course.modules}</span>
                                        <span className="text-white/60 text-sm">Modules</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Course Image */}
                        <Reveal delay={0.3}>
                            <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 shadow-2xl">
                                <img
                                    src={course.thumbnail || `https://picsum.photos/seed/c${course.id}/1200/675`}
                                    alt={course.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </Reveal>

                        {/* Full Description */}
                        <Reveal delay={0.4}>
                            <div className="bg-zinc-900/30 border border-white/5 rounded-lg p-8 space-y-6">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                                    Course <span className="text-[#D4AF37]">Overview</span>
                                </h2>
                                <div className="w-16 h-1 bg-[#D4AF37] opacity-50"></div>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-zinc-400 leading-relaxed whitespace-pre-line">
                                        {course.full_description}
                                    </p>
                                </div>
                            </div>
                        </Reveal>

                        {/* What You'll Learn */}
                        <Reveal delay={0.5}>
                            <div className="bg-zinc-900/30 border border-white/5 rounded-lg p-8 space-y-6">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                                    What You'll <span className="text-[#D4AF37]">Learn</span>
                                </h2>
                                <div className="w-16 h-1 bg-[#D4AF37] opacity-50"></div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        'Industry-standard best practices',
                                        'Real-world project experience',
                                        'Expert mentorship and guidance',
                                        'Career advancement strategies',
                                        'Hands-on practical assignments',
                                        'Professional certification'
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start space-x-3">
                                            <Award className="w-5 h-5 text-[#D4AF37] shrink-0 mt-1" />
                                            <span className="text-white/80 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Reveal delay={0.3}>
                            <div className="sticky top-32 bg-zinc-900/50 border border-white/10 rounded-lg p-8 space-y-8 backdrop-blur-xl">
                                <h3 className="text-2xl font-black text-white uppercase">Course Details</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4 pb-6 border-b border-white/10">
                                        <Clock className="w-6 h-6 text-[#D4AF37] shrink-0" />
                                        <div>
                                            <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-1">Duration</p>
                                            <p className="text-white font-black">{course.duration}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 pb-6 border-b border-white/10">
                                        <MapPin className="w-6 h-6 text-[#D4AF37] shrink-0" />
                                        <div>
                                            <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-1">Mode</p>
                                            <p className="text-white font-black">{course.mode}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 pb-6 border-b border-white/10">
                                        <BookOpen className="w-6 h-6 text-[#D4AF37] shrink-0" />
                                        <div>
                                            <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-1">Category</p>
                                            <p className="text-white font-black">{course.category}</p>
                                        </div>
                                    </div>

                                    {course.price && (
                                        <div className="flex items-start space-x-4 pb-6 border-b border-white/10">
                                            <DollarSign className="w-6 h-6 text-[#D4AF37] shrink-0" />
                                            <div>
                                                <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-1">Price</p>
                                                <p className="text-[#D4AF37] font-black text-2xl">₹{course.price.toFixed(0)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-4 pt-6">
                                    <Link
                                        to="/contact"
                                        className="flex items-center justify-between w-full py-4 px-6 bg-gradient-to-r from-[#D4AF37] to-[#F9E076] text-black font-black text-sm tracking-wider uppercase rounded-sm shadow-gold-glow hover:scale-[1.02] transition-all group"
                                    >
                                        <span>Enroll Now</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <Link
                                        to="/contact"
                                        className="flex items-center justify-center w-full py-4 px-6 bg-white/5 text-white border border-white/10 font-black text-sm tracking-wider uppercase rounded-sm hover:bg-white/10 transition-all"
                                    >
                                        Contact Us
                                    </Link>
                                </div>

                                {/* Additional Info */}
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-xs text-white/40 leading-relaxed">
                                        Need more information? Our team is ready to help you make the right choice for your career advancement.
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
