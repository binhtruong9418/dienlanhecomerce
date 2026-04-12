import { useState, useEffect, useRef, ChangeEvent, FormEvent, ElementType } from 'react';
import { X, Layout, FileImage, ImageIcon, CloudUpload, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import adminApi from '../../api/adminApi';
import { CompanyInfo } from '../../api/settingApi';
import { useImageCrop } from '../../hooks/use-image-crop';

// Must match Hero.tsx and QuoteSection.tsx fallback constants
const BANNER_TEXT_FALLBACK    = 'Giải pháp làm mát công nghiệp hiệu quả';
const BANNER_SUBTEXT_FALLBACK = 'Cung cấp điều hòa cây và quạt điều hòa chất lượng cao cho nhà xưởng, văn phòng và không gian thương mại. Công suất lớn, tiết kiệm điện, bảo hành chính hãng.';

interface Props {
  companyInfo: CompanyInfo;
  onSave: (data: Partial<CompanyInfo>) => void;
  isPending: boolean;
}

function SectionHeading({ icon: Icon, children }: { icon: ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-6 h-6 rounded-md bg-secondary-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-secondary-500" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-secondary-500">{children}</span>
      <Separator className="flex-1 bg-secondary-100" />
    </div>
  );
}

// ─── Logo upload (square preview) ────────────────────────────────────────────
interface LogoUploadProps {
  url: string; uploading: boolean;
  onClear: () => void; onPick: () => void;
}
function LogoUpload({ url, uploading, onClear, onPick }: LogoUploadProps) {
  if (url) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl border border-secondary-200 bg-secondary-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
          <img src={url} alt="Logo" className="max-w-full max-h-full object-contain p-1.5" />
        </div>
        <div className="flex flex-col gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onPick} disabled={uploading}
            className="h-8 px-3 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 justify-start gap-1.5">
            <Pencil className="w-3 h-3" />{uploading ? 'Đang tải...' : 'Thay logo'}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}
            className="h-8 px-3 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 justify-start gap-1.5">
            <X className="w-3 h-3" />Xóa logo
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Button type="button" variant="outline" onClick={onPick} disabled={uploading}
      className="w-full h-16 border-dashed border-secondary-300 text-secondary-400 hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50/30 gap-2.5 flex-col">
      <CloudUpload className="w-5 h-5" />
      <span className="text-xs">{uploading ? 'Đang tải lên...' : 'Chọn ảnh logo · PNG trong suốt được khuyến nghị'}</span>
    </Button>
  );
}

