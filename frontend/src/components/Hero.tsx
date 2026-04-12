import { ArrowRight } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const HERO_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1766788467067-d443f19314b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwYWlyJTIwY29uZGl0aW9uZXIlMjBmYWN0b3J5fGVufDF8fHx8MTc2ODM2MDM5MXww&ixlib=rb-4.1.0&q=80&w=1080';
const HERO_FALLBACK_TITLE = 'Giải pháp làm mát công nghiệp hiệu quả';
const HERO_FALLBACK_DESC = 'Cung cấp điều hòa cây và quạt điều hòa chất lượng cao cho nhà xưởng, văn phòng và không gian thương mại. Công suất lớn, tiết kiệm điện, bảo hành chính hãng.';

export function Hero() {
  const { companyInfo } = useSettings();
  const imageUrl = companyInfo?.bannerImageUrl || HERO_FALLBACK_IMAGE;
  const title = companyInfo?.bannerText || HERO_FALLBACK_TITLE;
  const description = companyInfo?.bannerSubtext || HERO_FALLBACK_DESC;

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image - Fullscreen */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt="Banner trang chủ"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative container mx-auto px-4 py-20 md:py-32 min-h-screen flex items-center">
        <div className="max-w-3xl w-full">
          {/* Badge pill */}
          <div className="inline-block bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg whitespace-nowrap" style={{ color: '#ffffff' }}>
            🏭 Giải pháp làm mát công nghiệp
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ color: '#ffffff' }}>
            {title}
          </h1>

          {/* Body copy */}
          <p className="text-base sm:text-xl md:text-2xl mb-8 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ color: '#ffffff' }}>
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#products" className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              Xem sản phẩm
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#quote" className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg" style={{ color: '#ffffff' }}>
              Yêu cầu báo giá
            </a>
          </div>

          {/* Stats Card */}
          <div className="mt-12 w-full sm:w-auto sm:inline-block bg-white text-secondary-800 p-4 sm:p-6 rounded-xl shadow-2xl">
            <div className="text-3xl sm:text-4xl font-bold text-primary-600">500+</div>
            <div className="text-sm text-secondary-600">Dự án hoàn thành</div>
          </div>
        </div>
      </div>
    </section>
  );
}
