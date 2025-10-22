import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/theme';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  style,
  textStyle,
  disabled = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.base;
    const sizeStyle = size === 'lg' ? styles.lg : styles.default;
    const variantStyle = variant === 'outline' ? styles.outline : 
                        variant === 'secondary' ? styles.secondary : styles.primary;
    
    return { ...baseStyle, ...sizeStyle, ...variantStyle, ...(disabled && styles.disabled) };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = styles.text;
    const variantTextStyle = variant === 'outline' ? styles.outlineText : 
                            variant === 'secondary' ? styles.secondaryText : styles.primaryText;
    
    return { ...baseTextStyle, ...variantTextStyle, ...(disabled && styles.disabledText) };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[getTextStyle(), textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  default: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  primary: {
    backgroundColor: Colors.light.primary,
  },
  secondary: {
    backgroundColor: Colors.light.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  disabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: Colors.light.primary,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

export default Button;