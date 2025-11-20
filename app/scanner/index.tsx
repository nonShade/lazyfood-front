import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import IngredientScanner from '../../components/scanner/IngredientScanner';
import { DetectedIngredient } from '../../services/scanner/scannerService';
import { actualizarInventario } from '../../services/api/inventoryService';

export default function ScannerScreen() {
  const router = useRouter();
  const [isUpdatingInventory, setIsUpdatingInventory] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = async (ingredients: DetectedIngredient[]) => {
    if (!ingredients || ingredients.length === 0) {
      Alert.alert('Error', 'No hay ingredientes para guardar en el inventario.');
      return;
    }

    setIsUpdatingInventory(true);

    try {
      // Actualizar inventario con los ingredientes detectados
      const result = await actualizarInventario(ingredients);

      Alert.alert(
        'Inventario actualizado',
        `${result.detalles.length} ingredientes agregados exitosamente.`,
        [
          {
            text: 'Ver inventario',
            onPress: () => {
              router.push({
                pathname: '/inventory',
                params: { refresh: 'true' }
              });
            },
          },
        ]
      );

    } catch (error: any) {
      console.error('Error actualizando inventario:', error);
      Alert.alert(
        'Error al guardar',
        error.message || 'No se pudo actualizar el inventario. Intenta de nuevo.',
        [
          { text: 'Reintentar', onPress: () => handleConfirm(ingredients) },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } finally {
      setIsUpdatingInventory(false);
    }
  };

  return (
    <IngredientScanner
      onBack={handleBack}
      onConfirm={handleConfirm}
    />
  );
}
