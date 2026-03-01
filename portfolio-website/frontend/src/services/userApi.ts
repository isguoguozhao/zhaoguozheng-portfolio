import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

// 创建用户API实例
const userApiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器添加token
userApiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器处理错误
userApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user_token');
    }
    return Promise.reject(error);
  }
);

// 用户类型定义
export interface UserInfo {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  points: number;
  created_at: string;
  last_check_in?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

export interface RegisterResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

export interface CheckInResponse {
  success: boolean;
  points: number;
  message: string;
  total_points: number;
}

export interface VisitStatsResponse {
  total_visits: number;
  today_visits: number;
}

// 用户API
export const userApi = {
  // 用户登录
  login: (username: string, password: string) =>
    userApiInstance.post<LoginResponse>('/api/users/login', {
      username,
      password
    }),
    }),

  // 用户注册
  register: (username: string, password: string, confirmPassword: string) =>
    userApiInstance.post<RegisterResponse>('/api/users/register', {
      username,
      password,
      confirm_password: confirmPassword,
    }),

  // 获取用户信息
  getUserInfo: () =>
    userApiInstance.get<UserInfo>('/api/users/me'),

  // 更新用户信息
  updateUserInfo: (data: Partial<UserInfo>) =>
    userApiInstance.put<UserInfo>('/api/users/me', data),

  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return userApiInstance.post<{ avatar_url: string }>('/api/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 发送邮箱验证码
  sendEmailCode: (email: string) =>
    userApiInstance.post('/api/users/email/code', { email }),

  // 绑定邮箱
  bindEmail: (email: string, code: string) =>
    userApiInstance.post('/api/users/email/bind', { email, code }),

  // 每日签到
  checkIn: () =>
    userApiInstance.post<CheckInResponse>('/api/users/checkin'),

  // 查询积分
  getPoints: () =>
    userApiInstance.get<{ points: number }>('/api/users/points'),
};

// 访问统计API（无需登录）
export const statsApi = {
  // 记录访问
  recordVisit: () =>
    axios.post(`${API_BASE_URL}/api/stats/visit`),

  // 获取访问统计
  getStats: () =>
    axios.get<VisitStatsResponse>(`${API_BASE_URL}/api/stats`),
};

export default userApiInstance;
