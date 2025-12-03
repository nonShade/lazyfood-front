import { useState, useCallback, useEffect, useRef } from "react";
import {
  WeekPlan,
  PlannerStats,
  DayPlan,
  Recipe,
  WeeklyAPIResponse,
} from "../types/planner";
import {
  obtenerPlanificacionSemanal,
  generarSugerenciasSemanalIA,
  generarRecomendacionesIA,
} from "../services/api/plannerService";
import { usePlannerCache } from "./usePlannerCache";

const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const getCurrentDateAsStart = (date: Date): Date => {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  return current;
};

const createRecipeFromPlannedMeal = (meal: any): Recipe => {
  return {
    id: meal.receta_id || 0,
    name: meal.receta_nombre || "Sin nombre",
    time: 0,
    calories: 0,
    difficulty: "Fácil",
    icon: meal.emoji || "🍽️",
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

  const days: DayPlan[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDateObj);
    currentDate.setDate(startDateObj.getDate() + i);
    const dateString = formatDateForAPI(currentDate);

    const dayMenu = apiResponse.menus[dateString];
    const dayPlan: DayPlan = { date: dateString };

    if (dayMenu) {
      if (dayMenu.desayuno?.receta_id) {
        dayPlan.breakfast = createRecipeFromPlannedMeal(dayMenu.desayuno);
      }
      if (dayMenu.almuerzo?.receta_id) {
        dayPlan.lunch = createRecipeFromPlannedMeal(dayMenu.almuerzo);
      }
      if (dayMenu.cena?.receta_id) {
        dayPlan.dinner = createRecipeFromPlannedMeal(dayMenu.cena);
      }
    }

    days.push(dayPlan);
  }

  const endDate = new Date(startDateObj);
  endDate.setDate(startDateObj.getDate() + 6);

  return {
    userId,
    startDate: formatDateForAPI(startDateObj),
    endDate: formatDateForAPI(endDate),
    days,
  };
};

const extractRecipesFromWeekPlan = (weekPlan: WeekPlan): Recipe[] => {
  const recipes: Recipe[] = [];

  weekPlan.days.forEach((day) => {
    if (day.breakfast) recipes.push(day.breakfast);
    if (day.lunch) recipes.push(day.lunch);
    if (day.dinner) recipes.push(day.dinner);
  });

  return recipes.filter(
    (recipe, index, arr) => arr.findIndex((r) => r.id === recipe.id) === index,
  );
};

const convertAPIRecipesToInternal = (apiRecipes: any[]): Recipe[] => {
  return apiRecipes.map((recipe: any) => ({
    id: recipe.id || Math.random(),
    name: recipe.name || recipe.titulo || "Sin nombre",
    time: recipe.tiempo_preparacion || 30,
    calories: recipe.calorias || 300,
    difficulty: recipe.dificultad || "Medio",
    icon: recipe.emoji || "🍽️",
    description: recipe.descripcion || "",
    ingredients: recipe.ingredientes || [],
    instructions: recipe.instrucciones || [],
  }));
};

const generatePlanningIfNeeded = async (
  fechaAPI: string,
): Promise<WeeklyAPIResponse | null> => {
  try {
    return await obtenerPlanificacionSemanal(fechaAPI);
  } catch {
    try {
      await generarSugerenciasSemanalIA();
      return await obtenerPlanificacionSemanal(fechaAPI);
    } catch (sugerenciasError: any) {
      if (sugerenciasError.message?.includes("Genera recomendaciones antes")) {
        try {
          await generarRecomendacionesIA();
          await generarSugerenciasSemanalIA();
          return await obtenerPlanificacionSemanal(fechaAPI);
        } catch (recomendacionesError) {
          console.error(
            "Error generando recomendaciones base:",
            recomendacionesError,
          );
          return null;
        }
      } else {
        console.error("Error generando sugerencias IA:", sugerenciasError);
        return null;
      }
    }
  }
};

const handleEmptyPlanning = async (
  apiResponse: WeeklyAPIResponse,
  fechaAPI: string,
): Promise<WeeklyAPIResponse> => {
  if (apiResponse.menus && Object.keys(apiResponse.menus).length > 0) {
    return apiResponse;
  }

  try {
    await generarSugerenciasSemanalIA();
    return await obtenerPlanificacionSemanal(fechaAPI);
  } catch (autoGenerateError: any) {
    if (autoGenerateError.message?.includes("Genera recomendaciones antes")) {
      try {
        await generarRecomendacionesIA();
        await generarSugerenciasSemanalIA();
        return await obtenerPlanificacionSemanal(fechaAPI);
      } catch {
        return apiResponse; // Devuelve vacío si no se pudo generar
      }
    }
  }

  return apiResponse;
};

