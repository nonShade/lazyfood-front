import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PlannerStats } from '../../types/planner';

interface StatsCardProps {
  stats: PlannerStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="bar-chart-2" size={20} color="#D97706" />
        <Text style={styles.title}>Estadísticas del mes</Text>
      </View>
      
      <View style={styles.grid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalCookingDays}</Text>
          <Text style={styles.statLabel}>Días cocinando</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalRecipes}</Text>
          <Text style={styles.statLabel}>Recetas hechas</Text>
        </View>
      </View>
      
      <View style={styles.grid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.averageCaloriesPerDay}</Text>
          <Text style={styles.statLabel}>Calorías promedio</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.mostUsedDifficulty}</Text>
          <Text style={styles.statLabel}>Dificultad favorita</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  grid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default StatsCard;