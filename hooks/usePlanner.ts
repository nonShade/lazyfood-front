import { useState, useCallback, useMemo } from 'react';
import { WeekPlan, PlannerStats, DayPlan, Recipe } from '../types/planner';
import { getNext7Days, formatDate } from '../utils/dateUtils';

const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Bruschetta Italiana',
    time: 10,
    calories: 150,
    difficulty: 'Fácil',
    icon: '🥖',
    ingredients: ['4 rebanadas de pan', '2 Tomates maduros', '2 dientes de ajo', 'Hojas de albahaca', 'Aceite de oliva', 'Sal y pimienta'],
  },
  {
    id: 2,
    name: 'Sofrito Mediterráneo',
    time: 20,
    calories: 180,
    difficulty: 'Fácil',
    icon: '🥘',
    ingredients: ['2 Cebollas', '2 Pimientos', '3 Tomates', '2 dientes de ajo', 'Aceite de oliva', 'Sal', 'Pimienta'],
  },
  {
    id: 3,
    name: 'Ensalada César',
    time: 15,
    calories: 220,
    difficulty: 'Fácil',
    icon: '🥗',
    ingredients: ['Lechuga romana', '50g Queso parmesano', 'Crutones', 'Anchoas (opcional)', 'Aderezo César'],
  },
  {
    id: 4,
    name: 'Avocado Toast',
    time: 8,
    calories: 180,
    difficulty: 'Fácil',
    icon: '🥑',
    ingredients: ['2 rebanadas de pan integral', '1 aguacate maduro', '1/2 limón', 'Sal', 'Pimienta', 'Hojuelas de chile (opcional)'],
  },
  {
    id: 5,
    name: 'Huevos Revueltos',
    time: 12,
    calories: 200,
    difficulty: 'Fácil',
    icon: '🍳',
    ingredients: ['3 huevos', '1 cucharada de mantequilla', 'Sal', 'Pimienta', 'Cebollín picado (opcional)'],
  },
  {
    id: 6,
    name: 'Smoothie Tropical',
    time: 5,
    calories: 120,
    difficulty: 'Fácil',
    icon: '🥤',
    ingredients: ['1 plátano', '1/2 mango', '100 ml de leche de almendras', '1/2 taza de piña', 'Hielo al gusto'],
  },
  {
    id: 7,
    name: 'Pasta Carbonara',
    time: 25,
    calories: 420,
    difficulty: 'Medio',
    icon: '🍝',
    ingredients: ['200g de pasta (espagueti)', '100g de panceta o bacon', '2 huevos', '50g de queso parmesano', 'Pimienta negra', 'Sal'],
  },
  {
    id: 8,
    name: 'Pollo Teriyaki',
    time: 30,
    calories: 380,
    difficulty: 'Medio',
    icon: '🍗',
    ingredients: ['400g de pechuga de pollo', '3 cucharadas de salsa de soja', '2 cucharadas de mirin', '1 cucharada de azúcar', 'Ajo y jengibre picado', 'Aceite para cocinar'],
  },
  {
    id: 9,
    name: 'Tacos de Pescado',
    time: 20,
    calories: 280,
    difficulty: 'Fácil',
    icon: '🌮',
    ingredients: ['300g filetes de pescado blanco', 'Tortillas de maíz', 'Col rallada', 'Salsa de yogur o mayonesa', 'Limón', 'Especias (comino, paprika)'],
  },
  {
    id: 10,
    name: 'Salmón Grillado',
    time: 18,
    calories: 350,
    difficulty: 'Medio',
    icon: '🐟',
    ingredients: ['2 filetes de salmón', 'Aceite de oliva', 'Sal', 'Pimienta', 'Rodajas de limón', 'Eneldo fresco (opcional)'],
  },
  {
    id: 11,
    name: 'Ratatouille',
    time: 45,
    calories: 160,
    difficulty: 'Medio',
    icon: '🍆',
    ingredients: ['1 berenjena', '1 calabacín', '1 pimiento rojo', '2 tomates', '1 cebolla', '2 dientes de ajo', 'Aceite de oliva', 'Hierbas provenzales', 'Sal y pimienta'],
  },
  {
    id: 12,
    name: 'Curry de Verduras',
    time: 35,
    calories: 240,
    difficulty: 'Medio',
    icon: '🍛',
    ingredients: ['1 patata', '1 zanahoria', '1 calabacín', '1 cebolla', '200ml leche de coco', '2 cucharadas de pasta de curry', 'Aceite', 'Sal'],
  },
];

