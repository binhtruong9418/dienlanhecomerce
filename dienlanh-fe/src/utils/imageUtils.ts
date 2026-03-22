// utils/imageUtils.ts
export const FALLBACK_IMAGES = {
    product: 'https://via.placeholder.com/300x300?text=No+Image',
    category: 'https://via.placeholder.com/200x200?text=No+Image',
    qr: 'https://via.placeholder.com/200x200?text=QR+Code',
  };
  
  export const getSafeImageUrl = (url?: string, fallback?: string): string => {
    if (!url) return fallback || FALLBACK_IMAGES.product;
    
    // Kiểm tra URL có hợp lệ không
    try {
      new URL(url);
      return url;
    } catch {
      return fallback || FALLBACK_IMAGES.product;
    }
  };
  
  export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallback?: string) => {
    const img = event.currentTarget;
    img.src = fallback || FALLBACK_IMAGES.product;
    img.onerror = null; // Tránh loop vô hạn
  };