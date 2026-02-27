import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { profile } from '../data/profile';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <button className="footer-logo" onClick={handleScrollToTop}>
              {profile.name}
            </button>
            <p className="footer-tagline">{profile.subtitle}</p>
          </div>

          <div className="footer-links">
            <a href="#home" className="footer-link">首页</a>
            <a href="#projects" className="footer-link">作品</a>
            <a href="#experience" className="footer-link">经验</a>
            <a href="#about" className="footer-link">关于</a>
            <a href="#contact" className="footer-link">联系</a>
          </div>

          <div className="footer-social">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="footer-social-link"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} {profile.name}. All rights reserved.
          </p>
          <p className="footer-made">
            Made with <Heart size={14} className="footer-heart" /> using React & GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}
