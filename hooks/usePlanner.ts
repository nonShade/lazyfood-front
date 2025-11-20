import { useState, useCallback, useEffect, useRef } from "react";
import {
  WeekPlan,
  PlannerStats,
  DayPlan,
  Recipe,
  WeeklyAPIResponse,
} from "../types/planner";
import { formatDate } from "../utils/dateUtils";
import { obtenerPlanificacionSemanal } from "../services/api/plannerService";

const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const getMondayOfWeek = (date: Date): Date => {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Si es domingo (0), retroceder 6 días
  monday.setDate(monday.getDate() + diff);
  return monday;
};

const createRecipeFromPlannedMeal = (meal: any): Recipe => {
  return {
    id: meal.receta_id || 0,
    name: meal.receta_nombre || "Sin nombre",
    time: 0,
    calories: 0,
    difficulty: "Fácil",
    icon: "🍽️",
    description: "",
    ingredients: [],
    instructions: [],
  };
};

const convertAPIResponseToWeekPlan = (
  apiResponse: WeeklyAPIResponse,
  userId: string,
): WeekPlan => {
  const startDate = apiResponse.semana;
  const startDateObj = new Date(startDate);

  // Generar array de días para la semana (7 días desde el lunes)
  const days: DayPlan[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDateObj);
    currentDate.setDate(startDateObj.getDate() + i);
    const dateString = formatDateForAPI(currentDate);

    const dayMenu = apiResponse.menus[dateString];
    const dayPlan: DayPlan = {
      date: dateString,
    };

    if (dayMenu) {
      if (dayMenu.desayuno) {
        dayPlan.breakfast = createRecipeFromPlannedMeal(dayMenu.desayuno);
      }
      if (dayMenu.almuerzo) {
        dayPlan.lunch = createRecipeFromPlannedMeal(dayMenu.almuerzo);
      }
      if (dayMenu.cena) {
        dayPlan.dinner = createRecipeFromPlannedMeal(dayMenu.cena);
      }
    }

    days.push(dayPlan);
  }

  // Calcular fecha de fin (domingo)
  const endDate = new Date(startDateObj);
  endDate.setDate(startDateObj.getDate() + 6);

  return {
    userId,
    startDate: formatDateForAPI(startDateObj),
    endDate: formatDateForAPI(endDate),
    days,
  };
};

// Cache global para evitar llamadas duplicadas
const planCache = new Map<
  string,
  {
    data: WeeklyAPIResponse;
    timestamp: number;
    weekPlan: WeekPlan;
  }