const loadBaseRecipesIfNeeded = async (
  recipes: Recipe[],
): Promise<Recipe[]> => {
  if (recipes.length > 0) {
    return recipes;
  }

  try {
    const baseRecipes = await generarRecomendacionesIA();
    if (baseRecipes?.length > 0) {
      const convertedBaseRecipes = convertAPIRecipesToInternal(baseRecipes);
      return [...recipes, ...convertedBaseRecipes];
    }
  } catch (baseRecipesError) {
    console.error("Error cargando recetas base:", baseRecipesError);
  }

  return recipes;
};

export const usePlanner = (userId: string) => {
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  const { getCachedPlan, setCachedPlan, clearCacheForUser } = usePlannerCache();
  const loadingRef = useRef(false);
  const timeoutRef = useRef<any>(null);
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
            const currentAsStart = getCurrentDateAsStart(targetDate);
            const fechaAPI = formatDateForAPI(currentAsStart);
            const requestId = `${fechaAPI}-${userId}`;

            currentRequestRef.current = requestId;

            const cachedData = getCachedPlan(requestId);
            if (cachedData) {
              setWeekPlan(cachedData.weekPlan);
              const extractedRecipes = extractRecipesFromWeekPlan(
                cachedData.weekPlan,
              );
              setAllRecipes(extractedRecipes);
              setError(null);
              resolve();
              return;
            }

            setIsLoading(true);
            setError(null);
            loadingRef.current = true;

            let apiResponse = await generatePlanningIfNeeded(fechaAPI);

            if (!apiResponse) {
              throw new Error("No se pudo obtener o generar planificación");
            }

            apiResponse = await handleEmptyPlanning(apiResponse, fechaAPI);

            if (currentRequestRef.current !== requestId) {
              resolve();
              return;
            }

            const convertedWeekPlan = convertAPIResponseToWeekPlan(
              apiResponse,
              userId,
            );
            setCachedPlan(requestId, apiResponse, convertedWeekPlan);
            setWeekPlan(convertedWeekPlan);

            let extractedRecipes =
              extractRecipesFromWeekPlan(convertedWeekPlan);
            extractedRecipes = await loadBaseRecipesIfNeeded(extractedRecipes);
            setAllRecipes(extractedRecipes);
          } catch (err) {
            console.error("Error loading week plan:", err);

            const requestId = `${formatDateForAPI(getCurrentDateAsStart(date || selectedDate))}-${userId}`;
            if (currentRequestRef.current === requestId) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Error al cargar la planificación",
              );
            }
          } finally {
            loadingRef.current = false;
            setIsLoading(false);
            resolve();
          }
        }, 300); // Debounce de 300ms
      });
    },
    [userId, selectedDate, getCachedPlan, setCachedPlan],
  );

  useEffect(() => {
    loadWeekPlan(new Date());

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      loadingRef.current = false;
    };
  }, []); // Solo ejecutar una vez al montar

  useEffect(() => {
    const today = new Date();
    const currentTodayString = formatDateForAPI(today);

    if (weekPlan) {
      const startDate = new Date(weekPlan.startDate);
      const endDate = new Date(weekPlan.endDate);
      const todayDate = new Date(currentTodayString);

      const isWithinRange = todayDate >= startDate && todayDate <= endDate;

      if (!isWithinRange) {
        loadWeekPlan(today);
      }
    } else {
      loadWeekPlan(today);
    }
  }, [weekPlan, loadWeekPlan]);

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

      const mealKeywords = {
        breakfast: ["desayuno", "toast", "huevo", "smoothie"],
        lunch: ["almuerzo", "ensalada", "pasta", "sofrito"],
        dinner: ["cena", "pollo", "salmón", "curry"],
      };

      const keywords = mealKeywords[mealType] || [];

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
    clearCacheForUser(userId);
    loadWeekPlan(selectedDate);
  }, [loadWeekPlan, selectedDate, userId, clearCacheForUser]);

  const clearCache = useCallback(() => {
    clearCacheForUser(userId);
  }, [clearCacheForUser, userId]);

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
