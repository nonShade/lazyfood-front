import { useRouter } from 'expo-router';
import IngredientScanner from '../../components/scanner/IngredientScanner';

export default function ScannerScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    router.push('/inventory');
  };

  return (
    <IngredientScanner 
      onBack={handleBack}
      onConfirm={handleConfirm}
    />
  );
}