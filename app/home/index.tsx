import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import HomeHeader from '../../components/home/HomeHeader';
import QuickSuggestionCard from '../../components/home/QuickSuggestionCard';
import { Colors } from '../../constants/theme';
import { useRecipes } from '../../hooks/useRecipes';
import { getUserData } from '../../services/api/authService';

const Home = () => {
  const { recipes, isLoading, error, loadSuggestions } = useRecipes();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    getUserData().then(userData => {
      if (userData) {
        setUserName(userData.nombre);
      }
    }).catch(err => {
      console.error('Error loading user data:', err);
    });

    loadSuggestions(10).catch(err => {
      console.error('Error loading suggestions:', err);
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <HomeHeader userName={userName} />

        <View style={styles.section}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
              <Text style={styles.loadingText}>Cargando recetas...</Text>
            </View>
          )}

          {error && !isLoading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>😕 {error}</Text>
              <Text style={styles.errorSubtext}>
                Intenta escanear algunos ingredientes primero
              </Text>
            </View>
          )}

          {!isLoading && !error && recipes.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>🍳 No hay recetas disponibles</Text>
              <Text style={styles.emptySubtext}>
                Escanea ingredientes para obtener sugerencias personalizadas
              </Text>
            </View>
          )}

          {!isLoading && recipes.length > 0 && recipes.map((receta) => (
            <QuickSuggestionCard
              key={`recipe-${receta.id}`}
              id={receta.id}
              title={receta.nombre}
              time={`${receta.tiempo_preparacion} min`}
              difficulty={receta.nivel_dificultad}
              ingredients={receta.ingredientes ? receta.ingredientes.length : 0}
              calories={receta.calorias}
              icon={receta.emoji || '🍽️'}
            />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 10, marginTop: 14 },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default Home;