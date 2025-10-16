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

export interface PlannerStats {
  totalCookingDays: number;
  totalRecipes: number;
  averageCaloriesPerDay: number;
  mostUsedDifficulty: string;
}