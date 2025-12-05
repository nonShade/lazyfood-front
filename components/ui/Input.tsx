import React from 'react';
import { TextInput, TextInputProps, StyleSheet, TextStyle } from 'react-native';
import { Colors } from '../../constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  style?: TextStyle;
}

const Input: React.FC<InputProps> = ({ style, ...props }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 48,
  },
});

export default Input;