import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CookingSteps from '../../../components/recipe/CookingSteps';
import { usePlanner } from '../../../hooks/usePlanner';

const CookingScreen = () => {
  const router = useRouter(); 
  const params = useLocalSearchParams<{ id?: string }>();
  const rawId = params?.id;
  const parsedId = rawId ? Number(rawId) : null;
  const id = Number.isFinite(parsedId) ? (parsedId as number) : null;
  const { getRecipeById } = usePlanner('user123');

  const recipe = id ? getRecipeById(id) : null;

  const steps = React.useMemo(() => {
    if (!recipe) return [];
    if (recipe.instructions && recipe.instructions.length > 0) {
        // emojis para primeros 4 pasos
        const staticEmojis = ['💧', '🍝', '🧅', '🍅'];
      return recipe.instructions.map((ins, idx) => ({
        id: idx,
        title: `Paso ${idx + 1}`,
        description: ins,
        emoji: staticEmojis[idx] || '🍳', 
        time: undefined,
      }));
    }

    // demo
    return [
      { id: '1', title: 'Hervir agua', description: 'Pon una olla con agua y sal al fuego alto', time: undefined, emoji: '💧' },
      { id: '2', title: 'Añade la pasta', description: 'Cuando hierva, añade la pasta y cocina según instrucciones', time: 600, emoji: '🍝' },
      { id: '3', title: 'Sofríe el ajo', description: 'Calienta aceite y sofríe el ajo picado hasta dorar', time: undefined, emoji: '🧅' },
      { id: '4', title: 'Mezcla todo', description: 'Añade los tomates y mezcla', time: undefined, emoji: '🍅' },
    ];
  }, [recipe]);
  
  const handleBackToDetails = () => {
      router.back();
  };
  
  const handleFinishCooking = () => {
      router.replace('/home'); 
  };

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#6B7280' }}>Receta no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CookingSteps 
        steps={steps} 
        onBackToDetails={handleBackToDetails} 
        onFinish={handleFinishCooking} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default CookingScreen;