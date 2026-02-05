import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    LogOut,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Menu,
    X,
    Save,
    XCircle,
    Award,
    Briefcase,
    Users,
    CheckCircle,
    UserCheck,
    FileText,
    Plus,
    Search
} from 'lucide-react';
import { API_URL } from '../src/config';

interface Course {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    full_description: string;
    duration: string;
    mode: 'Online' | 'Offline' | 'Hybrid';
    price: number | null;
    thumbnail: string | null;
    category: string;
    rating: number;
    enrollments: string;
    modules: number;
    isBestSeller: boolean;
    isActive: boolean;
    created_at: string;
    updated_at: string;
}

interface Internship {
    id: number;
    title: string;
    description: string;
    location: string;
    duration: string;
    stipend: string;
    is_active: boolean;
    created_at: string;
}

interface Application {
    id: number;
    type: 'internship' | 'mentor';
    internship_id: number | null;
    full_name: string;
    email: string;
    phone: string;
    resume_link: string;
    message: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    created_at: string;
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [courseForm, setCourseForm] = useState({
        title: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        duration: '',
        mode: 'Online' as 'Online' | 'Offline' | 'Hybrid',
        price: '',
        thumbnail: '',
        category: '',
        rating: '0',
        enrollments: '0',
        modules: '0',
        isBestSeller: false,
        isActive: true
    });

    // Internship State
    const [internships, setInternships] = useState<Internship[]>([]);
    const [internshipForm, setInternshipForm] = useState({
        title: '',
        description: '',
        location: 'Remote',
        duration: '',
        stipend: '',
        isActive: true
    });
    const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
    const [isEditingInternship, setIsEditingInternship] = useState(false);

    // Application State
    const [applications, setApplications] = useState<Application[]>([]);
    const [applicationFilter, setApplicationFilter] = useState<'all' | 'internship' | 'mentor'>('all');

    // Form Visibility State
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [showInternshipForm, setShowInternshipForm] = useState(false);

    // Google Sheets Applications State
    const [sheetsApplications, setSheetsApplications] = useState<any>({ all: [], contact: [], internship: [], mentor: [] });
    const [sheetsLoading, setSheetsLoading] = useState(false);
    const [sheetsError, setSheetsError] = useState('');
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
            else setSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const username = localStorage.getItem('adminUsername') || 'Admin';

    useEffect(() => {
        console.log('[AdminDashboard] useEffect triggered', { activeTab });
        const token = localStorage.getItem('adminToken');
        console.log('[AdminDashboard] Token check:', token ? 'Token exists' : 'No token');
        if (!token) {
            console.log('[AdminDashboard] No token, redirecting to /admin');
            navigate('/admin');
            return;
        }
        if (activeTab === 'courses') {
            console.log('[AdminDashboard] Fetching courses...');
            fetchCourses();
        }
        if (activeTab === 'internships') {
            console.log('[AdminDashboard] Fetching internships...');
            fetchInternships();
        }
        if (activeTab === 'applications') {
            console.log('[AdminDashboard] Fetching Google Sheets applications...');
            fetchSheetsApplications();
        }
    }, [activeTab, navigate]);

