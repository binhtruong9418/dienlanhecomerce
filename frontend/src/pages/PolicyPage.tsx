import DOMPurify from 'dompurify';
import { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';

export function PolicyPage() {
  const { companyInfo, isLoading } = useSettings();

  useEffect(() => {
    document.title = `Chính sách - ${companyInfo?.companyName || 'Phụ kiện quạt hơi nước'}`;
  }, [companyInfo?.companyName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-secondary-500 text-lg">Đang tải...</p>
      </div>
    );
  }

  const policyContent = companyInfo?.policyContent ?? '';
  // Sanitize HTML to prevent XSS before rendering via dangerouslySetInnerHTML
  const cleanHtml = DOMPurify.sanitize(policyContent);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-secondary-900">Chính sách</h1>
      {cleanHtml ? (
        <div
          className="text-secondary-700 leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:text-primary-600 [&_a]:underline [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      ) : (
        <div className="text-center py-16 text-secondary-500">
          <p className="text-lg">Nội dung chính sách đang được cập nhật.</p>
          <p className="mt-2">Vui lòng quay lại sau.</p>
        </div>
      )}
    </div>
  );
}
