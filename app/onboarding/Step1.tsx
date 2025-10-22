import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Colors } from '../../constants/theme';

interface Step1Data {
  name: string;
  cookingLevel: 'beginner' | 'intermediate' | 'advanced' | '';
}

interface Step1Props {
  data: Step1Data;
  onDataChange: (data: Partial<Step1Data>) => void;
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ data, onDataChange, onNext }) => {
  const canProceed = () => {
    return data.name.trim() !== '' && data.cookingLevel !== '';
  };

  const cookingLevels = [
    { key: 'beginner', label: 'Principiante', icon: 'leaf-outline' },
    { key: 'intermediate', label: 'Intermedio', icon: 'restaurant-outline' },
    { key: 'advanced', label: 'Avanzado', icon: 'trophy-outline' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <View style={styles.iconContainer}>
          <View style={[styles.decorativeCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
            <Ionicons name="person" size={96} color={Colors.light.accent} />
          </View>
        </View>
        
        <Text style={styles.stepTitle}>¡Hola! ¿Cómo te llamas?</Text>
        
        <Input
          placeholder="Tu nombre"
          value={data.name}
          onChangeText={(text) => onDataChange({ name: text })}
          style={styles.nameInput}
        />
        
        <Text style={styles.stepSubtitle}>¿Cuál es tu nivel de cocina?</Text>
        
        <View style={styles.optionsContainer}>
          {cookingLevels.map(option => (
            <Button
              key={option.key}
              variant={data.cookingLevel === option.key ? 'default' : 'outline'}
              onPress={() => onDataChange({ cookingLevel: option.key as any })}
              style={styles.optionButton}
            >
              <View style={styles.optionContent}>
                <Ionicons 
                  name={option.icon as any} 
                  size={20} 
                  color={data.cookingLevel === option.key ? '#FFFFFF' : Colors.light.primary} 
                />
                <Text style={[
                  styles.optionText,
                  { color: data.cookingLevel === option.key ? '#FFFFFF' : Colors.light.primary }
                ]}>
                  {option.label}
                </Text>
              </View>
            </Button>
          ))}
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.spacer} />
        <Button
          onPress={onNext}
          disabled={!canProceed()}
        >
          Siguiente
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  decorativeCircle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.light.text,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 24,
  },
  nameInput: {
    width: '100%',
    marginBottom: 24,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    width: '100%',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  spacer: {
    flex: 1,
  },
});

export default Step1;