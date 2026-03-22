import { Phone, Mail, MapPin, Facebook, Youtube, Zap } from 'lucide-react';
import { handleImageError, getSafeImageUrl, FALLBACK_IMAGES } from '../utils/imageUtils';

interface FooterProps {
  onNavigate?: (page: 'admin') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="contact" className="bg-secondary-900 text-secondary-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Info + Contact */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div className="font-bold text-xl text-white">DienlanhPRO</div>
            </div>
            
            <h4 className="footer-title text-white font-semibold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Hotline: 1900 xxxx</p>
                  <p className="text-xs">Tư vấn 24/7</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:sales@dienlanhpro.com" className="hover:text-primary-400 transition-colors">
                  sales@dienlanhpro.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Policies */}
          <div>
            <h4 className="footer-title text-white font-semibold mb-4">Chính sách</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Bảo mật thông tin
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: QR Zalo */}
          <div>
            <h4 className="footer-title text-white font-semibold mb-4">Kết nối Zalo</h4>
            <div className="bg-white p-4 rounded-lg inline-block">
              <img 
                src={getSafeImageUrl('https://res.cloudinary.com/dhiczfj7e/image/upload/v1772960520/Screenshot_2026-03-08_at_16.01.53_pbildd.png', FALLBACK_IMAGES.qr)} 
                alt="QR Code Zalo" 
                className="w-32 h-32"
                onError={(e) => handleImageError(e, FALLBACK_IMAGES.qr)}
              />
            </div>
            <p className="text-xs mt-2">Quét mã để chat Zalo</p>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className="footer-title text-white font-semibold mb-4">Theo dõi chúng tôi</h4>
            <div className="space-y-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-primary-400 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span>Facebook</span>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-primary-400 transition-colors"
              >
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Social & Working Hours */}
        <div className="mt-8 pt-8 border-t border-secondary-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            {/* Buttons removed */}
          </div>
          
          <div className="text-sm text-center md:text-right">
            <p className="font-semibold text-white">Giờ làm việc</p>
            <p>Thứ 2 - Thứ 7: 8:00 - 18:00 | Chủ nhật: 8:00 - 12:00</p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-sm text-center">© 2025 DienlanhPRO. All rights reserved.</p>
            {onNavigate && (
              <button 
                onClick={() => onNavigate('admin')} 
                className="text-xs text-secondary-500 hover:text-primary-400 transition-colors"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}