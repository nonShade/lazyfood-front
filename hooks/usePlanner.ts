import { useState, useCallback } from 'react';
import { WeekPlan, PlannerStats, DayPlan, Recipe } from '../types/planner';

const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Bruschetta Italiana',
    time: 10,
    calories: 150,
    difficulty: 'Fácil',
    icon: '🥖',
  },
  {
    id: 2,
    name: 'Sofrito Mediterráneo',
    time: 20,
    calories: 180,
    difficulty: 'Fácil',
    icon: '🥘',
  },
  {
    id: 3,
    name: 'Ensalada César',
    time: 15,
    calories: 220,
    difficulty: 'Fácil',
    icon: '🥗',
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

  return {
    weekPlan,
    selectedDate,
    currentMonth,
    isLoading,
    error,
    setSelectedDate,
    setCurrentMonth,
    getStatsForMonth,
    getDayPlan,
  };
};