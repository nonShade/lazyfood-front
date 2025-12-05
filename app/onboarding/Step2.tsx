import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/theme';

interface Step2Data {
  dietType: string[];
  allergies: string[];
}

interface Step2Props {
  data: Step2Data;
  onDataChange: (data: Partial<Step2Data>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ data, onDataChange, onNext, onBack }) => {
  const toggleSelection = (type: keyof Step2Data, value: string) => {
    const currentArray = data[type];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    onDataChange({ [type]: newArray });
  };

  const dietTypes = ['Omnívora', 'Vegetariana', 'Vegana', 'Keto', 'Mediterránea', 'Paleo'];
  const allergyTypes = ['Ninguna', 'Gluten', 'Lácteos', 'Frutos secos', 'Mariscos', 'Huevo', 'Soja'];

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <View style={styles.iconContainer}>
          <View style={[styles.decorativeCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
            <Ionicons name="book-outline" size={96} color={Colors.light.secondary} />
          </View>
        </View>

        <Text style={styles.stepTitle}>Preferencias alimenticias</Text>

        <View style={styles.preferenceSection}>
          <Text style={styles.sectionLabel}>Tipo de dieta:</Text>
          <View style={styles.badgeContainer}>
            {dietTypes.map(diet => (
              <TouchableOpacity
                key={diet}
                onPress={() => toggleSelection('dietType', diet)}
                activeOpacity={0.7}
              >
                <Badge
                  variant={data.dietType.includes(diet) ? 'primary' : 'default'}
                  style={styles.badge}
                  textStyle={styles.badgeText}
                >
                  {diet}
                </Badge>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.preferenceSection}>
          <Text style={styles.sectionLabel}>Alergias:</Text>
          <View style={styles.badgeContainer}>
            {allergyTypes.map(allergy => (
              <TouchableOpacity
                key={allergy}
                onPress={() => toggleSelection('allergies', allergy)}
                activeOpacity={0.7}
              >
                <Badge
                  variant={data.allergies.includes(allergy) ? 'primary' : 'default'}
                  style={styles.badge}
                  textStyle={styles.badgeText}
                >
                  {allergy}
                </Badge>
              </TouchableOpacity>
            ))}
          </View>
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
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginBottom: 20,
  },
  decorativeCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.light.text,
  },
  preferenceSection: {
    width: '100%',
    marginBottom: 15,
    flex: 1,
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 18,
    color: Colors.light.text,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    minHeight: 140,
  },
  badge: {
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
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

export default Step2;
