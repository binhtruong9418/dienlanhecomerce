// QuotePage.tsx — Trang yêu cầu báo giá tại /quote
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Send, Phone, Mail, MapPin, Clock, Upload, X, FileText,
  Loader, CheckCircle, User, Package, ChevronRight,
  Shield, Truck, HeadphonesIcon, Award, Lock, Zap,
} from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useSettings } from '../hooks/useSettings';
import quoteApi from '../api/quoteApi';
import { getSafeImageUrl, handleImageError, FALLBACK_IMAGES } from '../utils/imageUtils';

interface QuoteFormData {
  customerName: string;
  phone: string;
  email: string;
  company: string;
  address: string;
  product: string;
  quantity: string;
  notes: string;
}

const EMPTY_FORM: QuoteFormData = {
  customerName: '',
  phone: '',
  email: '',
  company: '',
  address: '',
  product: '',
  quantity: '1',
  notes: '',
};

const BENEFITS = [
  { icon: HeadphonesIcon, title: 'Tư vấn miễn phí', desc: 'Kỹ thuật viên 10+ năm kinh nghiệm hỗ trợ 24/7' },
  { icon: Zap,            title: 'Báo giá trong 2 giờ', desc: 'Chi tiết, rõ ràng, phù hợp từng dự án cụ thể' },
  { icon: Award,          title: 'Giá cạnh tranh nhất', desc: 'Cam kết giá tốt nhất, không qua trung gian' },
  { icon: Shield,         title: 'Hàng chính hãng 100%', desc: 'Bảo hành chính hãng, đầy đủ chứng từ xuất xứ' },
  { icon: Truck,          title: 'Lắp đặt trọn gói', desc: 'Vận chuyển + lắp đặt tận nơi toàn quốc' },
];

