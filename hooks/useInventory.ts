import { useState, useEffect, useCallback } from "react";
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
  unit: string;
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
    unit: apiIngredient.ingrediente.unidad || "disponibles",
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

  const addIngredients = (newIngredients: Ingredient[]) => {
    setIngredients((prev) => {
      const updated = [...prev];

      newIngredients.forEach((newIng) => {
        const existingIndex = updated.findIndex((ing) => ing.id === newIng.id);
        if (existingIndex >= 0) {
          updated[existingIndex].quantity += newIng.quantity;
        } else {
          const ingredientWithUnit: Ingredient = {
            ...newIng,
            unit: newIng.unit || "unidades",
          };
          updated.push(ingredientWithUnit);
        }
      });

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