const generateSuggestedWeekPlan = (): WeekPlan => {
  const suggestedDays = getNext7Days();
  const planDays: DayPlan[] = suggestedDays.map((date: Date, index: number) => {
    const mealIndex = index % mockRecipes.length;
    return {
      date: formatDate(date),
      breakfast: mockRecipes[mealIndex % 4],
      lunch: mockRecipes[(mealIndex + 1) % mockRecipes.length],
      dinner: mockRecipes[(mealIndex + 2) % mockRecipes.length],
    };
  });

  return {
    userId: 'user123',
    startDate: formatDate(suggestedDays[0]),
    endDate: formatDate(suggestedDays[suggestedDays.length - 1]),
    days: planDays,
  };
};

export const usePlanner = (_userId: string) => {
  const suggestedWeekPlan = useMemo(() => generateSuggestedWeekPlan(), []);
  const [weekPlan] = useState<WeekPlan | null>(suggestedWeekPlan);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const getStatsForMonth = useCallback((): PlannerStats => {
    if (!weekPlan) {
      return {
        totalCookingDays: 0,
        totalRecipes: 0,
        averageCaloriesPerDay: 0,
        mostUsedDifficulty: 'Fácil'
      };
    }

    const daysWithRecipes = weekPlan.days.filter(day => 
      day.breakfast || day.lunch || day.dinner
    );
    
    const allRecipes = weekPlan.days.flatMap(day => 
      [day.breakfast, day.lunch, day.dinner].filter(Boolean)
    );

    const totalCalories = allRecipes.reduce((sum, recipe) => sum + (recipe?.calories || 0), 0);
    const averageCaloriesPerDay = daysWithRecipes.length > 0 ? totalCalories / daysWithRecipes.length : 0;

    const difficultyCount = allRecipes.reduce((acc, recipe) => {
      if (recipe?.difficulty) {
        acc[recipe.difficulty] = (acc[recipe.difficulty] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostUsedDifficulty = Object.entries(difficultyCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Fácil';

    return {
      totalCookingDays: daysWithRecipes.length,
      totalRecipes: allRecipes.length,
      averageCaloriesPerDay: Math.round(averageCaloriesPerDay),
      mostUsedDifficulty
    };
  }, [weekPlan]);

  const getDayPlan = useCallback((date: Date): DayPlan | null => {
    if (!weekPlan) return null;
    
    const dateString = date.toISOString().split('T')[0];
    return weekPlan.days.find(day => day.date === dateString) || null;
  }, [weekPlan]);

  const getAISuggestions = useCallback((mealType: 'breakfast' | 'lunch' | 'dinner', exclude?: number[]): Recipe[] => {
    const breakfastRecipes = [0, 3, 4, 5];
    const lunchRecipes = [1, 6, 7, 8, 9];
    const dinnerRecipes = [2, 7, 8, 9, 10, 11];
    
    let suitableRecipeIds: number[] = [];
    switch (mealType) {
      case 'breakfast':
        suitableRecipeIds = breakfastRecipes;
        break;
      case 'lunch':
        suitableRecipeIds = lunchRecipes;
        break;
      case 'dinner':
        suitableRecipeIds = dinnerRecipes;
        break;
    }
    
    const availableRecipes = suitableRecipeIds
      .filter(id => !exclude?.includes(mockRecipes[id].id))
      .map(id => mockRecipes[id]);
    
    return availableRecipes.slice(0, 3);
  }, []);

  return {
    weekPlan,
    // Expose the raw recipes from the mock week plan for UI components that
    // want to render recipe lists without a backend.
    recipes: mockRecipes,
    selectedDate,
    currentMonth,
    isLoading,
    error,
    setSelectedDate,
    setCurrentMonth,
    getStatsForMonth,
    getDayPlan,
    getAISuggestions,
    getRecipeById: (id: number) => mockRecipes.find(r => r.id === id) ?? null,
  };
};