>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const usePlanner = (userId: string) => {
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  // Refs para controlar llamadas concurrentes y debouncing
  const loadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const currentRequestRef = useRef<string>("");

  const loadWeekPlan = useCallback(
    async (date?: Date) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      return new Promise<void>((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            if (loadingRef.current) {
              resolve();
              return;
            }

            const targetDate = date || selectedDate;
            const mondayOfWeek = getMondayOfWeek(targetDate);
            const fechaAPI = formatDateForAPI(mondayOfWeek);

            const requestId = `${fechaAPI}-${userId}`;
            currentRequestRef.current = requestId;

            const cachedData = planCache.get(requestId);
            const now = Date.now();

            if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
              console.log("📦 Usando datos del cache para:", fechaAPI);
              setWeekPlan(cachedData.weekPlan);

              const recipes: Recipe[] = [];
              cachedData.weekPlan.days.forEach((day) => {
                if (day.breakfast) recipes.push(day.breakfast);
                if (day.lunch) recipes.push(day.lunch);
                if (day.dinner) recipes.push(day.dinner);
              });

              const uniqueRecipes = recipes.filter(
                (recipe, index, arr) =>
                  arr.findIndex((r) => r.id === recipe.id) === index,
              );

              setAllRecipes(uniqueRecipes);
              setError(null);
              resolve();
              return;
            }

            setIsLoading(true);
            setError(null);
            loadingRef.current = true;

            const apiResponse = await obtenerPlanificacionSemanal(fechaAPI);

            if (currentRequestRef.current !== requestId) {
              loadingRef.current = false;
              resolve();
              return;
            }

            const convertedWeekPlan = convertAPIResponseToWeekPlan(
              apiResponse,
              userId,
            );

            planCache.set(requestId, {
              data: apiResponse,
              timestamp: now,
              weekPlan: convertedWeekPlan,
            });

            setWeekPlan(convertedWeekPlan);

            const recipes: Recipe[] = [];
            convertedWeekPlan.days.forEach((day) => {
              if (day.breakfast) recipes.push(day.breakfast);
              if (day.lunch) recipes.push(day.lunch);
              if (day.dinner) recipes.push(day.dinner);
            });

            const uniqueRecipes = recipes.filter(
              (recipe, index, arr) =>
                arr.findIndex((r) => r.id === recipe.id) === index,
            );

            setAllRecipes(uniqueRecipes);
          } catch (err) {
            console.error("Error loading week plan:", err);

            const requestId = `${formatDateForAPI(getMondayOfWeek(date || selectedDate))}-${userId}`;
            if (currentRequestRef.current !== requestId) {
              loadingRef.current = false;
              resolve();
              return;
            }

            setError(
              err instanceof Error
                ? err.message
                : "Error al cargar la planificación",
            );
          } finally {
            loadingRef.current = false;
            setIsLoading(false);
            resolve();
          }
        }, 300); // Debounce de 300ms
      });
    },
    [userId, selectedDate],
  );

  useEffect(() => {
    loadWeekPlan();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      loadingRef.current = false;
    };
  }, []); // Solo ejecutar una vez al montar

  useEffect(() => {
    const currentMondayString = formatDateForAPI(getMondayOfWeek(selectedDate));
    const weekPlanMondayString = weekPlan ? weekPlan.startDate : "";

    if (currentMondayString !== weekPlanMondayString) {
      loadWeekPlan(selectedDate);
    }
  }, [selectedDate, weekPlan, loadWeekPlan]);

  const getStatsForMonth = useCallback((): PlannerStats => {
    if (!weekPlan) {
      return {
        totalCookingDays: 0,
        totalRecipes: 0,
        averageCaloriesPerDay: 0,
        mostUsedDifficulty: "Fácil",
      };
    }

    const daysWithRecipes = weekPlan.days.filter(
      (day) => day.breakfast || day.lunch || day.dinner,
    );

    const allRecipesInPlan = weekPlan.days.flatMap((day) =>
      [day.breakfast, day.lunch, day.dinner].filter(Boolean),
    );

    const totalCalories = allRecipesInPlan.reduce(
      (sum, recipe) => sum + (recipe?.calories || 0),
      0,
    );
    const averageCaloriesPerDay =
      daysWithRecipes.length > 0 ? totalCalories / daysWithRecipes.length : 0;

    const difficultyCount = allRecipesInPlan.reduce(
      (acc, recipe) => {
        if (recipe?.difficulty) {
          acc[recipe.difficulty] = (acc[recipe.difficulty] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostUsedDifficulty =
      Object.entries(difficultyCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "Fácil";

    return {
      totalCookingDays: daysWithRecipes.length,
      totalRecipes: allRecipesInPlan.length,
      averageCaloriesPerDay: Math.round(averageCaloriesPerDay),
      mostUsedDifficulty,
    };
  }, [weekPlan]);

  const getDayPlan = useCallback(
    (date: Date): DayPlan | null => {
      if (!weekPlan) return null;

      const dateString = formatDateForAPI(date);
      return weekPlan.days.find((day) => day.date === dateString) || null;
    },
    [weekPlan],
  );

  const getAISuggestions = useCallback(
    (
      mealType: "breakfast" | "lunch" | "dinner",
      exclude?: number[],
    ): Recipe[] => {
      const availableRecipes = allRecipes.filter(
        (recipe) => !exclude?.includes(recipe.id),
      );

      const breakfastKeywords = ["desayuno", "toast", "huevo", "smoothie"];
      const lunchKeywords = ["almuerzo", "ensalada", "pasta", "sofrito"];
      const dinnerKeywords = ["cena", "pollo", "salmón", "curry"];

      let keywords: string[] = [];
      switch (mealType) {
        case "breakfast":
          keywords = breakfastKeywords;
          break;
        case "lunch":
          keywords = lunchKeywords;
          break;
        case "dinner":
          keywords = dinnerKeywords;
          break;
      }

      const suitableRecipes = availableRecipes.filter((recipe) =>
        keywords.some((keyword) => recipe.name.toLowerCase().includes(keyword)),
      );

      return suitableRecipes.length > 0
        ? suitableRecipes.slice(0, 3)
        : availableRecipes.slice(0, 3);
    },
    [allRecipes],
  );

  const getRecipeById = useCallback(
    (id: number): Recipe | null => {
      return allRecipes.find((r) => r.id === id) || null;
    },
    [allRecipes],
  );

  const refreshWeekPlan = useCallback(() => {
    const targetDate = selectedDate;
    const mondayOfWeek = getMondayOfWeek(targetDate);
    const fechaAPI = formatDateForAPI(mondayOfWeek);
    const requestId = `${fechaAPI}-${userId}`;

    planCache.delete(requestId);
    loadWeekPlan(selectedDate);
  }, [loadWeekPlan, selectedDate, userId]);

  const clearCache = useCallback(() => {
    planCache.clear();
  }, []);

  return {
    weekPlan,
    recipes: allRecipes,
    selectedDate,
    currentMonth,
    isLoading,
    error,
    setSelectedDate,
    setCurrentMonth,
    getStatsForMonth,
    getDayPlan,
    getAISuggestions,
    getRecipeById,
    refreshWeekPlan,
    clearCache,
  };
};
