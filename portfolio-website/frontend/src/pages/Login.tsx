import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './UserAuth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/profile');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-page">
      <div className="user-auth-box">
        <div className="user-auth-header">
          <h1>用户登录</h1>
          <p>欢迎回来，请登录您的账号</p>
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
              placeholder="请输入密码"
              required
              className="tpe-input-sketchy"
            />
          </div>

          <button
            type="submit"
            className="tpe-btn-sketchy tpe-btn-sketchy-primary user-auth-btn"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="user-auth-footer">
          <p>还没有账号？</p>
          <Link to="/register" className="user-auth-link">
            立即注册 →
          </Link>
        </div>

        <div className="user-auth-back">
          <Link to="/">← 返回网站首页</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
