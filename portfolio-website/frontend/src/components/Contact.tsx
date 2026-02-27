import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, Github, Linkedin, MessageCircle } from 'lucide-react';
import { profile } from '../data/profile';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.contact-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.contact-content > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="contact section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title contact-title">联系方式</h2>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3 className="contact-subtitle">让我们开始合作</h3>
            <p className="contact-description">
              如果您有任何问题或合作意向，欢迎随时与我联系。我会尽快回复您的消息。
            </p>
            
            <div className="contact-details">
              <a href={`mailto:${profile.email}`} className="contact-item">
                <div className="contact-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-text">
                  <span className="contact-label">邮箱</span>
                  <span className="contact-value">{profile.email}</span>
                </div>
              </a>
              
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="contact-item">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-text">
                  <span className="contact-label">电话</span>
                  <span className="contact-value">{profile.phone}</span>
                </div>
              </a>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-text">
                  <span className="contact-label">位置</span>
                  <span className="contact-value">{profile.location}</span>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`https://wa.me/${profile.social.wechat}`}
                className="contact-social-link"
                aria-label="WeChat"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                姓名
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="请输入您的姓名"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                邮箱
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="请输入您的邮箱"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="form-input form-textarea"
                placeholder="请输入您的留言内容..."
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                '发送中...'
              ) : (
                <>
                  <Send size={18} />
                  发送消息
                </>
              )}
            </button>
            
            {submitStatus === 'success' && (
              <div className="form-status form-status-success">
                消息已发送成功！
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="form-status form-status-error">
                发送失败，请稍后重试。
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
