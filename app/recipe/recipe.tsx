import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useRecipes } from '../../hooks/useRecipes';
import { useEffect } from 'react';

const RecipeDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params?.id ? Number(params.id) : null;

  const { currentRecipe, loadRecipeDetail, isLoading, error } = useRecipes();

  useEffect(() => {
    if (id) {
      loadRecipeDetail(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#B45309" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
        <TouchableOpacity onPress={() => id && loadRecipeDetail(id)} style={styles.retryButton}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>

        {currentRecipe ? (
          <View style={styles.topIllustration}>
            <Text style={styles.emoji}>{currentRecipe.emoji || '🍽️'}</Text>
          </View>
        ) : (
          <View style={styles.topIllustration}>
            <Text style={styles.emoji}>❓</Text>
          </View>
        )}

        <View style={styles.card}>
          {currentRecipe ? (
            <>
              <Text style={styles.title}>{currentRecipe.nombre}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.meta}>⏱ {currentRecipe.tiempo_preparacion} min</Text>
                <Text style={styles.meta}> • {currentRecipe.calorias} kcal</Text>
                <Text style={styles.meta}> • {currentRecipe.nivel_dificultad}</Text>
              </View>

              {currentRecipe.descripcion && (
                <Text style={styles.description}>{currentRecipe.descripcion}</Text>
              )}

              <Text style={styles.sectionTitle}>Ingredientes</Text>

              {currentRecipe.ingredientes && currentRecipe.ingredientes.length > 0 ? (
                currentRecipe.ingredientes.map((ing, idx) => (
                  <View key={idx} style={styles.ingredientRow}>
                    <Text style={styles.ingredientText}>
                      {ing.cantidad} {ing.unidad} {ing.nombre}
                    </Text>
                    <Feather
                      name="check-circle"
                      size={18}
                      color="#10B981"
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No hay ingredientes listados</Text>
              )}

              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={() => router.push(`/recipe/cooking-mode/cooking?id=${currentRecipe.id}` as any)}
              >
                <Text style={styles.primaryButtonText}>▷ Cocina Guiada</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 20 }}>
              Receta no encontrada
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { paddingBottom: 60 },
  center: { justifyContent: 'center', alignItems: 'center' },

  back: { padding: 12, marginTop: 20, marginLeft: 12, position: 'absolute', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20 },

  topIllustration: {
    height: 200,
    backgroundColor: '#FEF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 80 },

  card: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: -24,
    minHeight: 500,
  },

  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' },
  meta: { color: '#6B7280', marginRight: 12, fontSize: 14, marginBottom: 4 },
  description: { fontSize: 14, color: '#4B5563', marginBottom: 20, fontStyle: 'italic' },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 12, color: '#111827' },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
  },
  ingredientText: { color: '#374151', fontSize: 16, flex: 1 },
  emptyText: { color: '#9CA3AF', fontStyle: 'italic' },

  primaryButton: {
    backgroundColor: '#B45309',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },

  retryButton: { marginTop: 10, padding: 10, backgroundColor: '#EEE', borderRadius: 8 },
  retryText: { color: '#333' }
});

export default RecipeDetail;