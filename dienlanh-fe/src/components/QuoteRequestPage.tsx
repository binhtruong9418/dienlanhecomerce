import { useState, React } from 'react';
import { ArrowLeft, User, Phone, Mail, Package, Hash, FileText, Send, Shield, CheckCircle, Lock, Award, Upload, X, Loader } from 'lucide-react';
import quoteApi from '../api/quoteApi';
import adminApi from '../api/adminApi';

interface QuoteRequestPageProps {
  onNavigate?: (page: 'home' | 'products') => void;
  selectedProduct?: string;
  selectedProductId?: string;
}

export function QuoteRequestPage({ onNavigate, selectedProduct, selectedProductId }: QuoteRequestPageProps) {
  console.log('🔵 QuoteRequestPage rendered', { selectedProduct, selectedProductId });
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    businessType: '',
    product: selectedProduct || '',
    quantity: '1',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // QUAN TRỌNG: prevent default
    e.stopPropagation(); // Ngăn event bubbling
    
    console.log('🔵 Form submitted with data:', formData);
    console.log('🔵 Selected product ID:', selectedProductId);
    console.log('🔵 Uploaded files:', uploadedFiles);
    
    // Validate
    if (!formData.phone) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    
    if (!formData.email) {
      setError('Vui lòng nhập email');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
          console.log(`Appending ${key}:`, value);
        }
      });

      // Append product ID if available
      if (selectedProductId) {
        formDataToSend.append('productId', selectedProductId);
      }

      // Append files
      uploadedFiles.forEach((file, index) => {
        formDataToSend.append('files', file);
        console.log(`Appending file ${index}:`, file.name);
      });

      console.log('📤 Sending request to API...');
      
      const response = await quoteApi.submitQuoteRequest(formDataToSend);
      console.log('📥 API response:', response);
      
      setSubmitted(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          company: '',
          address: '',
          businessType: '',
          product: '',
          quantity: '1',
          notes: '',
        });
        setUploadedFiles([]);
      }, 3000);
      
    } catch (err: any) {
      console.error('❌ Submit error:', err);
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Header with breadcrumb */}
      <div className="bg-white border-b border-secondary-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => onNavigate?.('products')}
            className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách sản phẩm</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-3">Yêu cầu báo giá</h1>
            <p className="text-secondary-600 text-lg">
              Điền thông tin để nhận báo giá chi tiết từ chuyên viên tư vấn
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-secondary-200 p-8">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {submitted && (
                  <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại trong 24h.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>

                  {/* Phone and Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-secondary-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                          <Phone className="w-5 h-5" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors"
                          placeholder="0901234567"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-secondary-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors"
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Tên công ty
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors"
                      placeholder="Công ty TNHH ABC"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors"
                      placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    />
                  </div>

                  {/* Product */}
                  <div>
                    <label htmlFor="product" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Sản phẩm quan tâm
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                        <Package className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        id="product"
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors"
                        placeholder="Nhập tên sản phẩm bạn quan tâm"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Số lượng <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                        <Hash className="w-5 h-5" />
                      </div>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors"
                        placeholder="1"
                      />
                    </div>
                    <p className="text-sm text-secondary-500 mt-1">
                      Số lượng lớn sẽ được hỗ trợ giá tốt hơn
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors resize-none"
                      placeholder="Yêu cầu bổ sung, thời gian giao hàng mong muốn, địa chỉ lắp đặt..."
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label htmlFor="files" className="block text-sm font-semibold text-secondary-700 mb-2">
                      Tải lên tệp tin
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <input
                        type="file"
                        id="files"
                        name="files"
                        multiple
                        onChange={handleFileChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-600 focus:outline-none transition-colors"
                      />
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-secondary-50 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary-600" />
                              <span className="text-sm text-secondary-600 truncate max-w-[200px]">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || submitted}
                    className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader className="w-6 h-6 animate-spin" />
                    ) : submitted ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        Đã gửi thành công!
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        Gửi yêu cầu báo giá
                      </>
                    )}
                  </button>

                  {/* Privacy Note */}
                  <div className="flex items-start gap-3 bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                    <Lock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-secondary-600">
                      Thông tin của bạn được bảo mật tuyệt đối và chỉ được sử dụng để tư vấn báo giá sản phẩm.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar - Trust Indicators */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4">Liên hệ trực tiếp</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Hotline</p>
                      <p className="font-bold text-lg">1900 xxxx</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Email</p>
                      <p className="font-semibold">sales@company.com</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm opacity-90">Làm việc: 8:00 - 18:00</p>
                  <p className="text-sm opacity-90">Tư vấn 24/7 qua hotline</p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-200">
                <h4 className="font-bold mb-4">Cam kết của chúng tôi</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Bảo mật thông tin</p>
                      <p className="text-xs text-secondary-600">100% an toàn</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Phản hồi nhanh</p>
                      <p className="text-xs text-secondary-600">Trong 2 giờ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Giá tốt nhất</p>
                      <p className="text-xs text-secondary-600">Cam kết cạnh tranh</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-200">
                <h4 className="font-bold mb-4">Khách hàng tin tưởng</h4>
                <div className="space-y-3">
                  <div className="text-center py-3 bg-secondary-50 rounded-lg">
                    <p className="text-3xl font-bold text-primary-600">500+</p>
                    <p className="text-sm text-secondary-600">Dự án hoàn thành</p>
                  </div>
                  <div className="text-center py-3 bg-secondary-50 rounded-lg">
                    <p className="text-3xl font-bold text-primary-600">98%</p>
                    <p className="text-sm text-secondary-600">Khách hàng hài lòng</p>
                  </div>
                  <div className="text-center py-3 bg-secondary-50 rounded-lg">
                    <p className="text-3xl font-bold text-primary-600">24/7</p>
                    <p className="text-sm text-secondary-600">Hỗ trợ kỹ thuật</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}