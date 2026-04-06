// QuoteSection.tsx
import { Send, Phone, Upload, X, FileText, Loader, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import quoteApi from '../api/quoteApi';
import { useSettings } from '../hooks/useSettings';

export function QuoteSection() {
  const [formData, setFormData] = useState({
    customerName: '', // Để trống, người dùng tự nhập
    phone: '',
    email: '', // Để trống
    product: '', // Để trống
    quantity: '1', // Mặc định 1
    notes: '', // Để trống
    company: '', // Để trống
    address: '', // Để trống
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { companyInfo } = useSettings();
  const mutation = useMutation({
    mutationFn: (formDataToSend: FormData) => quoteApi.submitQuoteRequest(formDataToSend),
    onSuccess: () => {
      setSuccess(true);
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        product: '',
        quantity: '1',
        notes: '',
        company: '',
        address: '',
      });
      setUploadedFiles([]);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err: any) => {
      console.error('❌ Error submitting quote:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || formData.phone.trim() === '') {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('customerName', formData.customerName || 'Khách hàng');
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('email', formData.email || 'khachhang@email.com');
    formDataToSend.append('product', formData.product || 'Sản phẩm điện lạnh');
    formDataToSend.append('quantity', formData.quantity || '1');
    formDataToSend.append('notes', formData.notes || 'Yêu cầu tư vấn từ website');
    formDataToSend.append('company', formData.company || 'Khách lẻ');
    formDataToSend.append('address', formData.address || 'Việt Nam');

    uploadedFiles.forEach(file => {
      formDataToSend.append('files', file);
    });

    mutation.mutate(formDataToSend);
  };

  const isLoading = mutation.isPending;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Xóa error khi user bắt đầu nhập lại
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <section id="quote" className="relative py-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1702498286150-e6f1cd70fa3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG9mZmljZSUyMGJ1aWxkaW5nJTIwbW9kZXJuJTIwZ2xhc3N8ZW58MXx8fHwxNzcwNzM2OTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modern office building"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay - Black with transparency */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/70"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Grid: single column on mobile, two columns from md breakpoint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Info panel */}
            <div className="text-white">
              <h2 style={{ color: 'white' }} className="mb-4">Yêu cầu báo giá</h2>
              <p style={{ color: 'white' }} className="mb-6 text-base sm:text-lg">
                Để lại thông tin, chúng tôi sẽ tư vấn và báo giá chi tiết phù hợp với nhu cầu của bạn.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {/* Icon container: flex-shrink-0 + explicit min-h-[44px] for touch target */}
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ color: 'white' }} className="mb-1">Tư vấn miễn phí</h4>
                    <p style={{ color: 'white' }} className="text-sm">Đội ngũ kỹ thuật giàu kinh nghiệm hỗ trợ 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ color: 'white' }} className="mb-1">Báo giá nhanh chóng</h4>
                    <p style={{ color: 'white' }} className="text-sm">Nhận báo giá chi tiết trong vòng 2 giờ</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ color: 'white' }} className="mb-1">Giá cạnh tranh</h4>
                    <p style={{ color: 'white' }} className="text-sm">Cam kết giá tốt nhất thị trường</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 flex-shrink-0" />
                  <div className="min-w-0">
                    <p style={{ color: 'white' }} className="text-sm opacity-90">Hoặc gọi ngay</p>
                    <p style={{ color: 'white' }} className="text-xl font-bold truncate">{companyInfo?.phone || '1900 xxxx'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form card — reduced padding on mobile to avoid overflow at 320px */}
            <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-2xl">
              {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg border border-green-200 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại trong 24h.</span>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Họ tên */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Nhập họ tên của bạn (không bắt buộc)"
                    disabled={isLoading}
                  />
                </div>

                {/* Số điện thoại - BẮT BUỘC */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="0909 xxx xxx"
                    disabled={isLoading}
                  />
                </div>

                {/* Sản phẩm quan tâm */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Sản phẩm quan tâm
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Nhập sản phẩm bạn quan tâm (không bắt buộc)"
                    disabled={isLoading}
                  />
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                    placeholder="Yêu cầu bổ sung, thời gian giao hàng mong muốn, địa chỉ lắp đặt... (không bắt buộc)"
                    disabled={isLoading}
                  />
                </div>

                {/* File Upload — stacked on mobile to prevent horizontal overflow */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Tệp đính kèm (không bắt buộc)
                  </label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      name="files"
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                      id="fileInput"
                      disabled={isLoading}
                    />
                    {/* Upload button: min-h-[44px] ensures touch target */}
                    <label
                      htmlFor="fileInput"
                      className={`w-full sm:w-auto self-start bg-primary-600 text-white min-h-[44px] py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload className="w-5 h-5" />
                      Tải lên
                    </label>
                    {/* File list: wraps naturally, each file tag truncates long names */}
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 max-w-full">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate max-w-[120px] sm:max-w-[150px]">{file.name}</span>
                            {!isLoading && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="text-red-500 hover:text-red-700 flex-shrink-0 min-w-[24px] min-h-[24px] flex items-center justify-center"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit button: always full-width, min-h for touch target */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white min-h-[48px] py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      Gửi yêu cầu báo giá
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-secondary-500 text-center">
                  Chúng tôi cam kết bảo mật thông tin của bạn
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
