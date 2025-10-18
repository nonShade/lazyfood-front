import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BottomNavigation from '../../components/common/BottomNavigation';
import HomeHeader from '../../components/home/HomeHeader';
import QuickSuggestionCard from '../../components/home/QuickSuggestionCard';

const Home = () => {
  const navigationItems = [
    { id: 'home', icon: 'home', label: 'Inicio', isActive: true, onPress: () => {} },
    { id: 'recipes', icon: 'book-open', label: 'Recetas', isActive: false, onPress: () => {} },
    { id: 'planner', icon: 'calendar', label: 'Calendario', isActive: false, onPress: () => {} },
    { id: 'profile', icon: 'user', label: 'Perfil', isActive: false, onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <HomeHeader />

        <View style={styles.section}>
          <QuickSuggestionCard title="Pasta con tomate" time="15 min" difficulty="Fácil" ingredients={3} icon="food" />
          <QuickSuggestionCard title="Ensalada mediterránea" time="10 min" difficulty="Fácil" ingredients={5} icon="food" />
          <QuickSuggestionCard title="Pollo al limón" time="25 min" difficulty="Intermedio" ingredients={4} icon="food" />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNavigation items={navigationItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 10, marginTop: 14 },
});

export default Home;
