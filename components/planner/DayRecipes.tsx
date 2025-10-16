import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DayPlan, Recipe } from '../../types/planner';

interface DayRecipesProps {
  selectedDate: Date;
  dayPlan: DayPlan | null;
  onClose?: () => void;
}

const DayRecipes: React.FC<DayRecipesProps> = ({
  selectedDate,
  dayPlan,
  onClose,
}) => {
  const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const formatDate = () => {
    const dayName = weekDays[selectedDate.getDay()];
    const day = selectedDate.getDate();
    const month = months[selectedDate.getMonth()];
    return `${dayName}, ${day} de ${month}`;
  };

  const getMealTypeLabel = (mealType: string) => {
    const labels = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena'
    };
    return labels[mealType as keyof typeof labels] || mealType;
  };

  const renderRecipeCard = (recipe: Recipe, mealType: 'breakfast' | 'lunch' | 'dinner') => (
    <View key={`${mealType}-${recipe.id}`} style={styles.recipeCard}>
      <View style={styles.mealTypeHeader}>
        <Text style={styles.mealTypeText}>{getMealTypeLabel(mealType)}</Text>
      </View>
      <View style={styles.recipeContent}>
        <View style={styles.recipeIcon}>
          <Text style={styles.recipeEmoji}>{recipe.icon}</Text>
        </View>
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <View style={styles.recipeDetails}>
            <Feather name="clock" size={12} color="#9CA3AF" />
            <Text style={styles.detailText}>{recipe.time} min</Text>
            <Text style={styles.detailText}>{recipe.calories} kcal</Text>
            <Text style={styles.detailText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyMealSlot = (mealType: 'breakfast' | 'lunch' | 'dinner') => (
    <View key={`empty-${mealType}`} style={[styles.recipeCard, styles.emptyMealSlot]}>
      <View style={styles.mealTypeHeader}>
        <Text style={styles.mealTypeText}>{getMealTypeLabel(mealType)}</Text>
      </View>
      <View style={styles.emptyContent}>
        <Feather name="plus" size={24} color="#9CA3AF" />
        <Text style={styles.emptyText}>Agregar receta</Text>
      </View>
    </View>
  );

  const meals: { type: 'breakfast' | 'lunch' | 'dinner'; recipe?: Recipe }[] = [
    { type: 'breakfast', recipe: dayPlan?.breakfast },
    { type: 'lunch', recipe: dayPlan?.lunch },
    { type: 'dinner', recipe: dayPlan?.dinner },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.dateHeader}>
        <Feather name="calendar" size={20} color="#D97706" />
        <Text style={styles.dateText}>{formatDate()}</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {meals.map(({ type, recipe }) =>
        recipe ? renderRecipeCard(recipe, type) : renderEmptyMealSlot(type)
      )}

      {/* {!dayPlan?.breakfast && !dayPlan?.lunch && !dayPlan?.dinner && ( */}
      {/*   <View style={styles.noRecipesContainer}> */}
      {/*     <Feather name="calendar" size={48} color="#9CA3AF" /> */}
      {/*     <Text style={styles.noRecipesTitle}>No hay recetas planificadas</Text> */}
      {/*     <Text style={styles.noRecipesSubtitle}> */}
      {/*       Agrega recetas para este día usando las sugerencias de IA o seleccionando de tu lista */}
      {/*     </Text> */}
      {/*   </View> */}
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 20,
    padding: 15,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    fontSize: 28,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  recipeCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  mealTypeHeader: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  recipeContent: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recipeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeEmoji: {
    fontSize: 24,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recipeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyMealSlot: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyContent: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  noRecipesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  noRecipesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  noRecipesSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

export default DayRecipes;
