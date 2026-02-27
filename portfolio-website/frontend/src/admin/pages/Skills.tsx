import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Wrench, X } from 'lucide-react';
import { skillCategoriesApi, skillsApi } from '../../services/api';
import './AdminPages.css';

interface Skill {
  id: number;
  category_id: number;
  name: string;
  level: number;
  sort_order: number;
}

interface SkillCategory {
  id: number;
  name: string;
  sort_order: number;
  skills: Skill[];
}

const Skills: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', sort_order: 0 });
  const [skillForm, setSkillForm] = useState({ name: '', level: 80, sort_order: 0 });
  const [message, setMessage] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await skillCategoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCategoryModal = (category?: SkillCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ name: category.name, sort_order: category.sort_order });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', sort_order: 0 });
    }
    setShowCategoryModal(true);
  };

  const handleOpenSkillModal = (categoryId: number, skill?: Skill) => {
    setSelectedCategoryId(categoryId);
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({ name: skill.name, level: skill.level, sort_order: skill.sort_order });
    } else {
      setEditingSkill(null);
      setSkillForm({ name: '', level: 80, sort_order: 0 });
    }
    setShowSkillModal(true);
  };

  const handleCloseModals = () => {
    setShowCategoryModal(false);
    setShowSkillModal(false);
    setEditingCategory(null);
    setEditingSkill(null);
    setSelectedCategoryId(null);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await skillCategoriesApi.create(categoryForm);
      setMessage('类别创建成功！');
      fetchCategories();
      handleCloseModals();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '操作失败');
    }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;

    try {
      if (editingSkill) {
        await skillsApi.update(editingSkill.id, {
          ...skillForm,
          category_id: selectedCategoryId,
        });
        setMessage('技能更新成功！');
      } else {
        await skillsApi.create({
          ...skillForm,
          category_id: selectedCategoryId,
        });
        setMessage('技能创建成功！');
      }
      fetchCategories();
      handleCloseModals();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '操作失败');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('确定要删除这个技能类别吗？该类别下的所有技能也会被删除。')) return;

    try {
      await skillCategoriesApi.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setMessage('删除成功！');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '删除失败');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('确定要删除这个技能吗？')) return;

    try {
      await skillsApi.delete(id);
      fetchCategories();
      setMessage('删除成功！');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '删除失败');
    }
  };

  if (loading) {
    return <div className="admin-loading">加载中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>技能专长</h2>
        <p>管理您的技能类别和技能</p>
      </div>

      <div className="admin-form-container">
        {message && (
          <div className={`admin-message ${message.includes('成功') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <button className="admin-btn-primary" onClick={() => handleOpenCategoryModal()}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            添加技能类别
          </button>
        </div>

        {categories.length > 0 ? (
          <div className="admin-list">
            {categories.map((category) => (
              <div key={category.id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div className="admin-list-item-title">{category.name}</div>
                  <div className="admin-list-item-actions">
                    <button
                      className="admin-btn-secondary admin-btn-small"
                      onClick={() => handleOpenSkillModal(category.id)}
                    >
                      <Plus size={14} />
                      添加技能
                    </button>
                    <button
                      className="admin-btn-danger admin-btn-small"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {category.skills && category.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingLeft: '16px' }}>
                    {category.skills.map((skill) => (
                      <span key={skill.id} className="admin-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {skill.name} ({skill.level}%)
                        <button
                          type="button"
                          onClick={() => handleOpenSkillModal(category.id, skill)}
                          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
                        >
                          <Edit2 size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(skill.id)}
                          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <Wrench size={64} className="admin-empty-icon" />
            <p>暂无技能类别，请添加</p>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModals}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>添加技能类别</h3>
            </div>
            <form onSubmit={handleCategorySubmit} className="admin-form">
              <div className="admin-form-group">
                <label>类别名称</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="例如：前端开发"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>排序</label>
                <input
                  type="number"
                  value={categoryForm.sort_order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn-primary">创建</button>
                <button type="button" className="admin-btn-secondary" onClick={handleCloseModals}>取消</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModals}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingSkill ? '编辑技能' : '添加技能'}</h3>
            </div>
            <form onSubmit={handleSkillSubmit} className="admin-form">
              <div className="admin-form-group">
                <label>技能名称</label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="例如：React"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>熟练度 ({skillForm.level}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                />
              </div>
              <div className="admin-form-group">
                <label>排序</label>
                <input
                  type="number"
                  value={skillForm.sort_order}
                  onChange={(e) => setSkillForm({ ...skillForm, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn-primary">{editingSkill ? '保存' : '创建'}</button>
                <button type="button" className="admin-btn-secondary" onClick={handleCloseModals}>取消</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
