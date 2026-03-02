import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data/profile';
import VisitStats from './VisitStats';
import RealtimeClock from './RealtimeClock';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          bioRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          socialRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-header">
            <h1 ref={titleRef} className="hero-title">
              {profile.name}
            </h1>
            <VisitStats />
          </div>
          <p ref={subtitleRef} className="hero-subtitle">
            {profile.title}
          </p>
          <p ref={bioRef} className="hero-bio">
            {profile.bio}
          </p>
          <div ref={ctaRef} className="hero-cta">
            <RealtimeClock />
            <button className="btn btn-primary" onClick={handleScrollToProjects}>
              查看作品
            </button>
            <a href="#contact" className="btn btn-secondary">
              联系我
            </a>
          </div>
          <div ref={socialRef} className="hero-social">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-link"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-link"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="hero-social-link"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <button
            className="hero-scroll-btn"
            onClick={handleScrollToProjects}
            aria-label="Scroll to projects"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </div>
      <div className="hero-bg">
        <div className="hero-bg-shape hero-bg-shape-1">
          <img src="/assets/images/photo1.png" alt="个人照片1" className="hero-bg-img" />
        </div>
        <div className="hero-bg-shape hero-bg-shape-2">
          <img src="/assets/images/photo2.jpg" alt="个人照片2" className="hero-bg-img" />
        </div>
        <div className="hero-bg-shape hero-bg-shape-3">
          <img src="/assets/images/photo3.jpg" alt="个人照片3" className="hero-bg-img" />
        </div>
      </div>
    </section>
  );
}
