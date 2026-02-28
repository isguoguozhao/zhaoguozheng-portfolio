import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import AdminProfile from './admin/pages/Profile';
import Images from './admin/pages/Images';
import Categories from './admin/pages/Categories';
import ProjectsAdmin from './admin/pages/Projects';
import Experiences from './admin/pages/Experiences';
import Skills from './admin/pages/Skills';
import Social from './admin/pages/Social';
// User pages
import UserLogin from './pages/Login';
import UserRegister from './pages/Register';
import UserProfile from './pages/Profile';
import './styles/global.css';

// Main Portfolio Page
function Portfolio() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
      
      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={handleBackToTop}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

// User Protected Route Component
function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('user_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Portfolio */}
          <Route path="/" element={<Portfolio />} />

          {/* User Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route
            path="/profile"
            element={
              <UserProtectedRoute>
                <UserProfile />
              </UserProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="images" element={<Images />} />
            <Route path="categories" element={<Categories />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="experiences" element={<Experiences />} />
            <Route path="skills" element={<Skills />} />
            <Route path="social" element={<Social />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
