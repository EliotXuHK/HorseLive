/**
 * 通用API响应类型
 */
export interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

/**
 * 用户类型
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

/**
 * 认证状态
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 直播类型
 */
export interface LiveStream {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  streamUrl: string;
  isLive: boolean;
  viewerCount: number;
  hostId: string;
  hostName: string;
  startTime: string;
  tags: string[];
}

/**
 * 消息类型
 */
export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  attachments?: MessageAttachment[];
}

/**
 * 消息附件类型
 */
export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  thumbnailUrl?: string;
  name?: string;
  size?: number;
} 