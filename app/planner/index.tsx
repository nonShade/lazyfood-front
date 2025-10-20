import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePlanner } from '../../hooks/usePlanner';
import Calendar from '../../components/planner/Calendar';
import DayRecipes from '../../components/planner/DayRecipes';
import StatsCard from '../../components/planner/StatsCard';
import BottomNavigation from '../../components/common/BottomNavigation';

const PlannerHome = () => {
  const userId = 'user123';

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
  } = usePlanner(userId);

  const handleMonthChange = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleScannerPress = () => {
    // Scanner functionality 
  };

  const dayPlan = getDayPlan(selectedDate);
  const stats = getStatsForMonth();

  const navigationItems = [
    {
      id: 'home',
      icon: 'home',
      label: 'Inicio',
      isActive: false,
      onPress: () => router.push('/home'),
    },
    {
      id: 'recipes',
      icon: 'book-open',
      label: 'Recetas',
      isActive: false,
      onPress: () => console.log('Navigate to recipes'),
    },
    {
      id: 'planner',
      icon: 'calendar',
      label: 'Calendario',
      isActive: true,
      onPress: () => {},
    },
    {
      id: 'profile',
      icon: 'user',
      label: 'Perfil',
      isActive: false,
      onPress: () => console.log('Navigate to profile'),
    },
  ];

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



      <BottomNavigation items={navigationItems} onScannerPress={handleScannerPress} />
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
    paddingTop: 10,
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
