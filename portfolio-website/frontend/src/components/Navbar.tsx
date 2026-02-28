import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { navItems } from '../data/profile';
import { useUser } from '../contexts/UserContext';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { userInfo, isLoggedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map(item => item.id);
      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offsetTop = element.offsetTop - 64; // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#home" className="navbar-logo" onClick={(e) => handleNavClick(e, '#home')}>
          赵国政
        </a>

        {/* Desktop Navigation */}
        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`navbar-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* User Avatar */}
          <li className="navbar-user">
            <Link
              to={isLoggedIn ? '/profile' : '/login'}
              className="navbar-avatar-link"
              title={isLoggedIn ? '个人中心' : '登录/注册'}
            >
              {isLoggedIn && userInfo?.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.username}
                  className="navbar-avatar-img"
                />
              ) : (
                <div className="navbar-avatar-default">
                  <User size={20} />
                </div>
              )}
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`navbar-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="navbar-mobile-menu">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`navbar-mobile-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* Mobile User Link */}
          <li>
            <Link
              to={isLoggedIn ? '/profile' : '/login'}
              className="navbar-mobile-link navbar-mobile-user"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {isLoggedIn ? '个人中心' : '登录 / 注册'}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
