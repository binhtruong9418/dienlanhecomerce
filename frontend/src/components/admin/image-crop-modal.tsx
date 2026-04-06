// Reusable image crop modal — wraps react-image-crop, outputs a canvas-cropped File blob
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export interface ImageCropModalProps {
  /** null = modal closed */
  file: File | null;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
  /** e.g. 1 for square, 16/9 for banner; undefined = free crop */
  aspectRatio?: number;
}

/** Draw the crop region from the source image onto a canvas and return a Blob */
async function cropImageToBlob(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');
  ctx.drawImage(
    image,
    crop.x * scaleX, crop.y * scaleY,
    crop.width * scaleX, crop.height * scaleY,
    0, 0, canvas.width, canvas.height,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('toBlob failed')),
      'image/jpeg',
      0.92,
    );
  });
}

/** Generate a centered initial crop when the image first loads */
function buildInitialCrop(img: HTMLImageElement, aspect?: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, aspect ?? 4 / 3, img.width, img.height),
    img.width,
    img.height,
  );
}

export function ImageCropModal({ file, onConfirm, onCancel, aspectRatio }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  // objectUrl derived from file — managed via useEffect to ensure clean revocation
  const [objectUrl, setObjectUrl] = useState<string>('');
  const [confirming, setConfirming] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Create object URL when file opens; revoke on file change or unmount
  useEffect(() => {
    if (!file) { setObjectUrl(''); return; }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setConfirming(false);
    return () => { URL.revokeObjectURL(url); };
  }, [file]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setCrop(buildInitialCrop(e.currentTarget, aspectRatio));
  }, [aspectRatio]);

  const handleConfirm = async () => {
    if (!imgRef.current || !completedCrop || !file) return;
    setConfirming(true);
    try {
      const blob = await cropImageToBlob(imgRef.current, completedCrop);
      const croppedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
      onConfirm(croppedFile);
    } catch {
      setConfirming(false);
    }
  };

  if (!file) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold">Cắt ảnh</h3>
        <div className="max-h-[60vh] overflow-auto flex justify-center bg-secondary-100 rounded-lg p-2">
          {objectUrl && (
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              aspect={aspectRatio}
              minWidth={20}
              minHeight={20}
            >
              <img
                ref={imgRef}
                src={objectUrl}
                alt="crop preview"
                onLoad={handleImageLoad}
                className="max-h-[55vh] object-contain"
              />
            </ReactCrop>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border-2 border-secondary-200 rounded-lg font-semibold text-secondary-700 hover:bg-secondary-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirming || !completedCrop?.width}
            className="px-5 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {confirming ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
}
