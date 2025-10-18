import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlanner } from '../../hooks/usePlanner';
import { Recipe } from '../../types/planner';

const RecipeDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { getRecipeById } = usePlanner('user123');

  const id = params.id ? Number(params.id) : null;
  const recipe = id ? (getRecipeById(id) as Recipe | null) : null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>

        {recipe ? (
          <>
            <View style={styles.topIllustration}>
              <Text style={styles.emoji}>{recipe.icon}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>{recipe.name}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.meta}>⏱ {recipe.time} min</Text>
                <Text style={styles.meta}> • {recipe.calories} kcal</Text>
              </View>

              <Text style={styles.sectionTitle}>Ingredientes</Text>

              {recipe.ingredients?.map((ing, idx) => (
                <View key={idx} style={styles.ingredientRow}>
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 50 }}>
            Receta no encontrada
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { paddingBottom: 60 },
  back: { padding: 12, marginTop: 20, marginLeft: 12 },
  topIllustration: {
    height: 180,
    backgroundColor: '#FEF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 56 },
  card: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    marginTop: -20,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  meta: { color: '#6B7280', marginRight: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 8, color: '#111827' },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
  },
  ingredientText: { color: '#374151' },
});

export default RecipeDetail;
