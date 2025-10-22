import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

interface LazyFoodLogoProps {
  size?: number;
}

const LazyFoodLogo: React.FC<LazyFoodLogoProps> = ({ size = 120 }) => {
  const radius = size / 2;
  const fontSize = size * 0.33; // Proporción similar al login

  return (
    <View style={[
      styles.logoCircle,
      {
        width: size,
        height: size,
        borderRadius: radius,
      }
    ]}>
      <Text style={[styles.logoText, { fontSize }]}>LF</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoCircle: {
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default LazyFoodLogo;