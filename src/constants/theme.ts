import { Colors } from './colors';
import { Layout } from './layout';

/**
 * 应用主题集合 - 整合样式和动画
 */
export const Theme = {
  // 基础样式
  styles: {
    // 卡片样式
    card: {
      backgroundColor: Colors.backgroundLight,
      borderRadius: Layout.borderRadius.medium,
      padding: Layout.spacing.md,
      ...Layout.shadows.medium,
      elevation: Layout.elevation.medium,
    },
    // 按钮样式
    button: {
      primary: {
        backgroundColor: Colors.primary,
        paddingVertical: Layout.spacing.sm,
        paddingHorizontal: Layout.spacing.md,
        borderRadius: Layout.borderRadius.medium,
        minHeight: Layout.sizes.button.medium,
      },
      secondary: {
        backgroundColor: 'transparent',
        paddingVertical: Layout.spacing.sm,
        paddingHorizontal: Layout.spacing.md,
        borderRadius: Layout.borderRadius.medium,
        borderWidth: 1,
        borderColor: Colors.primary,
        minHeight: Layout.sizes.button.medium,
      },
      text: {
        primary: {
          color: Colors.text,
          fontSize: Layout.typography.size.md,
          fontWeight: 'bold',
        },
        secondary: {
          color: Colors.primary,
          fontSize: Layout.typography.size.md,
          fontWeight: 'bold',
        }
      }
    },
    // 输入框样式
    input: {
      backgroundColor: Colors.backgroundAccent,
      borderRadius: Layout.borderRadius.medium,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Layout.spacing.md,
      paddingVertical: Layout.spacing.sm,
      color: Colors.text,
      height: Layout.sizes.button.medium,
    },
    // 文本样式
    text: {
      h1: {
        fontSize: Layout.typography.size.xxxl,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Layout.spacing.md,
      },
      h2: {
        fontSize: Layout.typography.size.xxl,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Layout.spacing.sm,
      },
      h3: {
        fontSize: Layout.typography.size.xl,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Layout.spacing.sm,
      },
      body: {
        fontSize: Layout.typography.size.md,
        color: Colors.text,
        lineHeight: Layout.typography.lineHeight.normal,
      },
      caption: {
        fontSize: Layout.typography.size.sm,
        color: Colors.textLight,
        lineHeight: Layout.typography.lineHeight.normal,
      },
      highlight: {
        fontSize: Layout.typography.size.md,
        color: Colors.highlight,
        fontWeight: 'bold',
      }
    },
  },
  
  // 动画预设
  animations: {
    // 在值变化时使用淡入淡出效果
    fadeTransition: {
      duration: Layout.animation.duration.normal,
      easing: Layout.animation.easing.standard,
    },
    // 按压效果
    pressAnimation: {
      duration: Layout.animation.duration.fastest,
      easing: Layout.animation.easing.accelerate,
      transformScale: 0.95,
    },
    // 列表项移动动画
    listItemTransition: {
      duration: Layout.animation.duration.normal,
      easing: Layout.animation.easing.standard,
    },
    // 页面转场动画
    screenTransition: {
      duration: Layout.animation.duration.normal,
      easing: Layout.animation.easing.standard,
    },
    // 赔率变动动画
    oddsChange: {
      duration: Layout.animation.duration.fast,
      easing: Layout.animation.easing.sharp,
      color: {
        increase: Colors.increase,
        decrease: Colors.decrease,
        normal: Colors.primary,
      }
    },
    // 比赛倒计时动画
    countdown: {
      normalDuration: Layout.animation.duration.normal,
      urgentDuration: Layout.animation.duration.fast, // 当倒计时接近结束时
      pulseScale: 1.2, // 脉冲动画的最大缩放比例
    },
    // "摇一摇"加油特效
    shakeCheer: {
      duration: Layout.animation.duration.normal,
      intensity: 5, // 震动强度
      particleCount: 100, // 粒子效果的粒子数量
      particleColors: [Colors.primary, Colors.secondary, Colors.success], // 粒子颜色
    }
  },
  
  // 布局预设
  layout: {
    // 屏幕内容容器
    screenContainer: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingHorizontal: Layout.spacing.md,
    },
    // 安全区域容器
    safeArea: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    // 居中内容
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // 行布局
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    // 列表项
    listItem: {
      paddingVertical: Layout.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
  },
  
  // 特殊效果
  effects: {
    // 渐变背景
    gradients: {
      primary: ['#4A00E0', '#8A2BE2'], // 紫色渐变
      secondary: ['#00C853', '#64DD17'], // 绿色渐变
      dark: ['#121212', '#2D2D2D'], // 深色渐变
    },
    // 毛玻璃效果
    blur: {
      tint: 'dark',
      intensity: 50,
    },
  },
}; 