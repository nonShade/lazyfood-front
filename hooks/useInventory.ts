import { useCallback, useEffect, useState } from "react";
import {
  actualizarInventario,
  InventoryIngredient,
  obtenerInventario,
} from "../services/api/inventoryService";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  category: string;
  icon: string;
}

export const useInventory = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para convertir de la respuesta API al formato esperado por los componentes
  const transformApiIngredient = (
    apiIngredient: InventoryIngredient,
  ): Ingredient => ({
    id: apiIngredient.id.toString(),
    name: apiIngredient.ingrediente.nombre,
    quantity: apiIngredient.cantidad,
    category: apiIngredient.ingrediente.categoria || "Sin categoría",
    icon: apiIngredient.ingrediente.emoji || "🥫",
  });

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await obtenerInventario();
      const transformedIngredients = response.inventario.map(
        transformApiIngredient,
      );
      setIngredients(transformedIngredients);
    } catch (err: any) {
      console.error("Error cargando inventario:", err);
      setError(err.message || "Error al cargar el inventario");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const refreshInventory = useCallback(() => {
    return loadInventory();
  }, []);

  const addIngredients = async (newIngredients: Ingredient[]) => {
    try {
      setIsLoading(true);
      const apiIngredients = newIngredients.map(ing => ({
        id: ing.id || ing.name,
        name: ing.name,
        quantity: ing.quantity,
        unit: 'unidades',
        confidence: 1.0,
        emoji: ing.icon,
        category: ing.category,
        state: 'good'
      }));

      await actualizarInventario(apiIngredients);
      await loadInventory();
    } catch (err: any) {
      console.error("Error adding ingredients:", err);
      setError(err.message || "Error al agregar ingredientes");
      setIsLoading(false);
    }
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === updatedIngredient.id ? updatedIngredient : ing,
      ),
    );
  };

  const deleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  return {
    ingredients,
    isLoading,
    error,
    refreshInventory,
    addIngredients,
    updateIngredient,
    deleteIngredient,
  };
};
