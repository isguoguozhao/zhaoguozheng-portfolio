import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Mail, Coins, Calendar, CheckCircle, LogOut, Settings, User, Edit2, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, isLoggedIn, logout, uploadAvatar, updateUserInfo, checkIn, bindEmail, sendEmailCode, loading } = useUser();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [checkInMessage, setCheckInMessage] = useState('');
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 检查今日是否已签到
  useEffect(() => {
    if (userInfo?.last_check_in) {
      const lastCheckIn = new Date(userInfo.last_check_in);
      const today = new Date();
      setHasCheckedInToday(
        lastCheckIn.getDate() === today.getDate() &&
        lastCheckIn.getMonth() === today.getMonth() &&
        lastCheckIn.getFullYear() === today.getFullYear()
      );
    }
  }, [userInfo]);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 未登录重定向
  useEffect(() => {
    if (!isLoggedIn && !loading) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar(file);
      } catch (err) {
        console.error('上传头像失败:', err);
      }
    }
  };

  const handleUpdateUsername = async () => {
    if (newUsername.trim() && newUsername !== userInfo?.username) {
      try {
        await updateUserInfo({ username: newUsername.trim() });
        setIsEditingName(false);
      } catch (err) {
        console.error('更新用户名失败:', err);
      }
    } else {
      setIsEditingName(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (!email.trim()) return;
    try {
      await sendEmailCode(email.trim());
      setCountdown(60);
    } catch (err) {
      console.error('发送验证码失败:', err);
    }
  };

  const handleBindEmail = async () => {
    if (!email.trim() || !emailCode.trim()) return;
    try {
      await bindEmail(email.trim(), emailCode.trim());
      setShowEmailForm(false);
      setEmail('');
      setEmailCode('');
    } catch (err) {
      console.error('绑定邮箱失败:', err);
    }
  };

  const handleCheckIn = async () => {
    try {
      const result = await checkIn();
      if (result.success) {
        setCheckInMessage(`签到成功！获得 ${result.points} 积分`);
        setHasCheckedInToday(true);
        setTimeout(() => setCheckInMessage(''), 3000);
      }
    } catch (err) {
      console.error('签到失败:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isLoggedIn || !userInfo) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* 头部 */}
        <div className="profile-header">
          <h1>个人中心</h1>
          <Link to="/" className="profile-back-link">
            ← 返回首页
          </Link>
        </div>

        {/* 用户信息卡片 */}
        <div className="profile-card tpe-card-sketchy">
          {/* 头像 */}
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper" onClick={handleAvatarClick}>
              {userInfo.avatar ? (
                <img src={userInfo.avatar} alt={userInfo.username} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-default">
                  <User size={48} />
                </div>
              )}
              <div className="profile-avatar-overlay">
                <Camera size={24} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          {/* 用户名 */}
          <div className="profile-username-section">
            {isEditingName ? (
              <div className="profile-username-edit">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="输入新用户名"
                  className="tpe-input-sketchy"
                  autoFocus
                />
                <button onClick={handleUpdateUsername} className="tpe-btn-sketchy tpe-btn-sketchy-primary">
                  保存
                </button>
                <button onClick={() => setIsEditingName(false)} className="tpe-btn-sketchy">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="profile-username-display">
                <h2>{userInfo.username}</h2>
                <button 
                  onClick={() => {
                    setNewUsername(userInfo.username);
                    setIsEditingName(true);
                  }}
                  className="profile-edit-btn"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* 统计信息 */}
          <div className="profile-stats">
            <div className="profile-stat-item">
              <Coins size={20} className="profile-stat-icon" />
              <span className="profile-stat-value">{userInfo.points || 0}</span>
              <span className="profile-stat-label">积分</span>
            </div>
            <div className="profile-stat-item">
              <Calendar size={20} className="profile-stat-icon" />
              <span className="profile-stat-value">
                {new Date(userInfo.created_at).toLocaleDateString('zh-CN')}
              </span>
              <span className="profile-stat-label">加入时间</span>
            </div>
          </div>
        </div>

        {/* 邮箱绑定 */}
        <div className="profile-section tpe-card-sketchy">
          <div className="profile-section-header">
            <Mail size={20} />
            <h3>邮箱绑定</h3>
          </div>
          <div className="profile-section-content">
            {userInfo.email ? (
              <div className="profile-email-bound">
                <CheckCircle size={18} className="profile-email-icon" />
                <span>{userInfo.email}</span>
              </div>
            ) : (
              <div className="profile-email-unbound">
                <span>未绑定</span>
                {!showEmailForm ? (
                  <button 
                    onClick={() => setShowEmailForm(true)}
                    className="tpe-btn-sketchy tpe-btn-sketchy-secondary"
                  >
                    绑定邮箱
                  </button>
                ) : (
                  <div className="profile-email-form">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="输入邮箱地址"
                      className="tpe-input-sketchy"
                    />
                    <div className="profile-email-code">
                      <input
                        type="text"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        placeholder="验证码"
                        className="tpe-input-sketchy"
                      />
                      <button
                        onClick={handleSendEmailCode}
                        disabled={countdown > 0}
                        className="tpe-btn-sketchy"
                      >
                        {countdown > 0 ? `${countdown}s` : '获取验证码'}
                      </button>
                    </div>
                    <div className="profile-email-actions">
                      <button onClick={handleBindEmail} className="tpe-btn-sketchy tpe-btn-sketchy-primary">
                        确认绑定
                      </button>
                      <button onClick={() => setShowEmailForm(false)} className="tpe-btn-sketchy">
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 每日签到 */}
        <div className="profile-section tpe-card-sketchy">
          <div className="profile-section-header">
            <CheckCircle size={20} />
            <h3>每日签到</h3>
          </div>
          <div className="profile-section-content">
            <div className="profile-checkin">
              <p className="profile-checkin-desc">
                每日签到可获得 1-10 随机积分
              </p>
              <button
                onClick={handleCheckIn}
                disabled={hasCheckedInToday || loading}
                className={`tpe-btn-sketchy ${hasCheckedInToday ? '' : 'tpe-btn-sketchy-primary'}`}
              >
                {hasCheckedInToday ? '今日已签到' : '立即签到'}
              </button>
              {checkInMessage && (
                <p className="profile-checkin-message">{checkInMessage}</p>
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="profile-actions">
          <button onClick={handleLogout} className="profile-logout-btn">
            <LogOut size={18} />
            退出登录
          </button>
        </div>

        {/* 管理系统入口 */}
        <div className="profile-admin-entry">
          <Link to="/admin/login" className="profile-admin-btn">
            <Settings size={18} />
            管理系统
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
