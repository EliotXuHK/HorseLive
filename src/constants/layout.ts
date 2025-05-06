import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  
  // 间距和边距
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // 圆角
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xl: 20,
    pill: 100, // 用于胶囊按钮
  },
  
  // 阴影样式 (iOS)
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
  },
  
  // 高程 (Android)
  elevation: {
    small: 2,
    medium: 5,
    large: 10,
  },
  
  // 动画持续时间和缓动函数
  animation: {
    duration: {
      fastest: 150,
      fast: 250,
      normal: 350,
      slow: 500,
      slowest: 750,
    },
    easing: {
      // 这些会在实际动画中使用，例如：Animated.timing(value, {
      //   ...
      //   easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Layout.animation.easing.standard
      // })
      standard: [0.25, 0.1, 0.25, 1], // 标准缓动
      accelerate: [0.4, 0, 1, 1],      // 加速
      decelerate: [0, 0, 0.2, 1],      // 减速
      sharp: [0.4, 0, 0.6, 1],         // 锐利
    },
  },
  
  // 固定尺寸
  sizes: {
    icon: {
      small: 16,
      medium: 24,
      large: 32,
    },
    button: {
      small: 36,
      medium: 44,
      large: 56,
    },
    avatar: {
      small: 32,
      medium: 48,
      large: 64,
    },
    card: {
      minHeight: 100,
    },
  },
  
  // 字体尺寸
  typography: {
    size: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
  },
  
  // 页面内容最大宽度（适用于平板）
  maxContentWidth: 800,
}; 