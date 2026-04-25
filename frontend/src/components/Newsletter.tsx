import { Mail, Send } from 'lucide-react';
import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert(`Đã đăng ký nhận tin với email: ${email}`);
    setEmail('');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div className="text-white">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4">
                  <Mail className="w-7 h-7" />
                </div>
                <h2 className="text-white mb-3">Nhận thông tin khuyến mãi</h2>
                <p className="text-primary-100">
                  Đăng ký để nhận thông tin về sản phẩm mới, chương trình khuyến mãi và ưu đãi đặc biệt
                </p>
              </div>

              {/* Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email của bạn"
                      required
                      className="w-full px-6 py-4 rounded-lg bg-white text-secondary-800 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white text-primary-700 px-6 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    Đăng ký ngay
                    <Send className="w-5 h-5" />
                  </button>
                  <p className="text-xs text-primary-200 text-center">
                    Chúng tôi cam kết bảo mật thông tin của bạn
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
