// src/hooks/useImageUpload.ts

import { useState } from 'react';
import { ApiResponse, uploadImageToML } from '../services/scanner/scannerService';

export function useImageUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ApiResponse | null>(null);

    const upload = async (uri: string, fileName: string, mimeType: string) => {
        setIsUploading(true);
        setError(null);
        try {
            const result = await uploadImageToML(uri, fileName, mimeType);
            setData(result);
            return result;
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    return { upload, isUploading, error, data, setError, setData };
}
