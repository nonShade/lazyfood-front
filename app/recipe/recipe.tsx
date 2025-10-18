import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#374151" />
      </TouchableOpacity>

      <View style={styles.center}>
        {recipe ? (
          <Text style={styles.text}>{recipe.name}</Text>
        ) : (
          <Text style={styles.text}>Receta no encontrada</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  back: { padding: 12, marginTop: 20, marginLeft: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#111827' },
});

export default RecipeDetail;
