import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userApi, type UserInfo } from '../services/userApi';

interface UserContextType {
  token: string | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
  updateUserInfo: (data: Partial<UserInfo>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  checkIn: () => Promise<{ success: boolean; points: number; message: string }>;
  bindEmail: (email: string, code: string) => Promise<void>;
  sendEmailCode: (email: string) => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('user_token'));
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!token && !!userInfo;

  // 初始化时获取用户信息
  useEffect(() => {
    if (token) {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await userApi.login(username, password);
      const { access_token, user } = response.data;
      localStorage.setItem('user_token', access_token);
      setToken(access_token);
      setUserInfo(user);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, password: string, confirmPassword: string) => {
    setLoading(true);
    try {
      const response = await userApi.register(username, password, confirmPassword);
      const { access_token, user } = response.data;
      localStorage.setItem('user_token', access_token);
      setToken(access_token);
      setUserInfo(user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user_token');
    setToken(null);
    setUserInfo(null);
  }, []);

  const fetchUserInfo = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await userApi.getUserInfo();
      setUserInfo(response.data);
    } catch {
      // 如果获取失败，可能是token过期
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const updateUserInfo = useCallback(async (data: Partial<UserInfo>) => {
    setLoading(true);
    try {
      const response = await userApi.updateUserInfo(data);
      setUserInfo(response.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const response = await userApi.uploadAvatar(file);
      setUserInfo(prev => prev ? { ...prev, avatar: response.data.avatar_url } : null);
      return response.data.avatar_url;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkIn = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.checkIn();
      // 更新用户积分
      if (response.data.success && userInfo) {
        setUserInfo({
          ...userInfo,
          points: (userInfo.points || 0) + response.data.points,
          last_check_in: new Date().toISOString()
        });
      }
      return response.data;
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  const bindEmail = useCallback(async (email: string, code: string) => {
    setLoading(true);
    try {
      await userApi.bindEmail(email, code);
      setUserInfo(prev => prev ? { ...prev, email } : null);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendEmailCode = useCallback(async (email: string) => {
    await userApi.sendEmailCode(email);
  }, []);

  return (
    <UserContext.Provider
      value={{
        token,
        userInfo,
        isLoggedIn,
        login,
        register,
        logout,
        fetchUserInfo,
        updateUserInfo,
        uploadAvatar,
        checkIn,
        bindEmail,
        sendEmailCode,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
