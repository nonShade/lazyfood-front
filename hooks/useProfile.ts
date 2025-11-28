import { useState, useCallback, useEffect } from 'react';
import {
    obtenerUsuario,
    obtenerPerfilActual,
    actualizarPreferencias,
    type Usuario,
    type ActualizarPreferenciasRequest,
} from '../services/api/userService';

export const useProfile = () => {
    const [profile, setProfile] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Carga el perfil del usuario autenticado actual
     */
    const loadCurrentProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await obtenerPerfilActual();
            setProfile(userData);
            return userData;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar perfil';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Carga el perfil de un usuario específico por ID
     */
    const loadProfile = useCallback(async (userId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await obtenerUsuario(userId);
            setProfile(userData);
            return userData;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar perfil';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Actualiza las preferencias del usuario
     */
    const updatePreferences = useCallback(async (
        userId: number,
        preferencias: ActualizarPreferenciasRequest
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await actualizarPreferencias(userId, preferencias);

            // Recargar el perfil después de actualizar
            await loadProfile(userId);

            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar preferencias';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [loadProfile]);

    /**
     * Limpia el error actual
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Refresca el perfil actual
     */
    const refreshProfile = useCallback(async () => {
        if (profile) {
            return await loadProfile(profile.id);
        }
        return await loadCurrentProfile();
    }, [profile, loadProfile, loadCurrentProfile]);

    // Cargar perfil al montar el componente
    useEffect(() => {
        loadCurrentProfile();
    }, [loadCurrentProfile]);

    return {
        profile,
        isLoading,
        error,
        loadCurrentProfile,
        loadProfile,
        updatePreferences,
        refreshProfile,
        clearError,
    };
};
