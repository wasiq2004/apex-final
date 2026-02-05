import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogOut, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Course {
    id: number;
    title: string;
    description: string;
    price: number | null;
    status: 'visible' | 'hidden';
    created_at: string;
    updated_at: string;
}

const AdminPanel: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');

    const [courses, setCourses] = useState<Course[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        price: '',
        status: 'visible' as 'visible' | 'hidden'
    });

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCourses();
        }
    }, [isAuthenticated]);

    const checkAuth = () => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('adminToken', data.data.token);
            setIsAuthenticated(true);
        } catch (error: any) {
            setLoginError(error.message || 'Invalid credentials');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        navigate('/');
    };

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/courses/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setCourses(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
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
                    ...courseForm,
                    price: courseForm.price ? parseFloat(courseForm.price) : null
                })
            });

            if (response.ok) {
                fetchCourses();
                resetForm();
            }
        } catch (error) {
            console.error('Failed to save course:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${API_URL}/api/courses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchCourses();
            }
        } catch (error) {
            console.error('Failed to delete course:', error);
        }
    };

    const handleToggleVisibility = async (id: number) => {
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${API_URL}/api/courses/${id}/toggle-visibility`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchCourses();
            }
        } catch (error) {
            console.error('Failed to toggle visibility:', error);
        }
    };

    const startEdit = (course: Course) => {
        setEditingCourse(course);
        setCourseForm({
            title: course.title,
            description: course.description,
            price: course.price?.toString() || '',
            status: course.status
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingCourse(null);
        setCourseForm({ title: '', description: '', price: '', status: 'visible' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-sm p-12 shadow-2xl"
                >
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gold-metallic rounded-sm flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-black" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Admin Access</h1>
                        <p className="text-zinc-500 text-sm mt-2 tracking-[0.2em] uppercase">Restricted Protocol</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {loginError && (
                            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-sm text-red-400 text-sm">
                                {loginError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">Username</label>
                            <input
                                type="text"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">Password</label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gold-metallic text-black font-black text-[10px] tracking-[0.5em] uppercase rounded-sm shadow-gold-glow hover:scale-[1.02] transition-all"
                        >
                            Authenticate
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
                            Admin <span className="text-gold">Control</span>
                        </h1>
                        <p className="text-zinc-500 mt-2 tracking-[0.2em] uppercase text-sm">Course Management System</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-6 py-3 bg-zinc-900 border border-white/10 rounded-sm text-zinc-400 hover:text-white hover:border-red-500/30 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-black text-[10px] tracking-[0.3em] uppercase">Logout</span>
                    </button>
                </div>

                {/* Course Form */}
                <div className="bg-zinc-900/40 border border-white/10 rounded-sm p-8 mb-12">
                    <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                        {isEditing ? 'Edit Course' : 'Create New Course'}
                    </h2>

                    <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">Course Title *</label>
                                <input
                                    type="text"
                                    value={courseForm.title}
                                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">Price (Optional)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={courseForm.price}
                                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">Description *</label>
                            <textarea
                                value={courseForm.description}
                                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm min-h-[120px] resize-none"
                                required
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">Status</label>
                            <select
                                value={courseForm.status}
                                onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value as 'visible' | 'hidden' })}
                                className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-all font-medium rounded-sm"
                            >
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                type="submit"
                                className="px-8 py-4 bg-gold-metallic text-black font-black text-[10px] tracking-[0.5em] uppercase rounded-sm shadow-gold-glow hover:scale-[1.02] transition-all"
                            >
                                {isEditing ? 'Update Course' : 'Create Course'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 py-4 bg-zinc-800 text-white font-black text-[10px] tracking-[0.5em] uppercase rounded-sm hover:bg-zinc-700 transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Courses List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                        All Courses ({courses.length})
                    </h2>

                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-zinc-900/40 border border-white/10 rounded-sm p-6 hover:border-[#D4AF37]/30 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-grow">
                                    <div className="flex items-center space-x-4 mb-3">
                                        <h3 className="text-xl font-black text-white">{course.title}</h3>
                                        <span className={`px-3 py-1 rounded-sm text-[8px] font-black tracking-[0.3em] uppercase ${course.status === 'visible'
                                                ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                                                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </div>
                                    <p className="text-zinc-500 text-sm mb-3">{course.description}</p>
                                    {course.price && (
                                        <p className="text-[#D4AF37] font-black text-sm">₹{course.price.toFixed(2)}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 ml-6">
                                    <button
                                        onClick={() => handleToggleVisibility(course.id)}
                                        className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-sm text-zinc-400 hover:text-white transition-all"
                                        title={course.status === 'visible' ? 'Hide' : 'Show'}
                                    >
                                        {course.status === 'visible' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => startEdit(course)}
                                        className="p-3 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black rounded-sm text-zinc-400 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="p-3 bg-zinc-800 hover:bg-red-600 rounded-sm text-zinc-400 hover:text-white transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {courses.length === 0 && (
                        <div className="text-center py-20 text-zinc-600">
                            <Plus className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="font-medium">No courses yet. Create your first course above.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
