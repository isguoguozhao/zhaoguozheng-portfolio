import React, { useEffect, useState, useCallback } from 'react';
import { Upload, Trash2, ImageIcon } from 'lucide-react';
import { imagesApi } from '../../services/api';
import './AdminPages.css';

interface Image {
  id: number;
  filename: string;
  url: string;
  created_at: string;
}

const Images: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchImages = useCallback(async () => {
    try {
      const response = await imagesApi.getAll();
      setImages(response.data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      await imagesApi.upload(file);
      setMessage('上传成功！');
      fetchImages();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setMessage(error.response?.data?.detail || '上传失败');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这张图片吗？')) return;

    try {
      await imagesApi.delete(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setMessage('删除成功！');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('删除失败');
    }
  };

  const API_BASE_URL = 'http://localhost:8000';

  if (loading) {
    return <div className="admin-loading">加载中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>图片管理</h2>
        <p>上传和管理网站使用的图片</p>
      </div>

      <div className="admin-form-container">
        {message && (
          <div className={`admin-message ${message.includes('成功') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="admin-image-upload">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="image-upload"
            disabled={uploading}
          />
          <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
            <Upload size={48} style={{ marginBottom: '12px', color: '#db7c00' }} />
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>
              {uploading ? '上传中...' : '点击或拖拽上传图片'}
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
              支持 JPG、PNG、WebP 格式，最大 10MB
            </p>
          </label>
        </div>

        {images.length > 0 ? (
          <div className="admin-image-preview" style={{ marginTop: '32px' }}>
            {images.map((image) => (
              <div key={image.id} className="admin-image-preview-item">
                <img
                  src={`${API_BASE_URL}${image.url}`}
                  alt={image.filename}
                />
                <button
                  className="admin-image-preview-delete"
                  onClick={() => handleDelete(image.id)}
                  title="删除"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty" style={{ marginTop: '32px' }}>
            <ImageIcon size={64} className="admin-empty-icon" />
            <p>暂无图片，请上传</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Images;
