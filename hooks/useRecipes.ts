import { useCallback, useState } from 'react';
import {
    generarPasosReceta,
    obtenerDetalleReceta,
    obtenerHistorialRecomendaciones,
    obtenerSugerenciasRecetas,
    type HistorialRecomendacion,
    type Recipe
} from '../services/api/recipeService';

export const useRecipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
    const [historial, setHistorial] = useState<HistorialRecomendacion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadSuggestions = useCallback(async (cantidad: number = 5) => {
        setIsLoading(true);
        setError(null);
        try {
            const sugerencias = await obtenerSugerenciasRecetas(cantidad);
            setRecipes(sugerencias);
            return sugerencias;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar sugerencias';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadRecipeDetail = useCallback(async (recetaId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const receta = await obtenerDetalleReceta(recetaId);
            setCurrentRecipe(receta);
            return receta;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar receta';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const generateSteps = useCallback(async (recetaId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generarPasosReceta(recetaId);

            if (currentRecipe && currentRecipe.id === recetaId) {
                setCurrentRecipe({
                    ...currentRecipe,
                    pasos: result.pasos,
                });
            }

            return result.pasos;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al generar pasos';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentRecipe]);

    const loadHistorial = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await obtenerHistorialRecomendaciones();
            setHistorial(response.recomendaciones);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar historial';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getRecipeById = useCallback((id: number): Recipe | undefined => {
        return recipes.find(r => r.id === id);
    }, [recipes]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearCurrentRecipe = useCallback(() => {
        setCurrentRecipe(null);
    }, []);

    return {
        recipes,
        currentRecipe,
        historial,
        isLoading,
        error,
        loadSuggestions,
        loadRecipeDetail,
        generateSteps,
        loadHistorial,
        getRecipeById,
        clearError,
        clearCurrentRecipe,
    };
};
