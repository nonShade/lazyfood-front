import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import IngredientScanner from '../../components/scanner/IngredientScanner';
import { DetectedIngredient } from '../../services/scanner/scannerService';
import { actualizarInventario, obtenerInventario } from '../../services/api/inventoryService';
import { generarSugerenciasSemanalIA, generarRecomendacionesIA } from '../../services/api/plannerService';
import { usePlannerCache } from '../../hooks/usePlannerCache';

export default function ScannerScreen() {
  const router = useRouter();
  const [isUpdatingInventory, setIsUpdatingInventory] = useState(false);
  const { clearCache } = usePlannerCache();

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

      clearCache();

      try {
        try {
          await generarSugerenciasSemanalIA();
        } catch (sugerenciasError: any) {

          if (sugerenciasError.message && sugerenciasError.message.includes('Genera recomendaciones antes')) {
            try {
              await generarRecomendacionesIA();

              await generarSugerenciasSemanalIA();
            } catch (recomendacionesError) {
              throw sugerenciasError;
            }
          } else {
            throw sugerenciasError;
          }
        }
      } catch (generalError) {
        console.warn('Error generando sugerencias IA:', generalError);
      }

      setTimeout(() => {
        router.push({
          pathname: '/inventory',
          params: {
            refresh: 'true',
            scannedUpdate: JSON.stringify(result.detalles),
            plannerRefresh: 'true',
            timestamp: Date.now().toString()
          }
        });
      }, 100);

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
      isUpdatingInventory={isUpdatingInventory}
    />
  );
}
