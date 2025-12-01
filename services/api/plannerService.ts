import { getAuthHeaders } from "./authService";
import type { AISuggestionsResponse } from "../../types/planner";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface MealPlan {
  receta_id?: number;
  receta_nombre?: string;
  es_sugerida?: boolean;
  emoji?: string;
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

  return await response.json();
};

export const generarSugerenciasSemanalIA =
  async (): Promise<AISuggestionsResponse> => {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${API_BASE_URL}/v1/planificador/semana/sugerencias`,
      {
        method: "POST",
        headers,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Error al generar sugerencias semanales",
      );
    }

    return await response.json();
  };

export const generarRecomendacionesIA = async (
  cantidad: number = 10,
): Promise<any[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/v1/recetas/sugerencias?cantidad=${cantidad}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Error al obtener recomendaciones de recetas",
    );
  }

  return await response.json();
};

const needsBaseRecommendations = (error: Error): boolean => {
  return Boolean(
    error.message &&
      (error.message.includes("Genera recomendaciones antes") ||
        error.message.includes("No hay recetas sugeridas")),
  );
};

export const generarSugerenciasCompletas =
  async (): Promise<AISuggestionsResponse> => {
    try {
      return await generarSugerenciasSemanalIA();
    } catch (error: any) {
      if (needsBaseRecommendations(error)) {
        try {
          await generarRecomendacionesIA();
          return await generarSugerenciasSemanalIA();
        } catch (recomendacionesError: any) {
          console.error(
            "Error en el flujo completo de recomendaciones:",
            recomendacionesError.message,
          );
          throw new Error(
            `Error generando recomendaciones: ${recomendacionesError.message}`,
          );
        }
      } else {
        throw error;
      }
    }
  };

export type { WeeklyPlanResponse, DayMenu, MealPlan };

