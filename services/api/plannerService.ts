import { getAuthHeaders } from "./authService";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface MealPlan {
  receta_id?: number;
  receta_nombre?: string;
  es_sugerida?: boolean;
}

interface DayMenu {
  desayuno?: MealPlan;
  almuerzo?: MealPlan;
  cena?: MealPlan;
}

interface WeeklyPlanResponse {
  semana: string; // Fecha de inicio de la semana en formato YYYY-MM-DD
  menus: {
    [date: string]: DayMenu; // Las fechas son las llaves (YYYY-MM-DD)
  };
}

/**
 * Obtiene la planificación semanal del usuario autenticado
 * @param fecha Fecha de inicio de la semana (YYYY-MM-DD). Si no se proporciona, se usa el lunes de la semana actual.
 * @returns Promise con la planificación semanal
 */
export const obtenerPlanificacionSemanal = async (
  fecha?: string,
): Promise<WeeklyPlanResponse> => {
  try {
    const headers = await getAuthHeaders();

    let url = `${API_BASE_URL}/v1/planificador/semana`;
    if (fecha) {
      url += `?fecha=${encodeURIComponent(fecha)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener la planificación semanal",
      );
    }

    const planificacion: WeeklyPlanResponse = await response.json();
    return planificacion;
  } catch (error) {
    throw error;
  }
};

export type { WeeklyPlanResponse, DayMenu, MealPlan };

