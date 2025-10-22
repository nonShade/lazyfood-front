import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  style,
  textStyle,
}) => {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle = styles.base;
    
    switch (variant) {
      case 'primary':
        return { ...baseStyle, ...styles.primary };
      case 'secondary':
        return { ...baseStyle, ...styles.secondary };
      case 'accent':
        return { ...baseStyle, ...styles.accent };
      default:
        return { ...baseStyle, ...styles.default };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = styles.text;
    
    switch (variant) {
      case 'primary':
        return { ...baseTextStyle, ...styles.primaryText };
      case 'secondary':
        return { ...baseTextStyle, ...styles.secondaryText };
      case 'accent':
        return { ...baseTextStyle, ...styles.accentText };
      default:
        return { ...baseTextStyle, ...styles.defaultText };
    }
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={[getTextStyle(), textStyle]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: '#F3F4F6',
  },
  primary: {
    backgroundColor: Colors.light.primary,
  },
  secondary: {
    backgroundColor: '#10B981',
  },
  accent: {
    backgroundColor: '#10B981',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  defaultText: {
    color: '#374151',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  accentText: {
    color: '#FFFFFF',
  },
});

export default Badge;