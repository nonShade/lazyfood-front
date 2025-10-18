import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  time: string;
  difficulty: string;
  ingredients: number;
  onPress?: () => void;
  icon?: string;
}

const QuickSuggestionCard: React.FC<Props> = ({
  title,
  time,
  difficulty,
  ingredients,
  onPress,
  icon = 'food',
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Feather name={icon as any} size={20} color="#D97706" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⏱ {time}</Text>
          <Text style={styles.metaText}> • {difficulty}</Text>
          <Text style={styles.metaText}> • {ingredients} ingredientes</Text>
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
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
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chev: {
    paddingLeft: 8,
  },
});

export default QuickSuggestionCard;