    // Auto-refresh Google Sheets data every 45 seconds
    useEffect(() => {
        if (activeTab === 'applications') {
            const interval = setInterval(() => {
                console.log('[AdminDashboard] Auto-refreshing Google Sheets data...');
                fetchSheetsApplications();
            }, 45000); // 45 seconds
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    const fetchCourses = async () => {
        console.log('[fetchCourses] Starting...');
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            console.log('[fetchCourses] Making API call to:', `${API_URL}/api/courses/all`);
            const response = await fetch(`${API_URL}/api/courses/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('[fetchCourses] Response status:', response.status);
            if (!response.ok) throw new Error('Failed to fetch courses');
            const data = await response.json();
            console.log('[fetchCourses] Data received:', data);
            // Map snake_case from DB to camelCase for frontend
            const mappedCourses = (data.data || []).map((c: any) => ({
                ...c,
                isActive: c.is_active,
                isBestSeller: c.is_best_seller
            }));
            console.log('[fetchCourses] Mapped courses:', mappedCourses.length);
            setCourses(mappedCourses);
        } catch (error: any) {
            console.error('[fetchCourses] Error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInternships = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/internships/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch internships');
            const data = await response.json();
            setInternships(data.data || []);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch applications');
            const data = await response.json();
            setApplications(data.data || []);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSheetsApplications = async () => {
        console.log('[fetchSheetsApplications] Starting...');
        setSheetsLoading(true);
        setSheetsError('');
        try {
            const token = localStorage.getItem('adminToken');
            console.log('[fetchSheetsApplications] Making API call to:', `${API_URL}/api/applications/sheets`);
            const response = await fetch(`${API_URL}/api/applications/sheets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('[fetchSheetsApplications] Response status:', response.status);
            if (!response.ok) throw new Error('Failed to fetch Google Sheets applications');
            const data = await response.json();
            console.log('[fetchSheetsApplications] Data received:', data);
            setSheetsApplications(data.data || { all: [], contact: [], internship: [], mentor: [] });
            setLastRefresh(new Date());
        } catch (error: any) {
            console.error('[fetchSheetsApplications] Error:', error);
            setSheetsError(error.message);
        } finally {
            setSheetsLoading(false);
        }
    };

    const handleInternshipSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const url = editingInternship ? `${API_URL}/api/internships/${editingInternship.id}` : `${API_URL}/api/internships`;
            const method = editingInternship ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(internshipForm)
            });

            if (!response.ok) throw new Error('Failed to save internship');
            await fetchInternships();
            resetInternshipForm();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteInternship = async (id: number) => {
        if (!confirm('Delete this internship?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`${API_URL}/api/internships/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchInternships();
        } catch (error) {
            console.error(error);
        }
    };

    const handleApplicationStatus = async (id: number, status: string) => {
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`${API_URL}/api/applications/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            fetchApplications();
        } catch (error) {
            console.error(error);
        }
    };

    const startEditInternship = (internship: Internship) => {
        setEditingInternship(internship);
        setInternshipForm({
            title: internship.title,
            description: internship.description,
            location: internship.location,
            duration: internship.duration,
            stipend: internship.stipend,
            isActive: internship.is_active
        });
        setIsEditingInternship(true);
        setShowInternshipForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetInternshipForm = () => {
        setEditingInternship(null);
        setInternshipForm({
            title: '',
            description: '',
            location: 'Remote',
            duration: '',
            stipend: '',
            isActive: true
        });
        setIsEditingInternship(false);
        setShowInternshipForm(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        navigate('/admin');
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const token = localStorage.getItem('adminToken');

        try {
            const url = editingCourse
                ? `${API_URL}/api/courses/${editingCourse.id}`
                : `${API_URL}/api/courses`;

            const method = editingCourse ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: courseForm.title,
                    slug: courseForm.slug || undefined,
                    shortDescription: courseForm.shortDescription,
                    fullDescription: courseForm.fullDescription,
                    duration: courseForm.duration,
                    mode: courseForm.mode,
                    price: courseForm.price ? parseFloat(courseForm.price) : null,
                    thumbnail: courseForm.thumbnail || null,
                    category: courseForm.category,
                    rating: parseFloat(courseForm.rating),
                    enrollments: courseForm.enrollments,
                    modules: parseInt(courseForm.modules),
                    isBestSeller: courseForm.isBestSeller,
                    isActive: courseForm.isActive
                })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({ error: 'Server error' }));
                throw new Error(data.error || 'Failed to save course');
            }

            await fetchCourses();
            resetForm();
        } catch (error: any) {
            console.error('Failed to save course:', error);
            setError(error.message || 'Failed to save course');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        setIsLoading(true);
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${API_URL}/api/courses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete course');
            }

            await fetchCourses();
        } catch (error: any) {
            console.error('Failed to delete course:', error);
            setError(error.message || 'Failed to delete course');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleVisibility = async (id: number) => {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${API_URL}/api/courses/${id}/toggle-visibility`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to toggle visibility');
            }

            await fetchCourses();
        } catch (error: any) {
            console.error('Failed to toggle visibility:', error);
            setError(error.message || 'Failed to toggle visibility');
        } finally {
            setIsLoading(false);
        }
    };

