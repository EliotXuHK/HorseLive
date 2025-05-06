import React from 'react';
import { StyleSheet, View, ViewProps, TouchableOpacity, Animated } from 'react-native';
import { Colors, Layout, Theme } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps extends ViewProps {
  elevated?: boolean | 'small' | 'medium' | 'large';
  padding?: boolean | number;
  gradient?: [string, string, ...string[]];
  onPress?: () => void;
  activeOpacity?: number;
  borderRadius?: number;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  elevated = false, 
  padding = true,
  gradient,
  onPress,
  activeOpacity = 0.7,
  borderRadius,
  style, 
  ...props 
}) => {
  // 对于可点击卡片的按压动画
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    if (!onPress) return;
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    if (!onPress) return;
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };
  
  // 确定阴影/高程样式
  const getElevationStyle = () => {
    if (!elevated) return {};
    
    if (elevated === 'small') {
      return {
        ...Layout.shadows.small,
        elevation: Layout.elevation.small,
      };
    } else if (elevated === 'large') {
      return {
        ...Layout.shadows.large,
        elevation: Layout.elevation.large,
      };
    } else {
      // 中等（默认）或为 true
      return {
        ...Layout.shadows.medium,
        elevation: Layout.elevation.medium,
      };
    }
  };
  
  // 确定内边距样式
  const getPaddingStyle = () => {
    if (padding === false) return {};
    if (typeof padding === 'number') return { padding };
    return { padding: Layout.spacing.md };
  };
  
  // 基础卡片样式
  const cardStyles = [
    styles.card,
    {
      borderRadius: borderRadius || Layout.borderRadius.medium,
      backgroundColor: Colors.backgroundLight,
    },
    getElevationStyle(),
    getPaddingStyle(),
    onPress && { transform: [{ scale: scaleAnim }] },
    style,
  ];
  
  // 渲染适当的内容区域
  const renderContent = () => {
    if (gradient) {
      return (
        <LinearGradient
          colors={gradient}
          style={[styles.gradient, { borderRadius: borderRadius || Layout.borderRadius.medium }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      );
    }
    
    return children;
  };
  
  // 根据是否可点击决定渲染不同组件
  if (onPress) {
    return (
      <Animated.View style={cardStyles}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={activeOpacity}
          style={styles.touchable}
          {...props}
        >
          {renderContent()}
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  return (
    <View style={cardStyles} {...props}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});

export default Card; 