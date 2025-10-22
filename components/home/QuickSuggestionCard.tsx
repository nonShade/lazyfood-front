import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  id?: number;
  title: string;
  time: string;
  difficulty: string;
  ingredients?: number | string[];
  calories?: number;
  onPress?: () => void;
  icon?: string;
}

const QuickSuggestionCard: React.FC<Props> = ({
  id,
  title,
  time,
  difficulty,
  ingredients,
  calories,
  onPress,
  icon = '🍽️',
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress();
    if (id != null) {
      router.push(`/recipe/recipe?id=${encodeURIComponent(String(id))}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⏱ {time}</Text>
          {typeof calories === 'number' && <Text style={styles.metaText}> • {calories} kcal</Text>}
          <Text style={styles.metaText}> • {difficulty}</Text>
          <Text style={styles.metaText}> • {Array.isArray(ingredients) ? ingredients.length : ingredients ?? 0} ingredientes</Text>
        </View>
      </View>

      <View style={styles.chev}>
        <Feather name="chevron-right" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3E0',
    padding: 14,
    minHeight: 76,
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  left: {
    paddingRight: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'center',

    paddingVertical: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  chev: {
    paddingLeft: 8,
  },
});

export default QuickSuggestionCard;
