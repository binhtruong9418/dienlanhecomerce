// Hook for managing image crop modal state — call openCrop(file, onResult) to trigger
import { useState, useCallback, createElement, ReactElement } from 'react';
import { ImageCropModal } from '../components/admin/image-crop-modal';

interface CropSession {
  file: File;
  onResult: (croppedFile: File) => void;
}

interface UseImageCropReturn {
  /** Open the crop modal for a given file. onResult is called with the cropped File on confirm. */
  openCrop: (file: File, onResult: (croppedFile: File) => void) => void;
  /** Render this in your component JSX — null when no crop is active */
  CropModalElement: ReactElement | null;
}

/**
 * Validates file before crop: must be image/* and under 10MB.
 * Returns error message or null if valid.
 */
export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Chỉ chấp nhận file ảnh';
  if (file.size > 10 * 1024 * 1024) return 'Ảnh không được vượt quá 10MB';
  return null;
}

export function useImageCrop(aspectRatio?: number): UseImageCropReturn {
  const [session, setSession] = useState<CropSession | null>(null);

  const openCrop = useCallback((file: File, onResult: (croppedFile: File) => void) => {
    setSession({ file, onResult });
  }, []);

  const handleConfirm = useCallback((croppedFile: File) => {
    if (!session) return;
    session.onResult(croppedFile);
    setSession(null);
  }, [session]);

  const handleCancel = useCallback(() => {
    setSession(null);
  }, []);

  const CropModalElement = session
    ? createElement(ImageCropModal, {
        file: session.file,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
        aspectRatio,
      })
    : null;

  return { openCrop, CropModalElement };
}
