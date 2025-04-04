/**
 * 格式化时间为可读格式
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

/**
 * 简单截断过长的文本并添加省略号
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * 安全地获取对象属性，防止空对象错误
 */
export const safeGet = <T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined => {
  return obj ? obj[key] : undefined;
}; 