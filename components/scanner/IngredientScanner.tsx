import { Feather } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface IngredientScannerProps {
  onBack?: () => void;
  onConfirm?: (ingredients: string[]) => void;
}

const MOCK_DETECTED_INGREDIENTS = [
  "Tomate",
  "Ajo",
  "Cebolla",
  "Aceite de oliva",
  "Pasta",
  "Queso parmesano"
];

const FLOATING_BADGES = [
  { emoji: "🍅", text: "Tomate", style: { top: 8, left: 8 } },
  { emoji: "🧄", text: "Ajo", style: { top: 20, right: 12 } },
  { emoji: "🧅", text: "Cebolla", style: { bottom: 16, left: 12 } }
];

const IngredientScanner: React.FC<IngredientScannerProps> = ({
  onBack,
  onConfirm
}) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const scanButtonScale = useRef(new Animated.Value(1)).current;

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Necesitamos acceso a la cámara</Text>
          <Text style={styles.permissionSubtext}>Para escanear los ingredientes en tiempo real</Text>
          <Button onPress={requestPermission} style={styles.permissionButton}>
            Permitir acceso a la cámara
          </Button>
        </View>
      </View>
    );
  }

  const handleScan = async () => {
    setIsScanning(true);

    Animated.sequence([
      Animated.timing(scanButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scanButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setDetectedIngredients(MOCK_DETECTED_INGREDIENTS);
      setShowResults(true);
      setIsScanning(false);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 2000);
  };

  const handleConfirm = () => {
    onConfirm?.(detectedIngredients);
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Escanear ingredientes</Text>

        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Feather name="rotate-cw" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              {isScanning && FLOATING_BADGES.map((badge, index) => (
                <View
                  key={index}
                  style={[styles.floatingBadge, badge.style]}
                >
                  <Badge variant="primary">
                    {badge.emoji} {badge.text}
                  </Badge>
                </View>
              ))}
            </View>
          </View>
        </CameraView>

        <View style={styles.instructionsContainer}>
          <Animated.View style={[styles.scanButtonContainer, { transform: [{ scale: scanButtonScale }] }]}>
            <TouchableOpacity
              style={[styles.scanButton, isScanning && styles.scanButtonActive]}
              onPress={handleScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <View style={styles.scanningIndicator}>
                  <Feather name="loader" size={32} color="#FFFFFF" />
                  <Text style={styles.scanButtonText}>Escaneando...</Text>
                </View>
              ) : (
                <View style={styles.scanContent}>
                  <Feather name="camera" size={32} color="#FFFFFF" />
                  <Text style={styles.scanButtonText}>Escanear</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {showResults && (
        <Animated.View style={[styles.bottomPanel, { transform: [{ translateY: slideAnim }] }]}>
          <Card style={styles.panelCard}>
            <Text style={styles.panelTitle}>Ingredientes detectados</Text>

            <View style={styles.ingredientsList}>
              {detectedIngredients.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.ingredientBadge}
                >
                  <Badge variant="primary">
                    {ingredient}
                  </Badge>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                size="lg"
                onPress={handleConfirm}
                style={styles.confirmButton}
              >
                Confirmar ingredientes
              </Button>
            </View>
          </Card>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  permissionSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 32,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 120,
  },
  scanFrame: {
    width: 320,
    height: 320,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    position: 'relative',
  },
  floatingBadge: {
    position: 'absolute',
    zIndex: 1,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionsText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanButtonContainer: {
    alignItems: 'center',
  },
  scanButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonActive: {
    backgroundColor: '#F59E0B',
  },
  scanContent: {
    alignItems: 'center',
  },
  scanningIndicator: {
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  panelCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: 280,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  ingredientBadge: {
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  confirmButton: {
    width: '100%',
  },
  addButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalAddButton: {
    flex: 1,
  },
});

export default IngredientScanner;
