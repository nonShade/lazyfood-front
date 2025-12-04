import { Feather } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useImageUpload } from "../../hooks/useImageUpload";
import { DetectedIngredient } from "../../services/scanner/scannerService";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";

interface IngredientScannerProps {
  onBack?: () => void;
  onConfirm?: (ingredients: DetectedIngredient[]) => void;
  isUpdatingInventory?: boolean;
}

const IngredientScanner: React.FC<IngredientScannerProps> = ({
  onBack,
  onConfirm,
  isUpdatingInventory = false,
}) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [detectedIngredients, setDetectedIngredients] = useState<
    DetectedIngredient[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [containerLayout, setContainerLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const { upload, isUploading, error, setError } = useImageUpload();

  const slideAnim = useRef(new Animated.Value(300)).current;

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Camera access required</Text>
          <Text style={styles.permissionSubtext}>
            To scan ingredients in real time
          </Text>
          <Button onPress={requestPermission} style={styles.permissionButton}>
            Allow camera access
          </Button>
        </View>
      </View>
    );
  }

  const handleTakePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== "granted" ||
      mediaPermission.status !== "granted"
    ) {
      alert("Se requieren permisos de cámara y almacenamiento.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      await handleUpload(
        asset.uri,
        asset.fileName || "photo.jpg",
        "image/jpeg"
      );
    }
  };

  const handleUpload = async (
    uri: string,
    fileName: string,
    mimeType: string
  ) => {
    try {
      setUploadedImageUri(uri);
      setError(null);
      const data = await upload(uri, fileName, mimeType);

      if (data.success) {
        if (!data.inventory || data.inventory.length === 0) {
          setError(
            "No se detectaron ingredientes en la imagen. Intenta con otra foto más clara."
          );
          setUploadedImageUri(null); // Limpiar la imagen
          return;
        }

        setDetectedIngredients(data.inventory);
        setImageDimensions(data.image_dimensions || null);
        setShowResults(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
    } finally {
      setDragOver(false);
    }
  };

  const handlePickFile = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const uri = URL.createObjectURL(file);
          await handleUpload(uri, file.name, file.type);
        }
      };
      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await handleUpload(
          asset.uri,
          asset.fileName || "upload.jpg",
          "image/jpeg"
        );
      }
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = async (e: any) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const uri = URL.createObjectURL(file);
      await handleUpload(uri, file.name, file.type);
    }
  };

  const handleConfirm = () => {
    onConfirm?.(detectedIngredients);
  };

  const handleReset = () => {
    setShowResults(false);
    setUploadedImageUri(null);
    setDetectedIngredients([]);
    setError(null);
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const getBoundingBoxStyle = (bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    if (!containerLayout || !imageDimensions) return {};

    const scaleX = containerLayout.width / imageDimensions.width;
    const scaleY = containerLayout.height / imageDimensions.height;
    const scale = Math.min(scaleX, scaleY);

    const scaledWidth = imageDimensions.width * scale;
    const scaledHeight = imageDimensions.height * scale;

    const offsetX = (containerLayout.width - scaledWidth) / 2;
    const offsetY = (containerLayout.height - scaledHeight) / 2;

    const left = offsetX + (bbox.x - bbox.width / 2) * scaledWidth;
    const top = offsetY + (bbox.y - bbox.height / 2) * scaledHeight;
    const width = bbox.width * scaledWidth;
    const height = bbox.height * scaledHeight;

    return {
      position: "absolute" as const,
      left,
      top,
      width,
      height,
      borderWidth: 3,
      borderColor: "#fbbf24",
      borderRadius: 8,
      backgroundColor: "rgba(251, 191, 36, 0.1)",
    };
  };

  const translateYImage = slideAnim.interpolate({
    inputRange: [0, 300],
    outputRange: [-150, 0],
    extrapolate: "clamp",
  });

  return (
    <View
      style={styles.container}
      {...(Platform.OS === "web"
        ? {
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
        }
        : {})}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Escanear Ingredientes</Text>

        <View style={{ width: 30 }} />
      </View>

      <View
        style={styles.cameraContainer}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setContainerLayout({ width, height });
        }}
      >
        {uploadedImageUri ? (
          <Animated.View
            style={[
              styles.imagePreviewContainer,
              { transform: [{ translateY: translateYImage }] },
            ]}
          >
            <Image
              source={{ uri: uploadedImageUri }}
              style={styles.imagePreview}
              resizeMode="contain"
            />
            {detectedIngredients.map((ingredient, index) =>
              ingredient.bounding_box ? (
                <View
                  key={index}
                  style={{
                    ...getBoundingBoxStyle(ingredient.bounding_box),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>
                      {ingredient.emoji}{" "}
                      {capitalize(ingredient.name.split(" ")[0])}
                    </Text>
                  </View>
                </View>
              ) : null
            )}
          </Animated.View>
        ) : (
          <CameraView style={styles.camera} facing={facing}>
            {Platform.OS === "web" && (
              <View
                style={[styles.dropZone, dragOver && styles.dropZoneActive]}
              >
                <Text style={styles.dropText}>
                  {isUploading
                    ? "Uploading..."
                    : dragOver
                      ? "Drop your image here!"
                      : "Drag & drop an image or click below to upload"}
                </Text>
                <Button onPress={handlePickFile} disabled={isUploading}>
                  {isUploading ? "Processing..." : "Upload Image"}
                </Button>
              </View>
            )}
          </CameraView>
        )}
      </View>

      {!uploadedImageUri && Platform.OS !== "web" && (
        <View style={styles.uploadButtonContainer}>
          <Button
            onPress={handleTakePhoto}
            disabled={isUploading}
            size="lg"
            style={{ marginBottom: 10 }}
          >
            {isUploading ? "Procesando..." : "Tomar una Foto"}
          </Button>

          <Button onPress={handlePickFile} disabled={isUploading} size="lg">
            {isUploading ? "Procesando..." : "Elegir de la Galería"}
          </Button>
        </View>
      )}

      {showResults && (
        <Animated.View
          style={[
            styles.bottomPanel,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Card style={styles.panelCard}>
            <Text style={styles.panelTitle}>
              Ingredientes detectados ({detectedIngredients.length})
            </Text>

            <View style={styles.ingredientsList}>
              {detectedIngredients.map((ingredient, index) => (
                <Badge key={index} variant="primary">
                  {ingredient.emoji} {capitalize(ingredient.name.split(" ")[0])}{" "}
                  ({ingredient.quantity} {ingredient.unit})
                </Badge>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                size="lg"
                onPress={handleConfirm}
                style={styles.confirmButton}
                disabled={isUpdatingInventory}
              >
                {isUpdatingInventory ? "Guardando..." : "Confirmar"}
              </Button>

              <Text onPress={handleReset} style={styles.resetText}>
                Realizar otro análisis
              </Text>
            </View>
          </Card>
        </Animated.View>
      )}

      {(isUploading || error || isUpdatingInventory) && (
        <View style={error ? styles.overlayError : styles.overlay}>
          {(isUploading || isUpdatingInventory) && !error && (
            <>
              <ActivityIndicator size="large" color="#fbbf24" />
              <Text style={styles.overlayText}>
                {isUpdatingInventory ? "Guardando ingredientes..." : "Analizando imagen..."}
              </Text>
            </>
          )}

          {error && (
            <>
              <Text style={styles.overlayText}>{error}</Text>
              <Button onPress={handleReset}>Reintentar</Button>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  permissionSubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  permissionButton: { paddingHorizontal: 32 },
  cameraContainer: { flex: 1, position: "relative" },
  camera: { flex: 1 },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  labelContainer: {
    position: "absolute",
    top: -28,
    left: 0,
    backgroundColor: "#fbbf24",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  labelText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  dropZone: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 20,
  },
  dropZoneActive: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "#fbbf24",
  },
  dropText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  uploadButtonContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
  },
  bottomPanel: { position: "absolute", bottom: 0, left: 0, right: 0 },
  panelCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 280,
  },
  panelTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  ingredientsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  buttonContainer: { gap: 12 },
  confirmButton: { width: "100%" },
  resetText: {
    color: "#000000",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  overlayError: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.99)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  overlayText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
});

export default IngredientScanner;
