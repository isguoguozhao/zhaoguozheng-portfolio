import React, { useEffect, useState } from 'react';
import { profileApi } from '../../services/api';
import './AdminPages.css';

interface Profile {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileApi.get();
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage('');

    try {
      await profileApi.update(profile);
      setMessage('保存成功！');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  if (loading) {
    return <div className="admin-loading">加载中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>个人资料</h2>
        <p>管理您的个人基本信息</p>
      </div>

      <div className="admin-form-container">
        {message && (
          <div className={`admin-message ${message.includes('成功') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>姓名</label>
              <input
                type="text"
                value={profile?.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="您的姓名"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>职位标题</label>
              <input
                type="text"
                value={profile?.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="例如：信息管理与信息系统"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>副标题</label>
            <input
              type="text"
              value={profile?.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="例如：全栈开发工程师 / 数据分析师"
            />
          </div>

          <div className="admin-form-group">
            <label>个人简介</label>
            <textarea
              value={profile?.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="请输入个人简介"
              rows={5}
              required
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>邮箱</label>
              <input
                type="email"
                value={profile?.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>电话</label>
              <input
                type="text"
                value={profile?.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+86 xxx-xxxx-xxxx"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>所在地</label>
            <input
              type="text"
              value={profile?.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="例如：成都市"
            />
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? '保存中...' : '保存更改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
