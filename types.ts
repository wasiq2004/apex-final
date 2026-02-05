

export interface Course {
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
  is_best_seller: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


export interface Mentor {
  id: string;
  name: string;
  organization: string;
  image: string;
  linkedIn: string;
  bio?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  speaker: string;
  participants: string;
  isPast: boolean;
  recordingUrl?: string;
}

export interface Job {
  id: string;
  role: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

export enum Category {
  ComputerScience = 'Computer Science',
  Management = 'Management',
  ECE = 'ECE',
  BioTech = 'Bio Technology',
  Civil = 'Civil',
  Mechanical = 'Mechanical'
}
