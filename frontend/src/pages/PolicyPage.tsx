// PolicyPage.tsx — Trang chính sách tại /chinh-sach
import DOMPurify from 'dompurify';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, Loader, Shield } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export function PolicyPage() {
  const { companyInfo, isLoading } = useSettings();

  useEffect(() => {
    document.title = `Chính sách - ${companyInfo?.companyName || 'Phụ kiện quạt hơi nước'}`;
  }, [companyInfo?.companyName]);

  const cleanHtml = DOMPurify.sanitize(companyInfo?.policyContent ?? '');

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Page header — centered layout */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
        <div className="container mx-auto px-4 py-6 md:py-8 text-center">
          {/* Breadcrumb — centered */}
          <nav className="flex items-center justify-center gap-1.5 text-xs text-white/60 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 font-medium">Chính sách</span>
          </nav>

          {/* Icon + Title */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center ring-1 ring-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Chính sách</h1>
              {companyInfo?.companyName && (
                <p className="text-white/65 text-sm mt-1">
                  {companyInfo.companyName} — Điều khoản &amp; chính sách dịch vụ
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {isLoading ? (
          <LoadingSkeleton />
        ) : cleanHtml ? (
          <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm overflow-hidden">
            {/* Top bar */}
            <div className="px-6 md:px-10 py-3 border-b border-secondary-100 bg-secondary-50/70 flex items-center gap-2 text-xs text-secondary-500">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Cập nhật lần cuối bởi quản trị viên</span>
            </div>

            {/* Rich text body */}
            <div
              className="px-6 md:px-10 py-7 md:py-9 policy-content"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Rich text prose styles — scoped to .policy-content */}
      <style>{`
        .policy-content {
          color: #374151;
          font-size: 1rem;
          line-height: 1.75;
        }

        /* Headings */
        .policy-content h1 {
          font-size: 1.625rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 0.875rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #E5E7EB;
        }
        .policy-content h1:first-child { margin-top: 0; }

        .policy-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-top: 1.75rem;
          margin-bottom: 0.625rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .policy-content h2::before {
          content: '';
          display: inline-block;
          width: 3px;
          height: 1.1em;
          background: #2563EB;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .policy-content h2:first-child { margin-top: 0; }

        .policy-content h3 {
          font-size: 1.0625rem;
          font-weight: 600;
          color: #1F2937;
          margin-top: 1.375rem;
          margin-bottom: 0.5rem;
        }

        .policy-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.125rem;
          margin-bottom: 0.375rem;
        }

        /* Paragraphs */
        .policy-content p {
          margin-bottom: 0.875rem;
        }
        .policy-content p:last-child { margin-bottom: 0; }

        /* Lists */
        .policy-content ul,
        .policy-content ol {
          margin-bottom: 0.875rem;
          padding-left: 1.5rem;
        }
        .policy-content ul { list-style-type: disc; }
        .policy-content ol { list-style-type: decimal; }
        .policy-content li {
          margin-bottom: 0.3rem;
          padding-left: 0.25rem;
        }
        .policy-content li::marker { color: #2563EB; }
        .policy-content ul ul,
        .policy-content ol ol { margin-top: 0.3rem; margin-bottom: 0.3rem; }

        /* Inline */
        .policy-content strong { font-weight: 700; color: #111827; }
        .policy-content em    { font-style: italic; }
        .policy-content u     { text-decoration: underline; text-underline-offset: 2px; }
        .policy-content s     { text-decoration: line-through; color: #9CA3AF; }

        /* Links */
        .policy-content a {
          color: #2563EB;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 150ms;
        }
        .policy-content a:hover { color: #1D4ED8; }

        /* Blockquote */
        .policy-content blockquote {
          border-left: 3px solid #2563EB;
          background: #EFF6FF;
          margin: 1rem 0;
          padding: 0.75rem 1.125rem;
          border-radius: 0 0.5rem 0.5rem 0;
          color: #1E40AF;
          font-style: italic;
        }
        .policy-content blockquote p { margin-bottom: 0; }

        /* Code */
        .policy-content code {
          background: #F3F4F6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: #DC2626;
          font-family: ui-monospace, monospace;
        }
        .policy-content pre {
          background: #1F2937;
          color: #F9FAFB;
          padding: 1rem 1.25rem;
          border-radius: 0.625rem;
          overflow-x: auto;
          margin: 0.875rem 0;
          font-size: 0.875rem;
        }
        .policy-content pre code { background: none; color: inherit; padding: 0; }

        /* Horizontal rule */
        .policy-content hr {
          border: none;
          border-top: 1px solid #E5E7EB;
          margin: 1.5rem 0;
        }

        /* Images */
        .policy-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.625rem;
          margin: 0.875rem auto;
          display: block;
          box-shadow: 0 1px 6px rgba(0,0,0,0.08);
        }

        /* Tables */
        .policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.9rem;
          overflow-x: auto;
          display: block;
        }
        .policy-content table th {
          background: #2563EB;
          color: #ffffff;
          font-weight: 600;
          padding: 0.5rem 0.875rem;
          text-align: left;
          white-space: nowrap;
        }
        .policy-content table td {
          padding: 0.45rem 0.875rem;
          border-bottom: 1px solid #E5E7EB;
          vertical-align: top;
        }
        .policy-content table tr:nth-child(even) td { background: #F9FAFB; }
        .policy-content table tr:hover td { background: #EFF6FF; transition: background 100ms; }
        .policy-content table tr:last-child td { border-bottom: none; }

        /* Responsive table wrapper */
        .policy-content .table-responsive { overflow-x: auto; }

        @media (max-width: 640px) {
          .policy-content h1 { font-size: 1.375rem; }
          .policy-content h2 { font-size: 1.125rem; }
          .policy-content h3 { font-size: 1rem; }
          .policy-content { font-size: 0.9375rem; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm overflow-hidden">
      <div className="px-6 md:px-10 py-3 border-b border-secondary-100 bg-secondary-50/70 flex items-center gap-2">
        <Loader className="w-3.5 h-3.5 text-secondary-400 animate-spin" />
        <span className="text-xs text-secondary-400">Đang tải nội dung...</span>
      </div>
      <div className="px-6 md:px-10 py-7 space-y-3.5 animate-pulse">
        <div className="h-6 bg-secondary-100 rounded-lg w-2/3" />
        {[100, 90, 95, 80].map((w, i) => (
          <div key={i} className={`h-4 bg-secondary-100 rounded w-[${w}%]`} />
        ))}
        <div className="h-5 bg-secondary-100 rounded-lg w-1/2 mt-5" />
        {[92, 88, 75, 95, 60].map((w, i) => (
          <div key={i} className={`h-4 bg-secondary-100 rounded w-[${w}%]`} />
        ))}
        <div className="h-5 bg-secondary-100 rounded-lg w-2/5 mt-5" />
        {[85, 90].map((w, i) => (
          <div key={i} className={`h-4 bg-secondary-100 rounded w-[${w}%]`} />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-10 text-center">
      <div className="w-14 h-14 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FileText className="w-7 h-7 text-secondary-400" />
      </div>
      <h3 className="text-base font-semibold text-secondary-900 mb-1.5">Nội dung đang được cập nhật</h3>
      <p className="text-secondary-500 text-sm mb-5">Chính sách sẽ sớm được đăng tải. Vui lòng quay lại sau.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
