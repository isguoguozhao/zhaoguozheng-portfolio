import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Briefcase, X } from 'lucide-react';
import { projectsApi, projectCategoriesApi, imagesApi } from '../../services/api';
import './AdminPages.css';

interface Category {
  id: number;
  name: string;
}

interface Image {
  id: number;
  url: string;
}

interface Project {
  id: number;
  title: string;
  category_id: number;
  description: string;
  full_description: string | null;
  image_url: string | null;
  technologies: string[];
  role: string;
  duration: string;
  achievements: string[];
  sort_order: number;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: 0,
    description: '',
    full_description: '',
    image_url: '',
    technologies: [] as string[],
    role: '',
    duration: '',
    achievements: [] as string[],
    sort_order: 0,
  });
  const [techInput, setTechInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:8000';

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, categoriesRes, imagesRes] = await Promise.all([
        projectsApi.getAll(),
        projectCategoriesApi.getAll(),
        imagesApi.getAll(),
      ]);
      setProjects(projectsRes.data);
      setCategories(categoriesRes.data);
      setImages(imagesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category_id: project.category_id,
        description: project.description,
        full_description: project.full_description || '',
        image_url: project.image_url || '',
        technologies: project.technologies || [],
        role: project.role,
        duration: project.duration,
        achievements: project.achievements || [],
        sort_order: project.sort_order,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category_id: categories[0]?.id || 0,
        description: '',
        full_description: '',
        image_url: '',
        technologies: [],
        role: '',
        duration: '',
        achievements: [],
        sort_order: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setTechInput('');
    setAchievementInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingProject) {
        await projectsApi.update(editingProject.id, formData);
        setMessage('更新成功！');
      } else {
        await projectsApi.create(formData);
        setMessage('创建成功！');
      }
      fetchData();
      handleCloseModal();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个项目吗？')) return;

    try {
      await projectsApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setMessage('删除成功！');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '删除失败');
    }
  };

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData({ ...formData, technologies: formData.technologies.filter((t) => t !== tech) });
  };

  const addAchievement = () => {
    if (achievementInput.trim() && !formData.achievements.includes(achievementInput.trim())) {
      setFormData({ ...formData, achievements: [...formData.achievements, achievementInput.trim()] });
      setAchievementInput('');
    }
  };

  const removeAchievement = (achievement: string) => {
    setFormData({ ...formData, achievements: formData.achievements.filter((a) => a !== achievement) });
  };

  const getCategoryName = (id: number) => {
    return categories.find((c) => c.id === id)?.name || '未知类别';
  };

  if (loading) {
    return <div className="admin-loading">加载中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>作品管理</h2>
        <p>管理您的作品项目</p>
      </div>

      <div className="admin-form-container">
        {message && (
          <div className={`admin-message ${message.includes('成功') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            添加作品
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="admin-list">
            {projects.map((project) => (
              <div key={project.id} className="admin-list-item">
                <div className="admin-list-item-content">
                  <div className="admin-list-item-title">{project.title}</div>
                  <div className="admin-list-item-subtitle">
                    {getCategoryName(project.category_id)} | {project.role} | {project.duration}
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button
                    className="admin-btn-secondary admin-btn-small"
                    onClick={() => handleOpenModal(project)}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="admin-btn-danger admin-btn-small"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <Briefcase size={64} className="admin-empty-icon" />
            <p>暂无作品，请添加</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="admin-modal-header">
              <h3>{editingProject ? '编辑作品' : '添加作品'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>项目名称</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>类别</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>担任角色</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="例如：前端开发工程师"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>项目周期</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="例如：2024.01 - 2024.06"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>项目图片</label>
                <select
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                >
                  <option value="">选择图片</option>
                  {images.map((img) => (
                    <option key={img.id} value={`${API_BASE_URL}${img.url}`}>
                      {img.url.split('/').pop()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>简短描述</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="一句话描述项目"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>详细描述</label>
                <textarea
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="项目详细描述"
                  rows={3}
                />
              </div>

              <div className="admin-form-group">
                <label>技术栈</label>
                <div className="admin-tags-input">
                  {formData.technologies.map((tech) => (
                    <span key={tech} className="admin-tag">
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="输入技术栈，按回车添加"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>主要成果</label>
                <div className="admin-tags-input">
                  {formData.achievements.map((achievement) => (
                    <span key={achievement} className="admin-tag">
                      {achievement}
                      <button type="button" onClick={() => removeAchievement(achievement)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    placeholder="输入成果，按回车添加"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>排序</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn-primary">
                  {editingProject ? '保存' : '创建'}
                </button>
                <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
