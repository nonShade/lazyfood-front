import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

interface RegistroRequest {
  email: string;
  nombre: string;
  pais: string;
  password: string;
  metas_nutricionales?: string; // Opcional - backend asigna "ninguna" por defecto
  nivel_cocina?: number; // Opcional - backend asigna 1 por defecto
  preferencias?: {
    alergias?: string[];
    dieta?: string;
    gustos?: string[];
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  expires_in: number;
  message: string;
  refresh_token: string;
  token_type: string;
  user: {
    email: string;
    id: number;
    nombre: string;
    rol: string;
  };
}

// Constantes para las llaves del storage
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";

export const registrarUsuario = async (data: RegistroRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/usuarios/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar usuario");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Función para hacer login
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    const loginResponse: LoginResponse = await response.json();

    // Guardar tokens y datos del usuario en AsyncStorage
    await saveTokens(loginResponse.access_token, loginResponse.refresh_token);
    await saveUserData(loginResponse.user);

    return loginResponse;
  } catch (error) {
    throw error;
  }
};

// Solicitar recuperación de contraseña (enviar email con instrucciones)
export const requestPasswordReset = async (payload: { email: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/usuarios/recuperar-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Error al solicitar recuperación de contraseña');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Funciones para manejo de tokens
export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
  } catch (error) {
    console.error("Error guardando tokens:", error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Error obteniendo access token:", error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Error obteniendo refresh token:", error);
    return null;
  }
};

// Funciones para manejo de datos de usuario
export const saveUserData = async (
  userData: LoginResponse["user"],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error guardando datos de usuario:", error);
    throw error;
  }
};

export const getUserData = async (): Promise<LoginResponse["user"] | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error obteniendo datos de usuario:", error);
    return null;
  }
};

// Función para logout (limpiar datos)
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      USER_DATA_KEY,
    ]);
  } catch (error) {
    console.error("Error al hacer logout:", error);
    throw error;
  }
};

// Función para verificar si el usuario está logueado
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const accessToken = await getAccessToken();
    return !!accessToken;
  } catch (error) {
    console.error("Error verificando login:", error);
    return false;
  }
};

// Función helper para hacer requests autenticados
export const getAuthHeaders = async () => {
  const token = await getAccessToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};
