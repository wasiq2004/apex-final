import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig, AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import CourseDetail from './pages/CourseDetail';
import Mentors from './pages/Mentors';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const PageWrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-hidden"
    >
      {children}
    </motion.div>
  );
};

const App: React.FC = () => {
  return (
    <MotionConfig transition={{ type: "spring", damping: 20, stiffness: 100 }}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin routes without header/footer */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Public routes with header/footer */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-[#D4AF37] selection:text-black">
              <Header />
              <main className="flex-grow">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                    <Route path="/programs" element={<PageWrapper><Programs /></PageWrapper>} />
                    <Route path="/courses/:slug" element={<PageWrapper><CourseDetail /></PageWrapper>} />
                    <Route path="/mentors" element={<PageWrapper><Mentors /></PageWrapper>} />
                    <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                    <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                    <Route path="/careers" element={<PageWrapper><Careers /></PageWrapper>} />
                  </Routes>
                </AnimatePresence>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </MotionConfig>
  );
};

export default App;