// ─── Success screen ─────────────────────────────────────────────────────────
function SuccessScreen({ phone, onReset }: { phone?: string; onReset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Gửi thành công!</h2>
        <p className="text-secondary-600 mb-8 leading-relaxed">
          Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi và gửi báo giá chi tiết trong vòng{' '}
          <strong className="text-secondary-900">2 giờ làm việc</strong>.
        </p>

        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-3 bg-primary-50 hover:bg-primary-100 transition-colors rounded-xl p-4 mb-6"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-secondary-500">Cần tư vấn ngay? Gọi hotline</p>
              <p className="text-lg font-bold text-primary-700">{phone}</p>
            </div>
          </a>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/products"
            className="flex-1 border-2 border-secondary-200 text-secondary-700 py-3 rounded-xl font-semibold hover:border-primary-400 hover:text-primary-600 transition-colors text-center"
          >
            Xem sản phẩm
          </Link>
          <button
            onClick={onReset}
            className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Gửi yêu cầu khác
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export function QuotePage() {
  const location = useLocation();
  const state = (location.state || {}) as { productId?: string; productName?: string };

  const { product } = useProduct(state.productId || '');
  const { companyInfo } = useSettings();

  const [formData, setFormData] = useState<QuoteFormData>({
    ...EMPTY_FORM,
    product: state.productName || '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (product && !formData.product) {
      setFormData(prev => ({ ...prev, product: product.name }));
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (fd: FormData) => quoteApi.submitQuoteRequest(fd),
    onSuccess: () => {
      setSuccess(true);
      setFormData(EMPTY_FORM);
      setUploadedFiles([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setUploadedFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      setError('Vui lòng nhập số điện thoại để chúng tôi có thể liên hệ lại.');
      return;
    }
    setError(null);

    const fd = new FormData();
    fd.append('customerName', formData.customerName || 'Khách hàng');
    fd.append('phone', formData.phone);
    fd.append('email', formData.email || 'khachhang@email.com');
    fd.append('product', formData.product || 'Sản phẩm điện lạnh');
    fd.append('quantity', formData.quantity || '1');
    fd.append('notes', formData.notes || 'Yêu cầu tư vấn từ website');
    fd.append('company', formData.company || 'Khách lẻ');
    fd.append('address', formData.address || 'Việt Nam');
    if (state.productId) fd.append('productId', state.productId);
    uploadedFiles.forEach(f => fd.append('files', f));

    mutation.mutate(fd);
  };

  const isLoading = mutation.isPending;

  if (success) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <PageHeader />
        <SuccessScreen phone={companyInfo?.phone} onReset={() => setSuccess(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <PageHeader />

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ── LEFT: Form (7/12) ──────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-4">

            {/* Product card — show image, name, price only */}
            {product && (
              <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary-50 border border-secondary-100 flex-shrink-0">
                    <img
                      src={getSafeImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                      onError={e => handleImageError(e, FALLBACK_IMAGES.product)}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-secondary-400 mb-1">Sản phẩm yêu cầu báo giá</p>
                    <h3 className="font-semibold text-secondary-900 leading-snug line-clamp-2 text-sm sm:text-base">
                      {product.name}
                    </h3>
                    {product.price > 0 && (
                      <p className="mt-1.5 font-bold text-primary-600">
                        {product.price.toLocaleString('vi-VN')}đ
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm overflow-hidden">

              {/* Error banner */}
              {error && (
                <div className="mx-5 mt-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Step 1 — Contact */}
                <div className="p-5 md:p-7">
                  <StepHeader step={1} title="Thông tin liên hệ" icon={<User className="w-4 h-4" />} />
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    <Field label="Họ và tên">
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Nguyễn Văn A"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Số điện thoại" required>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="0909 xxx xxx"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Email">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="email@example.com"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Công ty / Đơn vị">
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Tên công ty (nếu có)"
                        className={inputCls}
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Địa chỉ lắp đặt">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Step 2 — Product */}
                <div className="p-5 md:p-7 border-t border-secondary-100">
                  <StepHeader step={2} title="Thông tin sản phẩm" icon={<Package className="w-4 h-4" />} />
                  <div className="space-y-3 mt-4">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <Field label="Sản phẩm quan tâm">
                          <input
                            type="text"
                            name="product"
                            value={formData.product}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="Tên sản phẩm hoặc mô tả nhu cầu"
                            className={inputCls}
                          />
                        </Field>
                      </div>
                      <Field label="Số lượng">
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          min="1"
                          disabled={isLoading}
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    <Field label="Ghi chú / Yêu cầu thêm">
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        disabled={isLoading}
                        placeholder="Diện tích không gian, loại môi trường (nhà xưởng / văn phòng / kho bãi), thời gian lắp đặt, ngân sách dự kiến..."
                        className={`${inputCls} resize-none`}
                      />
                    </Field>
                  </div>
                </div>

                {/* Step 3 — Upload + Submit */}
                <div className="p-5 md:p-7 border-t border-secondary-100">
                  <StepHeader step={3} title="Tệp đính kèm & Gửi yêu cầu" icon={<Upload className="w-4 h-4" />} />
                  <div className="mt-4 space-y-4">
                    {/* Upload zone */}
                    <div>
                      <p className="text-xs text-secondary-500 mb-2">
                        Bản vẽ, bảng thông số, ảnh mặt bằng <span className="italic">(không bắt buộc)</span>
                      </p>
                      <input
                        type="file"
                        id="fileInput"
                        name="files"
                        onChange={handleFileChange}
                        multiple
                        disabled={isLoading}
                        className="hidden"
                      />
                      <label
                        htmlFor="fileInput"
                        className={[
                          'flex flex-col items-center justify-center gap-2 w-full',
                          'border-2 border-dashed border-secondary-200 rounded-xl py-6',
                          'text-secondary-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50',
                          'transition-all cursor-pointer',
                          isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
                        ].join(' ')}
                      >
                        <Upload className="w-6 h-6" />
                        <span className="text-sm font-medium">Nhấn để chọn tệp</span>
                        <span className="text-xs">PNG, JPG, PDF, DOCX — tối đa 10MB/tệp</span>
                      </label>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {uploadedFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 bg-secondary-100 px-3 py-2 rounded-lg text-sm">
                              <FileText className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                              <span className="truncate max-w-[130px]">{f.name}</span>
                              {!isLoading && (
                                <button
                                  type="button"
                                  onClick={() => removeFile(i)}
                                  className="text-red-400 hover:text-red-600 flex-shrink-0 p-0.5"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <><Loader className="w-5 h-5 animate-spin" />Đang gửi...</>
                      ) : (
                        <><Send className="w-5 h-5" />Gửi yêu cầu báo giá</>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-secondary-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Thông tin được bảo mật tuyệt đối · Không spam</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* ── RIGHT: Sidebar (5/12) ─────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">

            {/* Phone CTA — most important on mobile too */}
            <a
              href={`tel:${companyInfo?.phone}`}
              className="flex items-center gap-4 bg-primary-600 hover:bg-primary-700 transition-colors rounded-2xl p-5 shadow-md group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-white/80 text-sm">Gọi tư vấn miễn phí ngay</p>
                <p className="text-white font-bold text-xl leading-tight">{companyInfo?.phone || '1900 xxxx'}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60 ml-auto flex-shrink-0" />
            </a>

            {/* Contact details card */}
            <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-5 space-y-2">
              <h3 className="font-bold text-secondary-900 mb-3">Thông tin liên hệ</h3>

              {companyInfo?.email && (
                <ContactRow
                  href={`mailto:${companyInfo.email}`}
                  icon={<Mail className="w-4 h-4 text-primary-600" />}
                  label="Email"
                  value={companyInfo.email}
                />
              )}
              {companyInfo?.address && (
                <ContactRow
                  icon={<MapPin className="w-4 h-4 text-primary-600" />}
                  label="Địa chỉ"
                  value={companyInfo.address}
                />
              )}
              {companyInfo?.workingHours && (
                <ContactRow
                  icon={<Clock className="w-4 h-4 text-primary-600" />}
                  label="Giờ làm việc"
                  value={companyInfo.workingHours}
                />
              )}
            </div>

            {/* Benefits card */}
            <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-5 text-white">
              <h3 className="font-bold text-white mb-4">Tại sao chọn chúng tôi?</h3>
              <div className="space-y-3.5">
                {BENEFITS.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm leading-tight">{title}</p>
                      <p className="text-white/65 text-xs leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            {(companyInfo?.zaloLink || companyInfo?.facebookLink) && (
              <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-5">
                <h3 className="font-bold text-secondary-900 mb-3">Chat nhanh</h3>
                <div className="flex flex-col gap-2">
                  {companyInfo?.facebookLink && (
                    <a
                      href={companyInfo.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      {/* Facebook icon — same SVG as Footer */}
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900 text-sm">Facebook</p>
                        <p className="text-secondary-500 text-xs">Nhắn tin qua fanpage</p>
                      </div>
                    </a>
                  )}
                  {companyInfo?.zaloLink && (
                    <a
                      href={companyInfo.zaloLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors"
                    >
                      {/* Zalo badge — same style as Footer */}
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm">
                        Zalo
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900 text-sm">Zalo</p>
                        <p className="text-secondary-500 text-xs">Phản hồi trong vài phút</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/60 mb-3">
          <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white/90">Yêu cầu báo giá</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Yêu cầu báo giá</h1>
        <p className="text-secondary-900 text-sm sm:text-base max-w-xl mb-5">
          Điền thông tin — đội ngũ kỹ thuật sẽ tư vấn và gửi báo giá chi tiết trong vòng 2 giờ.
        </p>
      </div>
    </div>
  );
}

function StepHeader({ step, title, icon }: { step: number; title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-lg text-sm font-bold flex-shrink-0">
        {step}
      </div>
      <h3 className="font-bold text-secondary-900">{title}</h3>
      <div className="text-secondary-300 ml-auto hidden sm:block">{icon}</div>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-secondary-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function ContactRow({
  href,
  icon,
  label,
  value,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const inner = (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-secondary-400 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-secondary-800 break-words leading-snug">{value}</p>
      </div>
    </div>
  );
  return href
    ? <a href={href} className="block hover:bg-secondary-50 rounded-lg px-1 transition-colors">{inner}</a>
    : <div className="px-1">{inner}</div>;
}


// text-base prevents iOS auto-zoom on input focus (iOS zooms when font-size < 16px)
const inputCls =
  'w-full px-4 py-3 text-base border-2 border-secondary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-secondary-900 placeholder:text-secondary-400 disabled:bg-secondary-50 disabled:text-secondary-400';
