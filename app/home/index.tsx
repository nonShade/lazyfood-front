import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BottomNavigation from '../../components/common/BottomNavigation';

const Home = () => {
  const navigationItems = [
    { id: 'home', icon: 'home', label: 'Inicio', isActive: true, onPress: () => {} },
    { id: 'recipes', icon: 'book-open', label: 'Recetas', isActive: false, onPress: () => {} },
    { id: 'planner', icon: 'calendar', label: 'Calendario', isActive: false, onPress: () => {} },
    { id: 'profile', icon: 'user', label: 'Perfil', isActive: false, onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {}
      </ScrollView>

      <BottomNavigation items={navigationItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { flex: 1 },
});

export default Home;
