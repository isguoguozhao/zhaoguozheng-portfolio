import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Image,
  FolderOpen,
  Briefcase,
  GraduationCap,
  Wrench,
  Share2,
  User,
  ChevronRight,
} from 'lucide-react';
import {
  projectsApi,
  projectCategoriesApi,
  experiencesApi,
  skillCategoriesApi,
  socialLinksApi,
  imagesApi,
} from '../../services/api';
import './Dashboard.css';

interface Stats {
  projects: number;
  categories: number;
  experiences: number;
  skillCategories: number;
  socialLinks: number;
  images: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        projectsRes,
        categoriesRes,
        experiencesRes,
        skillsRes,
        socialRes,
        imagesRes,
      ] = await Promise.all([
        projectsApi.getAll(),
        projectCategoriesApi.getAll(),
        experiencesApi.getAll(),
        skillCategoriesApi.getAll(),
        socialLinksApi.getAll(),
        imagesApi.getAll(),
      ]);

      setStats({
        projects: projectsRes.data.length,
        categories: categoriesRes.data.length,
        experiences: experiencesRes.data.length,
        skillCategories: skillsRes.data.length,
        socialLinks: socialRes.data.length,
        images: imagesRes.data.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { key: 'projects', label: '作品项目', icon: Briefcase, color: '#db7c00' },
    { key: 'categories', label: '作品类别', icon: FolderOpen, color: '#4CAF50' },
    { key: 'experiences', label: '经验背景', icon: GraduationCap, color: '#2196F3' },
    { key: 'skillCategories', label: '技能类别', icon: Wrench, color: '#9C27B0' },
    { key: 'socialLinks', label: '社交链接', icon: Share2, color: '#FF5722' },
    { key: 'images', label: '图片资源', icon: Image, color: '#607D8B' },
  ];

  const quickLinks = [
    { path: '/admin/profile', label: '编辑个人资料', icon: User },
    { path: '/admin/projects', label: '管理作品', icon: Briefcase },
    { path: '/admin/images', label: '上传图片', icon: Image },
    { path: '/admin/skills', label: '编辑技能', icon: Wrench },
  ];

  if (loading) {
    return <div className="admin-loading">加载中...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h2>Dashboard</h2>
        <p>欢迎回来！这是您的网站数据概览。</p>
      </div>

      <div className="admin-stats-grid">
        {statItems.map((item) => (
          <div key={item.key} className="admin-stat-card">
            <div
              className="admin-stat-icon"
              style={{ background: item.color }}
            >
              <item.icon />
            </div>
            <div className="admin-stat-value">
              {stats?.[item.key as keyof Stats] || 0}
            </div>
            <div className="admin-stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <h3>快速操作</h3>
        <div className="admin-quick-links">
          {quickLinks.map((link) => (
            <Link key={link.path} to={link.path} className="admin-quick-link">
              <link.icon />
              <span>{link.label}</span>
              <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
