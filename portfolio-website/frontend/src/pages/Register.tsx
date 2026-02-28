import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './UserAuth.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    setLoading(true);

    try {
      await register(username, password, confirmPassword);
      navigate('/profile');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-page">
      <div className="user-auth-box">
        <div className="user-auth-header">
          <h1>用户注册</h1>
          <p>创建新账号，开启更多功能</p>
        </div>

        <form className="user-auth-form" onSubmit={handleSubmit}>
          {error && <div className="user-auth-error">{error}</div>}

          <div className="user-form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
              minLength={3}
              maxLength={20}
              className="tpe-input-sketchy"
            />
          </div>

          <div className="user-form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6位）"
              required
              minLength={6}
              className="tpe-input-sketchy"
            />
          </div>

          <div className="user-form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              required
              className="tpe-input-sketchy"
            />
          </div>

          <button
            type="submit"
            className="tpe-btn-sketchy tpe-btn-sketchy-primary user-auth-btn"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div className="user-auth-footer">
          <p>已有账号？</p>
          <Link to="/login" className="user-auth-link">
            立即登录 →
          </Link>
        </div>

        <div className="user-auth-back">
          <Link to="/">← 返回网站首页</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
