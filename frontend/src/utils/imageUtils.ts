// utils/imageUtils.ts
import React from 'react';

// SVG data URI - không phụ thuộc external service, không gây loop lỗi
const makePlaceholderSVG = (text: string, w = 300, h = 300) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="100%" height="100%" fill="#f1f5f9"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="sans-serif" font-size="14" fill="#94a3b8">${text}</text>
    </svg>`
  )}`;

export const FALLBACK_IMAGES = {
  product: makePlaceholderSVG('Không có ảnh', 300, 300),
  category: makePlaceholderSVG('Danh mục', 200, 200),
  qr: makePlaceholderSVG('QR Code', 200, 200),
};

export const getSafeImageUrl = (url?: string, fallback?: string): string => {
  if (!url) return fallback || FALLBACK_IMAGES.product;
  try {
    new URL(url);
    return url;
  } catch {
    return fallback || FALLBACK_IMAGES.product;
  }
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallback?: string) => {
  const img = event.currentTarget;
  img.onerror = null; // Ngăn loop vô hạn TRƯỚC khi đổi src
  img.src = fallback || FALLBACK_IMAGES.product;
};