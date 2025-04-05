import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing,
  GestureResponderEvent,
  View,
  Text,
  Pressable 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout, Theme } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';

interface FloatingButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  icon: string;
  color?: string;
  gradientColors?: [string, string, ...string[]]; // Specify as tuple with at least 2 colors
  size?: number;
  bottom?: number;
  right?: number;
  left?: number;
  label?: string;
  badgeCount?: number;
  showPulseAnimation?: boolean;
}

const BUTTON_SIZE = Layout.sizes.button.large;

const FloatingButton = ({ 
  onPress, 
  icon,
  color = Colors.primary,
  gradientColors,
  size = 24,
  bottom = 80, // 默认在底部导航栏上方
  right = 20,
  left,
  label,
  badgeCount,
  showPulseAnimation = false
}: FloatingButtonProps) => {
  // 创建多个动画值
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const labelOpacity = React.useRef(new Animated.Value(0)).current;
  
  // 创建缓动函数
  const createEasing = (points: number[]) => {
    return Easing.bezier(points[0], points[1], points[2], points[3]);
  };
  
  // 点击按钮动画效果
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: Theme.animations.pressAnimation.transformScale,
      duration: Theme.animations.pressAnimation.duration,
      easing: createEasing(Theme.animations.pressAnimation.easing),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: Theme.animations.pressAnimation.duration,
      easing: createEasing(Theme.animations.pressAnimation.easing),
      useNativeDriver: true,
    }).start();
  };
  
  // 添加脉动动画（可用于提醒用户注意）
  useEffect(() => {
    if (showPulseAnimation) {
      const pulseSequence = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        })
      ]);
      
      Animated.loop(pulseSequence).start();
    } else {
      // 重置动画
      pulseAnim.setValue(1);
    }
  }, [showPulseAnimation, pulseAnim]);
  
  // 处理标签显示与隐藏动画
  const showLabel = () => {
    Animated.timing(labelOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  const hideLabel = () => {
    Animated.timing(labelOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // 默认渐变色，如果未提供
  const defaultGradient: [string, string] = [Colors.purple.main, Colors.purple.dark];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom,
          ...(left !== undefined ? { left } : { right }),
          transform: [
            { scale: Animated.multiply(scaleAnim, pulseAnim) }
          ],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={showLabel}
        onHoverOut={hideLabel}
        android_ripple={{ color: 'rgba(255,255,255,0.2)', radius: BUTTON_SIZE / 2 }}
        style={({ pressed }) => [
          styles.buttonContainer,
          {
            opacity: pressed ? 0.9 : 1,
          }
        ]}
      >
        {gradientColors ? (
          <LinearGradient
            colors={gradientColors}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={icon as any} size={size} color="#fff" />
          </LinearGradient>
        ) : (
          <View style={[styles.button, { backgroundColor: color }]}>
            <Ionicons name={icon as any} size={size} color="#fff" />
          </View>
        )}
        
        {/* 显示标签 */}
        {label && (
          <Animated.View 
            style={[
              styles.labelContainer,
              { opacity: labelOpacity }
            ]}
          >
            <Text style={styles.labelText}>{label}</Text>
          </Animated.View>
        )}
        
        {/* 显示徽章 */}
        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              {badgeCount > 99 ? '99+' : badgeCount}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    ...Layout.shadows.large,
    elevation: Layout.elevation.large,
    zIndex: 999,
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    borderRadius: BUTTON_SIZE / 2,
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    top: -40,
    backgroundColor: Colors.backgroundAccent,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.medium,
    left: '50%',
    transform: [{ translateX: -50 }],
    ...Layout.shadows.small,
  },
  labelText: {
    color: Colors.text,
    fontSize: Layout.typography.size.sm,
    fontWeight: 'bold',
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.error,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.background,
  },
  badgeText: {
    color: '#fff',
    fontSize: Layout.typography.size.xs,
    fontWeight: 'bold',
  },
});

export default FloatingButton; 