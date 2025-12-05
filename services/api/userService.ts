import { getAuthHeaders } from "./authService";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface Preferencias {
  dieta?: string;
  alergias?: string[];
  gustos?: string[];
}

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  pais?: string;
  nivel_cocina: number;
  metas_nutricionales?: string;
  activo: boolean;
  fecha_creacion: string;
  preferencias?: Preferencias;
}

interface UsuarioResponse {
  usuario: Usuario;
}

interface ActualizarPreferenciasRequest {
  dieta?: string;
  alergias?: string[];
  gustos?: string[];
  nivel_cocina?: number;
  metas_nutricionales?: string;
}

interface ActualizarPreferenciasResponse {
  mensaje: string;
  preferencias?: Preferencias;
  usuario?: {
    nivel_cocina: number;
    metas_nutricionales: string;
  };
}

export const obtenerUsuario = async (userId: number): Promise<Usuario> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/v1/usuarios/${userId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener usuario");
    }

    const data: UsuarioResponse = await response.json();
    return data.usuario;
  } catch (error) {
    throw error;
  }
};

export const actualizarPreferencias = async (
  userId: number,
  preferencias: ActualizarPreferenciasRequest,
): Promise<ActualizarPreferenciasResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${API_BASE_URL}/v1/usuarios/preferencias?userId=${userId}`,
      {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferencias),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar preferencias");
    }

    const result: ActualizarPreferenciasResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const obtenerPerfilActual = async (): Promise<Usuario | null> => {
  try {
    const { getUserData } = await import("./authService");
    const userData = await getUserData();

    if (!userData) {
      return null;
    }
    return await obtenerUsuario(userData.id);
  } catch (error) {
    console.error("Error obteniendo perfil actual:", error);
    throw error;
  }
};

export const updateUserOnboarding = async (onboardingData: {
  cookingLevel: string;
  dietType: string[];
  allergies: string[];
  goals: string[];
}): Promise<ActualizarPreferenciasResponse> => {
  try {
    const { getUserData } = await import("./authService");
    const userData = await getUserData();

    if (!userData) {
      throw new Error("Usuario no encontrado");
    }

    const nivelCocinaPorKey: { [key: string]: number } = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };

    const metasValidasMap: { [key: string]: string } = {
      health: "Mantener salud general",
      "weight-loss": "Bajar de peso",
      muscle: "Aumentar masa muscular",
      energy: "Mejorar energía",
      "cook-more": "Cocinar más en casa",
      "save-money": "Ahorrar dinero",
    };

    let metaNutricional = "ninguna";
    if (onboardingData.goals.length > 0) {
      const primeraMetaValida = onboardingData.goals.find(
        (goal) => metasValidasMap[goal],
      );
      if (primeraMetaValida) {
        metaNutricional = metasValidasMap[primeraMetaValida];
      }
    }

    const request: ActualizarPreferenciasRequest = {
      nivel_cocina: nivelCocinaPorKey[onboardingData.cookingLevel] || 1,
      metas_nutricionales: metaNutricional,
      dieta:
        onboardingData.dietType.length > 0
          ? onboardingData.dietType.join(", ")
          : undefined,
      alergias:
        onboardingData.allergies.filter((a) => a !== "Ninguna").length > 0
          ? onboardingData.allergies.filter((a) => a !== "Ninguna")
          : undefined,
    };

    return await actualizarPreferencias(userData.id, request);
  } catch (error) {
    throw error;
  }
};

export type {
  ActualizarPreferenciasRequest,
  ActualizarPreferenciasResponse,
  Preferencias,
  Usuario,
  UsuarioResponse,
};
