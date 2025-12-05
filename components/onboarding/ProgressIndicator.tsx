import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressDots}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index + 1}
            style={[
              styles.progressDot,
              index + 1 === currentStep ? styles.activeProgressDot : styles.inactiveProgressDot
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressText}>{currentStep}/{totalSteps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    position: 'relative',
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'absolute',
    left: 24,
  },
  progressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  activeProgressDot: {
    backgroundColor: Colors.light.primary,
  },
  inactiveProgressDot: {
    backgroundColor: Colors.light.muted,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    position: 'absolute',
    right: 24,
  },
});

export default ProgressIndicator;
