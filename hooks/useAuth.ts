import { useState, useEffect } from 'react';
import { 
  login as loginService, 
  logout as logoutService, 
  isLoggedIn, 
  getUserData,
  getAccessToken 
} from '../services/api/authService';

interface User {
  email: string;
  id: number;
  nombre: string;
  rol: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Verificar el estado de autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        const userData = await getUserData();
        const accessToken = await getAccessToken();
        setUser(userData);
        setToken(accessToken);
      }
    } catch (error) {
      console.error('Error verificando estado de autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const response = await loginService(data);
      setUser(response.user);
      setToken(response.access_token);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error al hacer logout:', error);
      throw error;
    }
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    refreshAuthStatus: checkAuthStatus,
  };
};