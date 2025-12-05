import { Platform } from "react-native";
import { getAccessToken } from "../api/authService";

const ML_API_URL = process.env.EXPO_PUBLIC_ML_API_URL;

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedIngredient {
  id: string;
  name: string;
  emoji: string;
  category: string;
  quantity: number;
  unit: string;
  state: string;
  confidence: number;
  bounding_box?: BoundingBox;
}

export interface ApiResponse {
  success: boolean;
  total_items: number;
  detected_at: string;
  inventory: DetectedIngredient[];
  categories: Record<string, DetectedIngredient[]>;
  raw_detection?: string;
  image_dimensions?: { width: number; height: number };
}

/**
 * Sube una imagen al servicio ML y devuelve los ingredientes detectados
 */
export async function uploadImageToML(
  uri: string,
  fileName: string,
  mimeType: string,
): Promise<ApiResponse> {
  const formData = new FormData();

  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append("file", blob, fileName);
  } else {
    formData.append("file", {
      uri,
      name: fileName,
      type: mimeType,
    } as any);
  }

  const token = await getAccessToken();

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${ML_API_URL}/api/v1/detect-inventory`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return await response.json();
}
