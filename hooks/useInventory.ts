import { useState } from 'react';

interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    category: string;
    icon: string;
}

export const useInventory = (userId: string) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: '1', name: 'Tomate', quantity: 5, category: 'Frutas y Verduras', icon: '🍅' },
        { id: '2', name: 'Ajo', quantity: 1, category: 'Frutas y Verduras', icon: '🧄' },
        { id: '3', name: 'Cebolla', quantity: 2, category: 'Frutas y Verduras', icon: '🧅' },
    ]);

    const addIngredients = (newIngredients: Ingredient[]) => {
        setIngredients((prev) => {
            const updated = [...prev];

            newIngredients.forEach((newIng) => {
                const existingIndex = updated.findIndex((ing) => ing.id === newIng.id);
                if (existingIndex >= 0) {
                    updated[existingIndex].quantity += newIng.quantity;
                } else {
                    updated.push(newIng);
                }
            });

            return updated;
        });
    };

    const updateIngredient = (updatedIngredient: Ingredient) => {
        setIngredients((prev) =>
            prev.map((ing) => (ing.id === updatedIngredient.id ? updatedIngredient : ing))
        );
    };

    const deleteIngredient = (id: string) => {
        setIngredients((prev) => prev.filter((ing) => ing.id !== id));
    };

    return {
        ingredients,
        addIngredients,
        updateIngredient,
        deleteIngredient,
    };
};