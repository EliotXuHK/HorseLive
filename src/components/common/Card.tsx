import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors } from '../../constants';

interface CardProps extends ViewProps {
  elevated?: boolean;
  padding?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  elevated = false, 
  padding = true,
  style, 
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.card, 
        elevated && styles.elevated,
        padding && styles.padding,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  padding: {
    padding: 16,
  },
});

export default Card; 