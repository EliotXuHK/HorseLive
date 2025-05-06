import { api } from '../api';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * 用户登录
 */
export const login = async (params: LoginParams): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', params);
  
  // 保存认证令牌
  if (response.token) {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
  }
  
  return response;
};

/**
 * 用户注册
 */
export const register = async (params: RegisterParams): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', params);
  
  // 保存认证令牌
  if (response.token) {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
  }
  
  return response;
};

/**
 * 用户登出
 */
export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<User> => {
  return api.get<User>('/auth/me');
};

/**
 * 检查用户是否已认证
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  return !!token;
};

/**
 * 获取存储的认证令牌
 */
export const getAuthToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}; 