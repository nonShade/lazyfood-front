export interface Recipe {
  id: number;
  name: string;
  time: number;
  calories: number;
  difficulty: string;
  icon: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
}

export interface PlannedMeal {
  receta_id?: number;
  receta_nombre?: string;
  es_sugerida?: boolean;
}

export interface DayPlan {
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
}

export interface WeekPlan {
  userId: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
}

export interface WeeklyAPIResponse {
  semana: string;
  menus: {
    [date: string]: {
      desayuno?: PlannedMeal;
      almuerzo?: PlannedMeal;
      cena?: PlannedMeal;
    };
  };
}

export interface PlannerStats {
  totalCookingDays: number;
  totalRecipes: number;
  averageCaloriesPerDay: number;
  mostUsedDifficulty: string;
}

