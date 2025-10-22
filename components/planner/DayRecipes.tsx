import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DayPlan, Recipe } from '../../types/planner';
import { usePlanner } from '../../hooks/usePlanner';
import { getNext7Days, isDateInNext7Days } from '../../utils/dateUtils';

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
  const { getAISuggestions } = usePlanner('user123');
  const [suggestionOverrides, setSuggestionOverrides] = useState<Record<string, Recipe>>({});

  const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const isFutureDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  };

  const isInNext7Days = () => {
    const next7Days = getNext7Days();
    return isDateInNext7Days(selectedDate, next7Days);
  };

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

  const getRecipeForMeal = (mealType: 'breakfast' | 'lunch' | 'dinner'): Recipe | null => {
    const overrideKey = `${selectedDate.toISOString().split('T')[0]}-${mealType}`;
    if (suggestionOverrides[overrideKey]) {
      return suggestionOverrides[overrideKey];
    }

    if (dayPlan?.[mealType]) {
      return dayPlan[mealType];
    }


    if (isInNext7Days() || !isFutureDate()) {
      const suggestions = getAISuggestions(mealType);
      return suggestions[0] || null;
    }

    return null;
  };

  const handleChangeRecipe = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const currentRecipe = getRecipeForMeal(mealType);
    const excludeIds = currentRecipe ? [currentRecipe.id] : [];
    const suggestions = getAISuggestions(mealType, excludeIds);

    if (suggestions.length > 0) {
      const overrideKey = `${selectedDate.toISOString().split('T')[0]}-${mealType}`;
      setSuggestionOverrides(prev => ({
        ...prev,
        [overrideKey]: suggestions[0]
      }));
    }
  };

  const renderRecipeCard = (recipe: Recipe, mealType: 'breakfast' | 'lunch' | 'dinner') => (
    <View key={`${mealType}-${recipe.id}`} style={styles.recipeCard}>
      <View style={styles.mealTypeHeader}>
        <Text style={styles.mealTypeText}>{getMealTypeLabel(mealType)}</Text>
        <Text style={styles.aiSuggestionBadge}>IA sugiere</Text>
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
        <TouchableOpacity
          style={styles.changeButton}
          onPress={() => handleChangeRecipe(mealType)}
        >
          <Feather name="refresh-cw" size={16} color="#F59E0B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFutureMealSlot = (mealType: 'breakfast' | 'lunch' | 'dinner') => (
    <View key={`future-${mealType}`} style={[styles.recipeCard, styles.futureMealSlot]}>
      <View style={styles.mealTypeHeader}>
        <Text style={styles.mealTypeText}>{getMealTypeLabel(mealType)}</Text>
      </View>
      <View style={styles.futureContent}>
        <Feather name="clock" size={24} color="#9CA3AF" />
        <Text style={styles.futureText}>No disponible aún</Text>
        <Text style={styles.futureSubtext}>Las sugerencias aparecerán el día anterior</Text>
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

  const meals: { type: 'breakfast' | 'lunch' | 'dinner' }[] = [
    { type: 'breakfast' },
    { type: 'lunch' },
    { type: 'dinner' },
  ];

  const renderMealSlot = (mealType: 'breakfast' | 'lunch' | 'dinner') => {

    if (isFutureDate() && !isInNext7Days()) {
      return renderFutureMealSlot(mealType);
    }

    const recipe = getRecipeForMeal(mealType);
    return recipe ? renderRecipeCard(recipe, mealType) : renderEmptyMealSlot(mealType);
  };

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

      {meals.map(({ type }) => renderMealSlot(type))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  aiSuggestionBadge: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
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
  changeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
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
  futureMealSlot: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  futureContent: {
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  futureText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  futureSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default DayRecipes;