// ─── Banner upload (16:9 full-width preview) ─────────────────────────────────
interface BannerUploadProps {
  url: string; uploading: boolean; label: string; hint: string;
  onClear: () => void; onPick: () => void;
}
function BannerUpload({ url, uploading, label, hint, onClear, onPick }: BannerUploadProps) {
  if (url) {
    return (
      <div className="space-y-2">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-secondary-200 bg-secondary-100 shadow-sm group">
          <img src={url} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100">
            <Button type="button" size="sm" variant="secondary" onClick={onPick} disabled={uploading}
              className="h-8 px-3 text-xs gap-1.5 shadow-md">
              <Pencil className="w-3.5 h-3.5" />{uploading ? 'Đang tải...' : 'Thay ảnh'}
            </Button>
            <Button type="button" size="sm" onClick={onClear}
              className="h-8 px-3 text-xs gap-1.5 bg-red-500 hover:bg-red-600 text-white shadow-md">
              <X className="w-3.5 h-3.5" />Xóa
            </Button>
          </div>
        </div>
        {/* Mobile fallback (hover unreliable on touch) */}
        <div className="flex items-center gap-3 sm:hidden">
          <Button type="button" variant="ghost" size="sm" onClick={onPick} disabled={uploading}
            className="h-7 px-2 text-xs text-primary-600 gap-1">
            <Pencil className="w-3 h-3" />{uploading ? 'Đang tải...' : 'Thay ảnh'}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}
            className="h-7 px-2 text-xs text-red-500 gap-1">
            <X className="w-3 h-3" />Xóa
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Button type="button" variant="outline" onClick={onPick} disabled={uploading}
      className="w-full aspect-video h-auto border-dashed border-secondary-300 text-secondary-400 hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50/30 flex-col gap-2 rounded-xl">
      {uploading
        ? <><CloudUpload className="w-8 h-8 animate-pulse" /><span className="text-sm">Đang tải lên...</span></>
        : <><CloudUpload className="w-8 h-8" /><span className="text-sm font-medium">{label}</span><span className="text-xs font-normal">{hint}</span></>
      }
    </Button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function SettingsAppearanceTab({ companyInfo, onSave, isPending }: Props) {
  const [logoUrl,             setLogoUrl]            = useState(companyInfo.logoUrl            || '');
  const [bannerImageUrl,      setBannerImageUrl]      = useState(companyInfo.bannerImageUrl     || '');
  const [bannerText,          setBannerText]          = useState(companyInfo.bannerText         || BANNER_TEXT_FALLBACK);
  const [bannerSubtext,       setBannerSubtext]       = useState(companyInfo.bannerSubtext      || BANNER_SUBTEXT_FALLBACK);
  const [quoteBannerImageUrl, setQuoteBannerImageUrl] = useState(companyInfo.quoteBannerImageUrl || '');

  const [uploadingLogo,        setUploadingLogo]        = useState(false);
  const [uploadingBanner,      setUploadingBanner]      = useState(false);
  const [uploadingQuoteBanner, setUploadingQuoteBanner] = useState(false);

  const logoRef        = useRef<HTMLInputElement>(null);
  const bannerRef      = useRef<HTMLInputElement>(null);
  const quoteBannerRef = useRef<HTMLInputElement>(null);

  const { openCrop: openLogoCrop,        CropModalElement: LogoCropModal        } = useImageCrop();
  const { openCrop: openBannerCrop,      CropModalElement: BannerCropModal      } = useImageCrop(16 / 9);
  const { openCrop: openQuoteBannerCrop, CropModalElement: QuoteBannerCropModal } = useImageCrop(16 / 9);

  useEffect(() => {
    setLogoUrl(companyInfo.logoUrl                         || '');
    setBannerImageUrl(companyInfo.bannerImageUrl           || '');
    setBannerText(companyInfo.bannerText                   || BANNER_TEXT_FALLBACK);
    setBannerSubtext(companyInfo.bannerSubtext             || BANNER_SUBTEXT_FALLBACK);
    setQuoteBannerImageUrl(companyInfo.quoteBannerImageUrl || '');
  }, [companyInfo]);

  const upload = async (file: File): Promise<string | null> => {
    try { return (await adminApi.uploadFile(file, 'settings') as any).url ?? null; }
    catch { toast.error('Tải ảnh lên thất bại'); return null; }
  };

  const pick = (ref: React.RefObject<HTMLInputElement | null>) => () => ref.current?.click();

  const onLogoFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    openLogoCrop(f, async (c) => { setUploadingLogo(true); const u = await upload(c); setUploadingLogo(false); if (u) setLogoUrl(u); });
  };
  const onBannerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    openBannerCrop(f, async (c) => { setUploadingBanner(true); const u = await upload(c); setUploadingBanner(false); if (u) setBannerImageUrl(u); });
  };
  const onQuoteBannerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    openQuoteBannerCrop(f, async (c) => { setUploadingQuoteBanner(true); const u = await upload(c); setUploadingQuoteBanner(false); if (u) setQuoteBannerImageUrl(u); });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onSave({ logoUrl, bannerText, bannerSubtext, bannerImageUrl, quoteBannerImageUrl });
  };

  return (
    <>
    <form onSubmit={handleSave} className="space-y-7">

      {/* ── Logo ── */}
      <section>
        <SectionHeading icon={ImageIcon}>Logo công ty</SectionHeading>
        <p className="text-xs text-secondary-400 mb-3">Xuất hiện trên header và footer của website</p>
        <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={onLogoFile} />
        <LogoUpload url={logoUrl} uploading={uploadingLogo} onClear={() => setLogoUrl('')} onPick={pick(logoRef)} />
      </section>

      {/* ── Banner Hero ── */}
      <section>
        <SectionHeading icon={Layout}>Banner trang chủ (Hero)</SectionHeading>
        <p className="text-xs text-secondary-400 mb-4">Phần Hero ở đầu trang chủ — tiêu đề, mô tả và ảnh nền toàn màn hình</p>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bannerText" className="text-sm font-medium text-secondary-700">Tiêu đề</Label>
            <Input id="bannerText" value={bannerText} onChange={e => setBannerText(e.target.value)}
              className="h-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
              placeholder={BANNER_TEXT_FALLBACK} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bannerSubtext" className="text-sm font-medium text-secondary-700">Mô tả phụ</Label>
            <Textarea id="bannerSubtext" value={bannerSubtext} onChange={e => setBannerSubtext(e.target.value)} rows={3}
              className="border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm min-h-0"
              placeholder={BANNER_SUBTEXT_FALLBACK} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-secondary-700">Ảnh nền hero</Label>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={onBannerFile} />
            <BannerUpload url={bannerImageUrl} uploading={uploadingBanner}
              label="Chọn ảnh nền hero" hint="Tỉ lệ 16:9 — khuyến nghị 1920×1080px"
              onClear={() => setBannerImageUrl('')} onPick={pick(bannerRef)} />
          </div>
        </div>
      </section>

      {/* ── Banner Báo giá ── */}
      <section>
        <SectionHeading icon={FileImage}>Banner báo giá</SectionHeading>
        <p className="text-xs text-secondary-400 mb-3">Ảnh nền phần "Yêu cầu báo giá" ở cuối trang chủ</p>
        <input ref={quoteBannerRef} type="file" accept="image/*" className="hidden" onChange={onQuoteBannerFile} />
        <BannerUpload url={quoteBannerImageUrl} uploading={uploadingQuoteBanner}
          label="Chọn ảnh nền báo giá" hint="Tỉ lệ 16:9 — khuyến nghị 1920×1080px"
          onClear={() => setQuoteBannerImageUrl('')} onPick={pick(quoteBannerRef)} />
      </section>

      <Button type="submit" disabled={isPending || uploadingLogo || uploadingBanner || uploadingQuoteBanner}
        className="w-full h-10 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm">
        {isPending ? 'Đang lưu...' : 'Lưu giao diện'}
      </Button>
    </form>
    {LogoCropModal}{BannerCropModal}{QuoteBannerCropModal}
    </>
  );
}