    const startEdit = (course: Course) => {
        setEditingCourse(course);
        setCourseForm({
            title: course.title || '',
            slug: course.slug || '',
            shortDescription: course.short_description || '',
            fullDescription: course.full_description || '',
            duration: course.duration || '',
            mode: course.mode || 'Online',
            price: course.price?.toString() || '',
            thumbnail: course.thumbnail || '',
            category: course.category || '',
            rating: course.rating?.toString() || '0',
            enrollments: course.enrollments || '0',
            modules: course.modules?.toString() || '0',
            isBestSeller: course.isBestSeller || false,
            isActive: course.isActive !== undefined ? course.isActive : true
        });
        setIsEditing(true);
        setShowCourseForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingCourse(null);
        setCourseForm({
            title: '',
            slug: '',
            shortDescription: '',
            fullDescription: '',
            duration: '',
            mode: 'Online',
            price: '',
            thumbnail: '',
            category: '',
            rating: '0',
            enrollments: '0',
            modules: '0',
            isBestSeller: false,
            isActive: true
        });
        setError('');
        setShowCourseForm(false);
    };

    console.log('[AdminDashboard] Rendering component', {
        activeTab,
        coursesCount: courses.length,
        isLoading,
        error,
        sidebarOpen
    });

    return (
        <div className="min-h-screen bg-black flex relative overflow-hidden">
            {/* Video Background */}
            <video
                className="absolute inset-0 w-full h-full object-cover opacity-20"
                src="/assest/goldenparticle.mp4"
                autoPlay
                loop
                muted
                playsInline
            />

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="absolute inset-0 bg-black/80 z-40 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Sidebar */}
            <aside
                style={{ width: isMobile ? (sidebarOpen ? 280 : 0) : (sidebarOpen ? 280 : 80) }}
                className={`bg-zinc-900/50 border-r border-white/10 backdrop-blur-xl flex flex-col transition-all duration-300 z-50
                    ${isMobile ? 'fixed inset-y-0 left-0' : 'relative'}
                    ${isMobile && !sidebarOpen ? '-translate-x-full border-none' : 'translate-x-0'}
                `}
            >
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">
                                    Apex Admin
                                </h2>
                                <p className="text-xs text-white/60 mt-1 font-bold uppercase tracking-wider">
                                    Control Panel
                                </p>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard'
                            ? 'bg-[#D4AF37] text-black shadow-gold-glow'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span className="font-bold text-sm">Dashboard</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'courses'
                            ? 'bg-[#D4AF37] text-black shadow-gold-glow'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <BookOpen className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span className="font-bold text-sm">Courses</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('internships')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'internships'
                            ? 'bg-[#D4AF37] text-black shadow-gold-glow'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Briefcase className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span className="font-bold text-sm">Internships</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'applications'
                            ? 'bg-[#D4AF37] text-black shadow-gold-glow'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Users className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span className="font-bold text-sm">Applications</span>}
                    </button>
                </nav>

