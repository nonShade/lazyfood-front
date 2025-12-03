import { getAuthHeaders } from "./authService";
import { DetectedIngredient } from "../scanner/scannerService";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface UpdateInventoryRequest {
  ingredientes: DetectedIngredient[];
}

interface UpdateInventoryResponse {
  mensaje: string;
  detalles: Array<{
    ingrediente: string;
    ingrediente_id: number;
    cantidad: number;
    emoji: string;
    confianza: number;
    accion: string;
  }>;
}

interface InventoryIngredient {
  id: number;
  cantidad: number;
  confianza: number;
  fecha_actualizacion: string;
  ingrediente: {
    id: number;
    nombre: string;
    categoria: string;
    emoji: string;
    unidad: string;
  };
  bounding_box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface GetInventoryResponse {
  usuario_id: number;
  total_ingredientes: number;
  inventario: InventoryIngredient[];
}

/**
 * Actualiza el inventario del usuario autenticado con los ingredientes detectados
 * @param ingredientes Lista de ingredientes detectados por el scanner
 * @returns Promise con la respuesta de la actualización
 */
export const actualizarInventario = async (
  ingredientes: DetectedIngredient[],
): Promise<UpdateInventoryResponse> => {
  try {
    const headers = await getAuthHeaders();

    const requestBody: UpdateInventoryRequest = {
      ingredientes,
    };

    const response = await fetch(`${API_BASE_URL}/v1/ingredientes`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar el inventario");
    }

    const result: UpdateInventoryResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene el inventario del usuario autenticado
 * @param detalle Si true, devuelve más detalle (opcional)
 * @returns Promise con el inventario del usuario
 */
/**
 * Obtiene el inventario del usuario autenticado
 * @param detalle Si true, devuelve más detalle (opcional)
 * @returns Promise con el inventario del usuario
 */
export const obtenerInventario = async (
  detalle?: boolean,
): Promise<GetInventoryResponse> => {
  try {
    const headers = await getAuthHeaders();

    let url = `${API_BASE_URL}/v1/ingredientes`;
    if (detalle !== undefined) {
      url += `?detalle=${detalle}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener el inventario");
    }

    const inventario: GetInventoryResponse = await response.json();
    return inventario;
  } catch (error) {
    throw error;
  }
};

export type {
  UpdateInventoryRequest,
  UpdateInventoryResponse,
  InventoryIngredient,
  GetInventoryResponse,
};
