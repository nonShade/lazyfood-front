import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { usePlanner } from '../../hooks/usePlanner';
import Calendar from '../../components/planner/Calendar';
import DayRecipes from '../../components/planner/DayRecipes';
import StatsCard from '../../components/planner/StatsCard';

const PlannerHome = () => {
  const userId = 'user123';
  const params = useLocalSearchParams();

  const {
    weekPlan,
    selectedDate,
    currentMonth,
    isLoading,
    error,
    setSelectedDate,
    setCurrentMonth,
    getStatsForMonth,
    getDayPlan,
    refreshWeekPlan,
  } = usePlanner(userId);

  useEffect(() => {
    if (params.plannerRefresh === 'true') {
      refreshWeekPlan();
    }
  }, [params.plannerRefresh, refreshWeekPlan]);

  const handleMonthChange = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const dayPlan = getDayPlan(selectedDate);
  const stats = getStatsForMonth();


  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Error al cargar el planificador</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D97706" />
        <Text style={styles.loadingText}>Cargando planificador...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Planificador Semanal</Text>
          <Text style={styles.subtitle}>Organiza tus comidas de la semana</Text>
        </View>

        <Calendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          weekPlan={weekPlan}
          onDateSelect={setSelectedDate}
          onMonthChange={handleMonthChange}
        />

        <DayRecipes
          selectedDate={selectedDate}
          dayPlan={dayPlan}
        />

        <StatsCard stats={stats} />

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

});

export default PlannerHome;