                <div className="p-4 border-t border-white/10">
                    {sidebarOpen && (
                        <div className="mb-3 px-4 py-3 bg-white/5 rounded-lg">
                            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">
                                Logged in as
                            </p>
                            <p className="text-white font-bold text-sm">{username}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span className="font-bold text-sm">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative z-10">
                {isMobile && !sidebarOpen && (
                    <div className="sticky top-0 z-30 bg-zinc-900/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-white tracking-wider">APEX ADMIN</h2>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                )}
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {/* Dashboard View */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">Dashboard</h1>
                            <p className="text-white/60 mb-8">Welcome back, {username}!</p>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-1">{courses.length}</h3>
                                    <p className="text-white/60 text-sm font-bold uppercase tracking-wider">Total Courses</p>
                                </div>

                                <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-green-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-1">
                                        {courses.filter(c => c.is_active).length}
                                    </h3>
                                    <p className="text-white/60 text-sm font-bold uppercase tracking-wider">Active Courses</p>
                                </div>

                                <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-zinc-500/20 rounded-lg flex items-center justify-center">
                                            <EyeOff className="w-6 h-6 text-zinc-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-1">
                                        {courses.filter(c => !c.is_active).length}
                                    </h3>
                                    <p className="text-white/60 text-sm font-bold uppercase tracking-wider">Inactive Courses</p>
                                </div>
                            </div>

                            <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-6">
                                <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
                                <button
                                    onClick={() => setActiveTab('courses')}
                                    className="px-6 py-3 bg-[#D4AF37] text-black font-black text-sm tracking-wider uppercase rounded-lg shadow-gold-glow hover:scale-[1.02] transition-all"
                                >
                                    Manage Courses
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Courses View */}
                    {activeTab === 'courses' && (
                        <div>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                                <div>
                                    <h1 className="text-4xl font-black text-white mb-2">Course Management</h1>
                                    <p className="text-white/60">Create, edit, and manage your courses</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (showCourseForm) {
                                            resetForm();
                                        } else {
                                            setShowCourseForm(true);
                                        }
                                    }}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${showCourseForm
                                        ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                                        : 'bg-[#D4AF37] text-black shadow-gold-glow hover:scale-[1.02]'
                                        }`}
                                >
                                    {showCourseForm ? (
                                        <>
                                            <X className="w-5 h-5" />
                                            <span>Cancel</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            <span>Add New Course</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {error && (
                                <div
                                    className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg text-red-400 text-sm mb-6"
                                >
                                    {error}
                                </div>
                            )}

                            {/* Course Form */}
                            {showCourseForm && (
                                <div
                                    className="overflow-hidden"
                                >
                                    <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-8 mb-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-black text-white">
                                                {isEditing ? 'Edit Course' : 'Add New Course'}
                                            </h2>
                                        </div>

                                        <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                                            {/* Basic Info */}
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Course Title *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={courseForm.title}
                                                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                        required
                                                        placeholder="e.g., Full Stack Web Development"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Slug (URL-friendly, auto-generated if empty)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={courseForm.slug}
                                                        onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                        placeholder="e.g., full-stack-web-development"
                                                    />
                                                </div>
                                            </div>

                                            {/* Descriptions */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                    Short Description * (for course cards)
                                                </label>
                                                <textarea
                                                    value={courseForm.shortDescription}
                                                    onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg min-h-[80px] resize-none"
                                                    required
                                                    placeholder="Brief description (10-500 characters)"
                                                ></textarea>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                    Full Description * (for course detail page)
                                                </label>
                                                <textarea
                                                    value={courseForm.fullDescription}
                                                    onChange={(e) => setCourseForm({ ...courseForm, fullDescription: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg min-h-[200px] resize-y"
                                                    required
                                                    placeholder="Detailed course description (50-10000 characters)"
                                                ></textarea>
                                            </div>

                                            {/* Course Details */}
                                            <div className="grid md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Duration *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={courseForm.duration}
                                                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                        required
                                                        placeholder="e.g., 3 Months"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Mode
                                                    </label>
                                                    <select
                                                        value={courseForm.mode}
                                                        onChange={(e) => setCourseForm({ ...courseForm, mode: e.target.value as 'Online' | 'Offline' | 'Hybrid' })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                    >
                                                        <option value="Online">Online</option>
                                                        <option value="Offline">Offline</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Price (₹)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={courseForm.price}
                                                        onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                        placeholder="Leave empty for free"
                                                    />
                                                </div>
                                            </div>

                                            {/* Category and Metadata */}
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Category *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={courseForm.category}
                                                        onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                        required
                                                        placeholder="e.g., Computer Science"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Thumbnail URL
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={courseForm.thumbnail}
                                                        onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Rating (0-5)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="5"
                                                        value={courseForm.rating}
                                                        onChange={(e) => setCourseForm({ ...courseForm, rating: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Enrollments
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={courseForm.enrollments}
                                                        onChange={(e) => setCourseForm({ ...courseForm, enrollments: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                        placeholder="e.g., 15K+"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 tracking-wider uppercase">
                                                        Number of Modules
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={courseForm.modules}
                                                        onChange={(e) => setCourseForm({ ...courseForm, modules: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            {/* Toggles */}
                                            <div className="flex flex-wrap gap-6">
                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={courseForm.isBestSeller}
                                                        onChange={(e) => setCourseForm({ ...courseForm, isBestSeller: e.target.checked })}
                                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                                                    />
                                                    <span className="text-sm font-bold text-white flex items-center space-x-2">
                                                        <Award className="w-4 h-4 text-[#D4AF37]" />
                                                        <span>Mark as Best Seller</span>
                                                    </span>
                                                </label>

                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={courseForm.isActive}
                                                        onChange={(e) => setCourseForm({ ...courseForm, isActive: e.target.checked })}
                                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                                                    />
                                                    <span className="text-sm font-bold text-white flex items-center space-x-2">
                                                        <Eye className="w-4 h-4 text-green-500" />
                                                        <span>Active (Visible on public site)</span>
                                                    </span>
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F9E076] text-black font-black text-sm tracking-wider uppercase rounded-lg shadow-gold-glow hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Save className="w-5 h-5" />
                                                <span>{isLoading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Courses List */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-white mb-6">
                                    All Courses ({courses.length})
                                </h2>

                                {isLoading && courses.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37] mx-auto"></div>
                                        <p className="text-white/60 mt-4">Loading courses...</p>
                                    </div>
                                ) : courses.length === 0 ? (
                                    <div className="text-center py-20 bg-zinc-900/40 border border-white/10 rounded-lg">
                                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/20" />
                                        <p className="text-white/60 font-medium">No courses yet. Create your first course above.</p>
                                    </div>
                                ) : (
                                    courses.map((course) => (
                                        <div
                                            key={course.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 hover:border-[#D4AF37]/30 transition-all"
                                        >
                                            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                                <div className="flex-grow">
                                                    <div className="flex items-center space-x-4 mb-3 flex-wrap gap-2">
                                                        <h3 className="text-xl font-black text-white">{course.title}</h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${course.isActive
                                                            ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                                                            : 'bg-zinc-800 text-white/60 border border-zinc-700'
                                                            }`}>
                                                            {course.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                        {course.isBestSeller && (
                                                            <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                                                                Best Seller
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-white/40 font-mono">/{course.slug}</span>
                                                    </div>
                                                    <p className="text-white/70 text-sm mb-3 leading-relaxed">{course.short_description || ''}</p>
                                                    <div className="flex flex-wrap gap-4 text-xs text-white/60">
                                                        <span>📚 {course.category || 'N/A'}</span>
                                                        <span>⏱️ {course.duration || 'N/A'}</span>
                                                        <span>📍 {course.mode || 'N/A'}</span>
                                                        <span>⭐ {course.rating ? Number(course.rating).toFixed(1) : '0.0'}</span>
                                                        <span>👥 {course.enrollments || '0'}</span>
                                                        <span>📖 {Number(course.modules) || 0} modules</span>
                                                        {course.price && <span className="text-[#D4AF37] font-bold">₹{Number(course.price).toFixed(0)}</span>}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2 md:ml-6 ml-0 w-full md:w-auto justify-end">
                                                    <button
                                                        onClick={() => handleToggleVisibility(course.id)}
                                                        className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white/60 hover:text-white transition-all"
                                                        title={course.isActive ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {course.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => startEdit(course)}
                                                        className="p-3 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black rounded-lg text-white/60 transition-all"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course.id)}
                                                        className="p-3 bg-zinc-800 hover:bg-red-600 rounded-lg text-white/60 hover:text-white transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'internships' && (
                        <div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                                <div>
                                    <h1 className="text-4xl font-black text-white mb-2">Internship Programs</h1>
                                    <p className="text-white/60">Manage student internship listings</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (showInternshipForm) {
                                            resetInternshipForm();
                                        } else {
                                            setShowInternshipForm(true);
                                        }
                                    }}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${showInternshipForm
                                        ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                                        : 'bg-[#D4AF37] text-black shadow-gold-glow hover:scale-[1.02]'
                                        }`}
                                >
                                    {showInternshipForm ? (
                                        <>
                                            <X className="w-5 h-5" />
                                            <span>Cancel</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            <span>Add New Internship</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {showInternshipForm && (
                                <div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-8 mb-8">
                                        <h2 className="text-2xl font-black text-white mb-6">
                                            {isEditingInternship ? 'Edit Internship' : 'Add New Internship'}
                                        </h2>
                                        <form onSubmit={handleInternshipSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 uppercase">Title</label>
                                                    <input type="text" value={internshipForm.title} onChange={e => setInternshipForm({ ...internshipForm, title: e.target.value })} className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white rounded-lg" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 uppercase">Location</label>
                                                    <input type="text" value={internshipForm.location} onChange={e => setInternshipForm({ ...internshipForm, location: e.target.value })} className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white rounded-lg" />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 uppercase">Duration</label>
                                                    <input type="text" value={internshipForm.duration} onChange={e => setInternshipForm({ ...internshipForm, duration: e.target.value })} className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white rounded-lg" placeholder="e.g. 6 Months" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-white/80 uppercase">Stipend</label>
                                                    <input type="text" value={internshipForm.stipend} onChange={e => setInternshipForm({ ...internshipForm, stipend: e.target.value })} className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white rounded-lg" placeholder="e.g. Unpaid or ₹5000/mo" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-white/80 uppercase">Description</label>
                                                <textarea value={internshipForm.description} onChange={e => setInternshipForm({ ...internshipForm, description: e.target.value })} className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white rounded-lg min-h-[100px]" required />
                                            </div>
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input type="checkbox" checked={internshipForm.isActive} onChange={e => setInternshipForm({ ...internshipForm, isActive: e.target.checked })} className="w-5 h-5 rounded border-white/20 bg-black/40 text-[#D4AF37]" />
                                                <span className="text-sm font-bold text-white">Active</span>
                                            </label>
                                            <div className="flex gap-4">
                                                <button type="submit" className="px-8 py-3 bg-[#D4AF37] text-black font-black uppercase rounded-lg hover:scale-[1.02] transition-all">
                                                    {isEditingInternship ? 'Update' : 'Create'}
                                                </button>
                                                {isEditingInternship && (
                                                    <button type="button" onClick={resetInternshipForm} className="px-6 py-3 bg-zinc-800 text-white font-bold uppercase rounded-lg">Cancel</button>
                                                )}
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {internships.map(intern => (
                                    <div key={intern.id} className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-black text-white">{intern.title}</h3>
                                            <p className="text-white/60 text-sm mt-1">{intern.location} • {intern.duration} • {intern.stipend}</p>
                                            <div className={`mt-2 inline-block px-2 py-1 text-xs font-bold rounded ${intern.is_active ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                                {intern.is_active ? 'Active' : 'Inactive'}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto justify-end">
                                            <button onClick={() => startEditInternship(intern)} className="p-2 bg-zinc-800 rounded hover:text-[#D4AF37]"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteInternship(intern.id)} className="p-2 bg-zinc-800 rounded hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'applications' && (
                        <div>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                                <div>
                                    <h1 className="text-4xl font-black text-white mb-2">Live Applications</h1>
                                    <p className="text-white/60">Google Sheets data • Auto-refreshes every 45s</p>
                                    {lastRefresh && (
                                        <p className="text-white/40 text-xs mt-1">Last updated: {lastRefresh.toLocaleTimeString()}</p>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['all', 'contact', 'internship', 'mentor'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setApplicationFilter(type as any)}
                                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${applicationFilter === type
                                                ? 'bg-[#D4AF37] text-black shadow-gold-glow'
                                                : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                    <button
                                        onClick={fetchSheetsApplications}
                                        disabled={sheetsLoading}
                                        className="px-4 py-2 rounded-lg text-xs font-black uppercase bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
                                    >
                                        {sheetsLoading ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="mb-6 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-[#D4AF37]/50 outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            {sheetsError && (
                                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg text-red-400 text-sm mb-6">
                                    {sheetsError}
                                </div>
                            )}

                            {sheetsLoading && sheetsApplications.all.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
                                    <p className="text-white/60 mt-4">Loading applications...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(() => {
                                        let filteredApps = applicationFilter === 'all'
                                            ? sheetsApplications.all
                                            : sheetsApplications[applicationFilter] || [];

                                        // Sort by Date (Descending - Newest First)
                                        filteredApps = [...filteredApps].sort((a: any, b: any) => {
                                            const dateA = new Date(a.Timestamp || 0).getTime();
                                            const dateB = new Date(b.Timestamp || 0).getTime();
                                            return dateB - dateA;
                                        });

                                        // Filter by Search Query
                                        if (searchQuery.trim()) {
                                            const query = searchQuery.toLowerCase();
                                            filteredApps = filteredApps.filter((app: any) => {
                                                const searchable = [
                                                    app['Full Name'],
                                                    app.Name,
                                                    app.Email,
                                                    app.Phone,
                                                    app.Message,
                                                    app['Internship Title'],
                                                    app.Interest,
                                                    app.type
                                                ].filter(Boolean).join(' ').toLowerCase();
                                                return searchable.includes(query);
                                            });
                                        }

                                        if (filteredApps.length === 0) {
                                            return (
                                                <div className="text-center py-20 bg-zinc-900/40 border border-white/10 rounded-lg">
                                                    <p className="text-white/60">No {applicationFilter} applications found</p>
                                                </div>
                                            );
                                        }

                                        return filteredApps.map((app: any, index: number) => (
                                            <div key={index} className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 hover:border-[#D4AF37]/30 transition-all">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-black text-white">{app['Full Name'] || app.Name || app.Timestamp}</h3>
                                                            {app.type && (
                                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${app.type === 'internship'
                                                                    ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                                                                    : app.type === 'mentor'
                                                                        ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30'
                                                                        : 'bg-green-900/30 text-green-400 border border-green-500/30'
                                                                    }`}>
                                                                    {app.type}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                            {app.Email && (
                                                                <p className="text-white/70">
                                                                    <span className="text-white/40">📧</span> {app.Email}
                                                                </p>
                                                            )}
                                                            {app.Phone && (
                                                                <p className="text-white/70">
                                                                    <span className="text-white/40">📱</span> {app.Phone}
                                                                </p>
                                                            )}
                                                            {app.Interest && (
                                                                <p className="text-white/70">
                                                                    <span className="text-white/40">🎯</span> {app.Interest}
                                                                </p>
                                                            )}
                                                            {app['Internship Title'] && (
                                                                <p className="text-white/70">
                                                                    <span className="text-white/40">💼</span> {app['Internship Title']}
                                                                </p>
                                                            )}
                                                            {app.LinkedIn && app.LinkedIn !== 'N/A' && (
                                                                <p className="text-white/70">
                                                                    <span className="text-white/40">🔗</span> LinkedIn
                                                                </p>
                                                            )}
                                                            {app.Experience && app.Experience !== 'N/A' && (
                                                                <p className="text-white/70">
                                                                    <span className="text-white/40">⏱️</span> {app.Experience} years
                                                                </p>
                                                            )}
                                                            {app.Domain && app.Domain !== 'N/A' && (
                                                                <p className="text-white/70">
                                                                    <span className="text-white/40">🎯</span> {app.Domain}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {(app['Resume Link'] && app['Resume Link'] !== 'N/A') && (
                                                    <a
                                                        href={app['Resume Link']}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-[#D4AF37] text-sm hover:underline mb-3"
                                                    >
                                                        <FileText className="w-4 h-4" /> View Resume
                                                    </a>
                                                )}

                                                {app.Message && (
                                                    <div className="bg-black/20 p-4 rounded text-sm text-white/80 mt-3">
                                                        <span className="text-white/40 uppercase text-xs font-bold block mb-2">Message</span>
                                                        <p>{app.Message}</p>
                                                    </div>
                                                )}

                                                <p className="text-white/20 text-xs mt-4 text-right">
                                                    {app.Timestamp}
                                                </p>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main >
        </div >
    );
};

export default AdminDashboard;
