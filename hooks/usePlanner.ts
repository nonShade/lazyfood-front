import { useCallback, useState } from 'react';
import { DayPlan, PlannerStats, Recipe, WeekPlan } from '../types/planner';

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
  },
  {
    id: 5,
    name: 'Huevos Revueltos',
    time: 12,
    calories: 200,
    difficulty: 'Fácil',
    icon: '🍳',
  },
  {
    id: 6,
    name: 'Smoothie Tropical',
    time: 5,
    calories: 120,
    difficulty: 'Fácil',
    icon: '🥤',
  },
  {
    id: 7,
    name: 'Pasta Carbonara',
    time: 25,
    calories: 420,
    difficulty: 'Medio',
    icon: '🍝',
  },
  {
    id: 8,
    name: 'Pollo Teriyaki',
    time: 30,
    calories: 380,
    difficulty: 'Medio',
    icon: '🍗',
  },
  {
    id: 9,
    name: 'Tacos de Pescado',
    time: 20,
    calories: 280,
    difficulty: 'Fácil',
    icon: '🌮',
  },
  {
    id: 10,
    name: 'Salmón Grillado',
    time: 18,
    calories: 350,
    difficulty: 'Medio',
    icon: '🐟',
  },
  {
    id: 11,
    name: 'Ratatouille',
    time: 45,
    calories: 160,
    difficulty: 'Medio',
    icon: '🍆',
  },
  {
    id: 12,
    name: 'Curry de Verduras',
    time: 35,
    calories: 240,
    difficulty: 'Medio',
    icon: '🍛',
  },
];

const mockWeekPlan: WeekPlan = {
  userId: 'user123',
  startDate: '2025-10-13',
  endDate: '2025-10-19',
  days: [
    {
      date: '2025-10-17',
      breakfast: mockRecipes[0],
      lunch: mockRecipes[1],
      dinner: mockRecipes[2],
    },
    {
      date: '2025-10-18',
      lunch: mockRecipes[0],
    },
  ],
};

export const usePlanner = (userId: string) => {
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(mockWeekPlan);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



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
    getRecipeById: (id: number) => mockRecipes.find(r => r.id === id) ?? null,
  };
};