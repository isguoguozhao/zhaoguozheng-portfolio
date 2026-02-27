import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  FolderOpen,
  Briefcase,
  GraduationCap,
  Wrench,
  Share2,
  User,
  LogOut,
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/profile', icon: User, label: '个人资料' },
    { path: '/admin/images', icon: Image, label: '图片管理' },
    { path: '/admin/projects', icon: Briefcase, label: '作品管理' },
    { path: '/admin/categories', icon: FolderOpen, label: '作品类别' },
    { path: '/admin/experiences', icon: GraduationCap, label: '经验背景' },
    { path: '/admin/skills', icon: Wrench, label: '技能专长' },
    { path: '/admin/social', icon: Share2, label: '社交链接' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1>Portfolio Admin</h1>
          <p>管理后台</p>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="admin-nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
