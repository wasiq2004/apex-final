import { Course, Mentor, Event, Job, BlogPost, Category } from './types';

export { Category };

export const PARTNERS = [
  {
    name: "Autodesk",
    logo: "/assest/Autodesk.png",
  },
  {
    name: "Centriport",
    logo: "/assest/centriport.png",
  },
  {
    name: "Cisco ",
    logo: "/assest/cisco (1).png",
  },
  {
    name: "ESB",
    logo: "/assest/ESP.png",
  },
  {
    name: "IC3",
    logo: "/assest/IC3.png",
  },
  {
    name: "Microsoft",
    logo: "/assest/Microsoft.png",
  },
  {
    name: "project Management Institute",
    logo: "/assest/projectManagement Instuite.png",
  },
  {
    name: "Swift",
    logo: "/assest/Swift.png",
  },
  {
    name: "Technology",
    logo: "/assest/technology.png",
  },
];



// Added MENTORS constant to resolve export error
export const MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Arjun Mehta',
    organization: 'Google',
    image: 'https://i.pravatar.cc/150?u=m1',
    linkedIn: '#',
    bio: 'Senior Software Architect with 15+ years of experience in distributed systems and cloud infrastructure.'
  },
  {
    id: 'm2',
    name: 'Sarah Jenkins',
    organization: 'Microsoft',
    image: 'https://i.pravatar.cc/150?u=m2',
    linkedIn: '#',
    bio: 'Cloud Infrastructure Lead specializing in Azure, Kubernetes, and global DevOps transformation.'
  },
  {
    id: 'm3',
    name: 'Priya Sharma',
    organization: 'Razorpay',
    image: 'https://i.pravatar.cc/150?u=m3',
    linkedIn: '#',
    bio: 'Product Management expert focused on fintech ecosystems and high-scale growth strategies.'
  },
  {
    id: 'm4',
    name: 'Michael Chen',
    organization: 'Meta',
    image: 'https://i.pravatar.cc/150?u=m4',
    linkedIn: '#',
    bio: 'AI Research Scientist working on large language models and real-time computer vision systems.'
  }
];

// Added BLOGS constant to resolve export error
export const BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Future of Full Stack Development in 2026',
    category: 'Technology',
    date: 'Oct 24, 2025',
    excerpt: 'Exploring the shift towards AI-augmented development, edge computing, and serverless architectures.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'b2',
    title: 'Mastering the Modern HR Landscape',
    category: 'Management',
    date: 'Nov 12, 2025',
    excerpt: 'How data analytics and employee experience platforms are transforming talent acquisition.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'b3',
    title: 'AI Ethics and Corporate Responsibility',
    category: 'AI/ML',
    date: 'Dec 05, 2025',
    excerpt: 'Navigating the complex world of ethical AI implementation and safety in enterprise settings.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200'
  }
];

export const TESTIMONIALS = [
  { text: "The training programs helped me gain practical exposure and interview confidence.", author: "Learner" },
  { text: "The internship structure was well-planned with meaningful project work.", author: "Intern" },
  { text: "Career support sessions were professional and effective.", author: "Early Professional" }
];

export const JOBS: Job[] = [
  {
    id: 'j1',
    role: 'Skill Development Intern',
    department: 'Technical',
    location: 'Bengaluru | Remote',
    type: 'Internship',
    description: 'Project-based internship simulating real-world work environments with mentor guidance.'
  }
];

export const FAQS = [
  {
    question: "What is the duration of internship programs?",
    answer: "Our project-based internships typically last between 1 to 3 months, featuring guided project assignments and performance reviews."
  }
];
