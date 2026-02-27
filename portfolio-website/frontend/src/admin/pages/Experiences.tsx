import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, X } from 'lucide-react';
import { experiencesApi, imagesApi } from '../../services/api';
import './AdminPages.css';

interface Image {
  id: number;
  url: string;
}

interface Experience {
  id: number;
  type: 'education' | 'work';
  title: string;
  organization: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  highlights: string[];
  image_url: string | null;
  sort_order: number;
}

const Experiences: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    type: 'work' as 'education' | 'work',
    title: '',
    organization: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    highlights: [] as string[],
    image_url: '',
    sort_order: 0,
  });
  const [highlightInput, setHighlightInput] = useState('');
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:8000';

  const fetchData = useCallback(async () => {
    try {
      const [experiencesRes, imagesRes] = await Promise.all([
        experiencesApi.getAll(),
        imagesApi.getAll(),
      ]);
      setExperiences(experiencesRes.data);
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

  const handleOpenModal = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        type: experience.type,
        title: experience.title,
        organization: experience.organization,
        location: experience.location || '',
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        description: experience.description || '',
        highlights: experience.highlights || [],
        image_url: experience.image_url || '',
        sort_order: experience.sort_order,
      });
    } else {
      setEditingExperience(null);
      setFormData({
        type: 'work',
        title: '',
        organization: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
        highlights: [],
        image_url: '',
        sort_order: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExperience(null);
    setHighlightInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingExperience) {
        await experiencesApi.update(editingExperience.id, formData);
        setMessage('更新成功！');
      } else {
        await experiencesApi.create(formData);
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
    if (!confirm('确定要删除这条经历吗？')) return;

    try {
      await experiencesApi.delete(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      setMessage('删除成功！');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '删除失败');
    }
  };

  const addHighlight = () => {
    if (highlightInput.trim() && !formData.highlights.includes(highlightInput.trim())) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const removeHighlight = (highlight: string) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((h) => h !== highlight) });
  };

  const getTypeLabel = (type: string) => {
    return type === 'education' ? '教育经历' : '工作经历';
  };

  if (loading) {
    return <div className="admin-loading">加载中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>经验背景</h2>
        <p>管理您的教育经历和工作经历</p>
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
            添加经历
          </button>
        </div>

        {experiences.length > 0 ? (
          <div className="admin-list">
            {experiences.map((experience) => (
              <div key={experience.id} className="admin-list-item">
                <div className="admin-list-item-content">
                  <div className="admin-list-item-title">
                    {experience.title} ({getTypeLabel(experience.type)})
                  </div>
                  <div className="admin-list-item-subtitle">
                    {experience.organization} | {experience.start_date} - {experience.end_date || '至今'}
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button
                    className="admin-btn-secondary admin-btn-small"
                    onClick={() => handleOpenModal(experience)}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="admin-btn-danger admin-btn-small"
                    onClick={() => handleDelete(experience.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <GraduationCap size={64} className="admin-empty-icon" />
            <p>暂无经历，请添加</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="admin-modal-header">
              <h3>{editingExperience ? '编辑经历' : '添加经历'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'education' | 'work' })}
                    required
                  >
                    <option value="work">工作经历</option>
                    <option value="education">教育经历</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={formData.type === 'education' ? '例如：本科' : '例如：高级前端工程师'}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>{formData.type === 'education' ? '学校' : '公司'}</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder={formData.type === 'education' ? '学校名称' : '公司名称'}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>地点</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="例如：成都市"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>开始时间</label>
                  <input
                    type="text"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    placeholder="例如：2020.09"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>结束时间</label>
                  <input
                    type="text"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    placeholder="例如：2024.06 或留空表示至今"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Logo/图片</label>
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
                <label>描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="经历描述"
                  rows={3}
                />
              </div>

              <div className="admin-form-group">
                <label>亮点/成就</label>
                <div className="admin-tags-input">
                  {formData.highlights.map((highlight) => (
                    <span key={highlight} className="admin-tag">
                      {highlight}
                      <button type="button" onClick={() => removeHighlight(highlight)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    placeholder="输入亮点，按回车添加"
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
                  {editingExperience ? '保存' : '创建'}
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

export default Experiences;
