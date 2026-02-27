import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, MapPin, Calendar } from 'lucide-react';
import { experiences } from '../data/profile';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

// These constants can be used when migrating to API data
// const typeIcons = {
//   education: GraduationCap,
//   work: Briefcase,
//   project: Award,
// };

// const typeLabels = {
//   education: '教育经历',
//   work: '工作经历',
//   project: '项目经历',
// };

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.fromTo(
        '.experience-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.experience-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate timeline items
      gsap.fromTo(
        '.timeline-item',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const educationExperiences = experiences.filter(e => e.type === 'education');
  const workExperiences = experiences.filter(e => e.type === 'work');

  return (
    <section id="experience" className="experience section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title experience-title">经验背景</h2>
        
        <div className="experience-content">
          {/* Education Section */}
          <div className="experience-section">
            <h3 className="experience-section-title">
              <GraduationCap size={24} />
              教育经历
            </h3>
            <div className="timeline">
              {educationExperiences.map((exp, index) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-marker">
                    <div className="timeline-dot"></div>
                    {index !== educationExperiences.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4 className="timeline-title">{exp.title}</h4>
                      <span className="timeline-date">
                        <Calendar size={14} />
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div className="timeline-subtitle">
                      <span className="timeline-org">{exp.organization}</span>
                      <span className="timeline-location">
                        <MapPin size={14} />
                        {exp.location}
                      </span>
                    </div>
                    <p className="timeline-description">{exp.description}</p>
                    <ul className="timeline-highlights">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="experience-section">
            <h3 className="experience-section-title">
              <Briefcase size={24} />
              工作经历
            </h3>
            <div className="timeline">
              {workExperiences.map((exp, index) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-marker">
                    <div className="timeline-dot"></div>
                    {index !== workExperiences.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4 className="timeline-title">{exp.title}</h4>
                      <span className="timeline-date">
                        <Calendar size={14} />
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div className="timeline-subtitle">
                      <span className="timeline-org">{exp.organization}</span>
                      <span className="timeline-location">
                        <MapPin size={14} />
                        {exp.location}
                      </span>
                    </div>
                    <p className="timeline-description">{exp.description}</p>
                    <ul className="timeline-highlights">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
