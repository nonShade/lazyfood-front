import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import CookingSteps from '../../../components/recipe/CookingSteps';
import { useRecipes } from '../../../hooks/useRecipes';

const CookingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params?.id ? Number(params.id) : null;

  const { currentRecipe, loadRecipeDetail, generateSteps, isLoading, error } = useRecipes();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (id) {
        if (!currentRecipe || currentRecipe.id !== id) {
          await loadRecipeDetail(id);
        }
      }
    };
    init();
  }, [id]);

  useEffect(() => {
    const checkSteps = async () => {
      if (currentRecipe && currentRecipe.id === id) {
        if (!currentRecipe.pasos || currentRecipe.pasos.length === 0) {
          if (!isGenerating && !isLoading) {
            setIsGenerating(true);
            try {
              await generateSteps(id);
            } catch (e) {
              console.error("Error generando pasos", e);
            } finally {
              setIsGenerating(false);
            }
          }
        }
      }
    };
    checkSteps();
  }, [currentRecipe, id]);

  const steps = React.useMemo(() => {
    if (!currentRecipe || !currentRecipe.pasos) return [];

    const emojis = ['🔪', '🔥', '🍳', '🍲', '🧂', '🥣', '🍽️', '⏲️'];

    return currentRecipe.pasos.map((step, idx) => ({
      id: step.n,
      title: `Paso ${step.n}`,
      description: step.instruccion,
      emoji: emojis[idx % emojis.length],
      time: step.timer,
    }));
  }, [currentRecipe]);

  const handleBackToDetails = () => {
    router.back();
  };

  const handleFinishCooking = () => {
    router.replace('/home');
  };

  if (isLoading || isGenerating) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#B45309" />
        <Text style={{ marginTop: 20, color: '#6B7280' }}>
          {isGenerating ? 'La IA está creando los pasos...' : 'Cargando receta...'}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  if (!currentRecipe) {
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
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default CookingScreen;