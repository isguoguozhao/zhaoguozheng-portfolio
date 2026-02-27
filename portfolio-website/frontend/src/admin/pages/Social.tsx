import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Share2 } from 'lucide-react';
import { socialLinksApi } from '../../services/api';
import './AdminPages.css';

const ICON_OPTIONS = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'mail', label: '邮箱' },
  { value: 'phone', label: '电话' },
  { value: 'globe', label: '网站' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'message-circle', label: '微信' },
];

interface SocialLink {
  id: number;
  platform: string;
  icon_type: string;
  url: string;
  label: string | null;
  sort_order: number;
}

const Social: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    icon_type: 'github',
    url: '',
    label: '',
    sort_order: 0,
  });
  const [message, setMessage] = useState('');

  const fetchLinks = useCallback(async () => {
    try {
      const response = await socialLinksApi.getAll();
      setLinks(response.data);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleOpenModal = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        platform: link.platform,
        icon_type: link.icon_type,
        url: link.url,
        label: link.label || '',
        sort_order: link.sort_order,
      });
    } else {
      setEditingLink(null);
      setFormData({ platform: '', icon_type: 'github', url: '', label: '', sort_order: 0 });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLink(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingLink) {
        await socialLinksApi.update(editingLink.id, formData);
        setMessage('更新成功！');
      } else {
        await socialLinksApi.create(formData);
        setMessage('创建成功！');
      }
      fetchLinks();
      handleCloseModal();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个社交链接吗？')) return;

    try {
      await socialLinksApi.delete(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setMessage('删除成功！');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '删除失败');
    }
  };

  const getIconLabel = (iconType: string) => {
    return ICON_OPTIONS.find((opt) => opt.value === iconType)?.label || iconType;
  };

  if (loading) {
    return <div className="admin-loading">加载中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>社交链接</h2>
        <p>管理您的社交媒体和联系方式</p>
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
            添加链接
          </button>
        </div>

        {links.length > 0 ? (
          <div className="admin-list">
            {links.map((link) => (
              <div key={link.id} className="admin-list-item">
                <div className="admin-list-item-content">
                  <div className="admin-list-item-title">
                    {link.platform} ({getIconLabel(link.icon_type)})
                  </div>
                  <div className="admin-list-item-subtitle">
                    {link.url} {link.label && `| ${link.label}`}
                  </div>
                </div>
                <div className="admin-list-item-actions">
                  <button
                    className="admin-btn-secondary admin-btn-small"
                    onClick={() => handleOpenModal(link)}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="admin-btn-danger admin-btn-small"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <Share2 size={64} className="admin-empty-icon" />
            <p>暂无社交链接，请添加</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingLink ? '编辑链接' : '添加链接'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>平台名称</label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    placeholder="例如：GitHub"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>图标</label>
                  <select
                    value={formData.icon_type}
                    onChange={(e) => setFormData({ ...formData, icon_type: e.target.value })}
                    required
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>链接地址</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>显示标签（可选）</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="例如：关注我的GitHub"
                  />
                </div>
                <div className="admin-form-group">
                  <label>排序</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn-primary">
                  {editingLink ? '保存' : '创建'}
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

export default Social;
