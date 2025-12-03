import { getAuthHeaders } from "./authService";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface RecipeIngredient {
  nombre: string;
  cantidad: number;
  unidad: string;
}

interface RecipeStep {
  n: number;
  instruccion: string;
  timer?: number;
}

interface Recipe {
  id: number;
  nombre: string;
  tiempo_preparacion: number;
  calorias: number;
  nivel_dificultad: string;
  emoji: string;
  descripcion?: string;
  ingredientes?: RecipeIngredient[];
  pasos?: RecipeStep[];
}

interface SuggestionResponse {
  recetas: Recipe[];
  total: number;
}

interface HistorialRecomendacion {
  id: number;
  receta_id: number;
  receta_nombre: string;
  fecha_recomendacion: string;
  score: number;
}

interface HistorialResponse {
  usuario_id: number;
  total_recomendaciones: number;
  recomendaciones: HistorialRecomendacion[];
}

interface GenerarPasosResponse {
  receta_id: number;
  pasos: RecipeStep[];
}

export const obtenerSugerenciasRecetas = async (
  cantidad?: number
): Promise<Recipe[]> => {
  try {
    const headers = await getAuthHeaders();

    let url = `${API_BASE_URL}/v1/recetas/sugerencias`;
    if (cantidad !== undefined) {
      url += `?cantidad=${cantidad}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener sugerencias de recetas");
    }

    const recetasRaw: any[] = await response.json();

    const recetas: Recipe[] = recetasRaw.map(r => ({
      id: r.id,
      nombre: r.nombre,
      tiempo_preparacion: r.tiempo || r.tiempo_preparacion || 0,
      calorias: r.calorias || 0,
      nivel_dificultad: typeof r.nivel === 'number'
        ? (r.nivel === 1 ? 'Fácil' : r.nivel === 2 ? 'Medio' : 'Difícil')
        : (r.nivel_dificultad || 'Fácil'),
      emoji: r.emoji || '🍽️',
      ingredientes: r.ingredientes || [],
      descripcion: r.razon
    }));

    return recetas;
  } catch (error) {
    throw error;
  }
};

export const obtenerHistorialRecomendaciones = async (): Promise<HistorialResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/v1/recetas/sugerencias/historial`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener historial de recomendaciones");
    }

    const historial: HistorialResponse = await response.json();
    return historial;
  } catch (error) {
    throw error;
  }
};

export const obtenerDetalleReceta = async (recetaId: number): Promise<Recipe> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/v1/recetas/${recetaId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener detalle de receta");
    }

    const receta: Recipe = await response.json();
    return receta;
  } catch (error) {
    throw error;
  }
};

export const generarPasosReceta = async (
  recetaId: number,
  ingredientes?: RecipeIngredient[]
): Promise<GenerarPasosResponse> => {
  try {
    const headers = await getAuthHeaders();

    const requestBody = ingredientes ? { ingredientes } : {};

    const response = await fetch(`${API_BASE_URL}/v1/recetas/${recetaId}/pasos/generar`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al generar pasos de receta");
    }

    const result: GenerarPasosResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export type {
  GenerarPasosResponse, HistorialRecomendacion,
  HistorialResponse, Recipe,
  RecipeIngredient,
  RecipeStep,
  SuggestionResponse
};

