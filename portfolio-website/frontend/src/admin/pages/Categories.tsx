import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { projectCategoriesApi } from '../../services/api';
import './AdminPages.css';

interface Category {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', sort_order: 0 });
  const [message, setMessage] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await projectCategoriesApi.getAll();
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

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        sort_order: category.sort_order,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', sort_order: 0 });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', sort_order: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingCategory) {
        await projectCategoriesApi.update(editingCategory.id, formData);
        setMessage('更新成功！');
      } else {
        await projectCategoriesApi.create(formData);
        setMessage('创建成功！');
      }
      fetchCategories();
      handleCloseModal();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个类别吗？')) return;

    try {
      await projectCategoriesApi.delete(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
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
        <h2>作品类别</h2>
        <p>管理作品展示的类别</p>
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
            添加类别
          </button>
        </div>

        {categories.length > 0 ? (
          <div className="admin-list">
            {categories.map((category) => (
              <div key={category.id} className="admin-list-item">
                <div className="admin-list-item-content">
                  <div className="admin-list-item-title">{category.name}</div>
                  <div className="admin-list-item-subtitle">
                    {category.description || '无描述'} | 排序: {category.sort_order}
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button
                    className="admin-btn-secondary admin-btn-small"
                    onClick={() => handleOpenModal(category)}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="admin-btn-danger admin-btn-small"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <FolderOpen size={64} className="admin-empty-icon" />
            <p>暂无类别，请添加</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingCategory ? '编辑类别' : '添加类别'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label>类别名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：Web开发"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>描述</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="类别描述（可选）"
                />
              </div>
              <div className="admin-form-group">
                <label>排序</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  placeholder="数字越小越靠前"
                />
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn-primary">
                  {editingCategory ? '保存' : '创建'}
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

export default Categories;
