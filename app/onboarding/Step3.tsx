import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/theme';

interface Step3Data {
  goals: string[];
}

interface Step3Props {
  data: Step3Data;
  onDataChange: (data: Partial<Step3Data>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3: React.FC<Step3Props> = ({ data, onDataChange, onNext, onBack }) => {
  const toggleSelection = (value: string) => {
    const currentGoals = data.goals;
    const newGoals = currentGoals.includes(value) 
      ? currentGoals.filter(item => item !== value)
      : [...currentGoals, value];
    
    onDataChange({ goals: newGoals });
  };

  const goalOptions = [
    { key: 'health', label: 'Mantener salud general', icon: 'heart-outline' },
    { key: 'weight-loss', label: 'Bajar de peso', icon: 'trending-down-outline' },
    { key: 'muscle', label: 'Aumentar masa muscular', icon: 'fitness-outline' },
    { key: 'energy', label: 'Mejorar energía', icon: 'flash-outline' },
    { key: 'cook-more', label: 'Cocinar más en casa', icon: 'home-outline' },
    { key: 'save-money', label: 'Ahorrar dinero', icon: 'card-outline' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <View style={styles.iconContainer}>
          <View style={[styles.decorativeCircle, { backgroundColor: 'rgba(217, 119, 6, 0.2)' }]}>
            <Ionicons name="star" size={96} color={Colors.light.primary} />
          </View>
        </View>
        
        <Text style={styles.stepTitle}>Metas nutricionales</Text>
        <Text style={styles.stepSubtitle}>Selecciona tus objetivos</Text>
        
        <View style={styles.optionsContainer}>
          {goalOptions.map(goal => (
            <Button
              key={goal.key}
              variant={data.goals.includes(goal.key) ? 'default' : 'outline'}
              onPress={() => toggleSelection(goal.key)}
              style={styles.goalButton}
            >
              <View style={styles.goalContent}>
                <Ionicons 
                  name={goal.icon as any} 
                  size={20} 
                  color={data.goals.includes(goal.key) ? '#FFFFFF' : Colors.light.primary} 
                />
                <Text style={[
                  styles.goalText,
                  { color: data.goals.includes(goal.key) ? '#FFFFFF' : Colors.light.primary }
                ]}>
                  {goal.label}
                </Text>
              </View>
            </Button>
          ))}
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          variant="outline"
          onPress={onBack}
        >
          Atrás
        </Button>
        <Button
          onPress={onNext}
        >
          Finalizar
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
    marginBottom: 8,
    color: Colors.light.text,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 32,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  goalButton: {
    width: '100%',
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
});

export default Step3;