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
    preferencias: ActualizarPreferenciasRequest
): Promise<ActualizarPreferenciasResponse> => {
    try {
        const headers = await getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/v1/usuarios/preferencias?userId=${userId}`, {
            method: "PUT",
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(preferencias),
        });

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
        const { getUserData } = await import('./authService');
        const userData = await getUserData();

        if (!userData) {
            return null;
        }
        return await obtenerUsuario(userData.id);
    } catch (error) {
        console.error('Error obteniendo perfil actual:', error);
        throw error;
    }
};

export type {
    ActualizarPreferenciasRequest,
    ActualizarPreferenciasResponse, Preferencias, Usuario, UsuarioResponse
};

