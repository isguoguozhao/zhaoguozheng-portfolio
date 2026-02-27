import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink, Github, Calendar, User } from 'lucide-react';
import { projects } from '../data/profile';
import type { Project } from '../types';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const categories = ['全部', 'Web应用', '小程序开发', '人工智能', '数据可视化'];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const filteredProjects = selectedCategory === '全部'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.fromTo(
        '.projects-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.projects-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate category filters
      gsap.fromTo(
        '.projects-filters',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          scrollTrigger: {
            trigger: '.projects-filters',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Animate project cards when filtered
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.project-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [selectedCategory]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="projects section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title projects-title">作品展示</h2>
        
        <div className="projects-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`projects-filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="projects-grid" ref={cardsRef}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-card-image">
                <div className="project-card-placeholder">
                  <span>{project.title[0]}</span>
                </div>
                <div className="project-card-overlay">
                  <span className="project-card-view">查看详情</span>
                </div>
              </div>
              <div className="project-card-content">
                <span className="tag">{project.category}</span>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-description">{project.description}</p>
                <div className="project-card-tech">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="project-card-tech-item">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="project-card-tech-more">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="project-modal" onClick={() => setSelectedProject(null)}>
          <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="project-modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            
            <div className="project-modal-header">
              <div className="project-modal-image">
                <div className="project-modal-placeholder">
                  <span>{selectedProject.title[0]}</span>
                </div>
              </div>
              <div className="project-modal-info">
                <span className="tag">{selectedProject.category}</span>
                <h2 className="project-modal-title">{selectedProject.title}</h2>
                <div className="project-modal-meta">
                  <span className="project-modal-meta-item">
                    <Calendar size={16} />
                    {selectedProject.duration}
                  </span>
                  <span className="project-modal-meta-item">
                    <User size={16} />
                    {selectedProject.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="project-modal-body">
              <div className="project-modal-section">
                <h3 className="project-modal-section-title">项目简介</h3>
                <p className="project-modal-description">
                  {selectedProject.fullDescription}
                </p>
              </div>

              <div className="project-modal-section">
                <h3 className="project-modal-section-title">技术栈</h3>
                <div className="project-modal-tech">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech} className="project-modal-tech-item">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="project-modal-section">
                <h3 className="project-modal-section-title">主要成果</h3>
                <ul className="project-modal-achievements">
                  {selectedProject.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>

              {(selectedProject.githubUrl || selectedProject.demoUrl) && (
                <div className="project-modal-links">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      <Github size={18} />
                      查看代码
                    </a>
                  )}
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <ExternalLink size={18} />
                      访问演示
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
