import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Database, Palette, Terminal, Award, BookOpen } from 'lucide-react';
import { profile, skills } from '../data/profile';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  { name: '编程语言', icon: Code2 },
  { name: '前端框架', icon: Palette },
  { name: '后端框架', icon: Terminal },
  { name: '数据库', icon: Database },
  { name: '移动开发', icon: Code2 },
  { name: '数据科学', icon: BookOpen },
  { name: '人工智能', icon: Award },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.fromTo(
        '.about-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.about-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate about content
      gsap.fromTo(
        '.about-content',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.about-content',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate skill items
      gsap.fromTo(
        '.skill-item',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const groupedSkills = skillCategories.map(category => ({
    ...category,
    skills: skills.filter(s => s.category === category.name),
  })).filter(g => g.skills.length > 0);

  return (
    <section id="about" className="about section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title about-title">关于我</h2>
        
        <div className="about-content">
          <div className="about-profile">
            <div className="about-avatar">
              <div className="about-avatar-placeholder">
                <span>{profile.name[0]}</span>
              </div>
            </div>
            <div className="about-info">
              <h3 className="about-name">{profile.name}</h3>
              <p className="about-role">{profile.subtitle}</p>
              <p className="about-bio">{profile.bio}</p>
              
              <div className="about-stats">
                <div className="about-stat">
                  <span className="about-stat-number">6+</span>
                  <span className="about-stat-label">项目经验</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-number">10+</span>
                  <span className="about-stat-label">技术栈</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-number">5+</span>
                  <span className="about-stat-label">获奖经历</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-skills">
            <h3 className="about-skills-title">技能专长</h3>
            <div className="skills-grid">
              {groupedSkills.map((group) => (
                <div key={group.name} className="skill-category">
                  <div className="skill-category-header">
                    <group.icon size={20} />
                    <span>{group.name}</span>
                  </div>
                  <div className="skill-list">
                    {group.skills.map((skill) => (
                      <div key={skill.name} className="skill-item">
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-level">{skill.level}%</span>
                        </div>
                        <div className="skill-bar">
                          <div
                            className="skill-bar-fill"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
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
