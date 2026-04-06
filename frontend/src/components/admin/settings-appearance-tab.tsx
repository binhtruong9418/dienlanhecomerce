import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { Image, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../api/adminApi';
import { CompanyInfo } from '../../api/settingApi';
import { useImageCrop } from '../../hooks/use-image-crop';

interface Props {
  companyInfo: CompanyInfo;
  onSave: (data: Partial<CompanyInfo>) => void;
  isPending: boolean;
}

export function SettingsAppearanceTab({ companyInfo, onSave, isPending }: Props) {
  const [logoUrl, setLogoUrl] = useState(companyInfo.logoUrl || '');
  const [bannerImageUrl, setBannerImageUrl] = useState(companyInfo.bannerImageUrl || '');
  const [bannerText, setBannerText] = useState(companyInfo.bannerText || '');
  const [bannerSubtext, setBannerSubtext] = useState(companyInfo.bannerSubtext || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const { openCrop: openLogoCrop, CropModalElement: LogoCropModal } = useImageCrop();
  const { openCrop: openBannerCrop, CropModalElement: BannerCropModal } = useImageCrop(16 / 9);

  useEffect(() => {
    setLogoUrl(companyInfo.logoUrl || '');
    setBannerImageUrl(companyInfo.bannerImageUrl || '');
    setBannerText(companyInfo.bannerText || '');
    setBannerSubtext(companyInfo.bannerSubtext || '');
  }, [companyInfo]);

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    try {
      const res = await adminApi.uploadFile(file, folder);
      return (res as any).url ?? null;
    } catch {
      toast.error('Tải ảnh lên thất bại');
      return null;
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openLogoCrop(file, async (cropped) => {
      setUploadingLogo(true);
      const url = await uploadImage(cropped, 'settings');
      setUploadingLogo(false);
      if (url) setLogoUrl(url);
    });
  };

  const handleBannerImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openBannerCrop(file, async (cropped) => {
      setUploadingBanner(true);
      const url = await uploadImage(cropped, 'settings');
      setUploadingBanner(false);
      if (url) setBannerImageUrl(url);
    });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onSave({ logoUrl, bannerText, bannerSubtext, bannerImageUrl });
  };

  return (
    <>
    <form onSubmit={handleSave} className="space-y-6">
      {/* Logo */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          <Image className="w-4 h-4 inline mr-1" />Logo công ty
        </label>
        {logoUrl && (
          <div className="flex items-center gap-3 mb-2">
            <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain border rounded-lg p-1" />
            <button type="button" onClick={() => setLogoUrl('')}
              className="flex items-center gap-1 text-red-600 text-sm hover:underline">
              <X className="w-4 h-4" />Xóa logo
            </button>
          </div>
        )}
        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
        <button type="button" disabled={uploadingLogo}
          onClick={() => logoInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-secondary-50 disabled:opacity-50">
          <Upload className="w-4 h-4" />{uploadingLogo ? 'Đang tải...' : 'Chọn ảnh logo'}
        </button>
      </div>

      {/* Banner text fields */}
      <div>
        <label className="block text-sm font-semibold mb-2">Tiêu đề banner</label>
        <input type="text" value={bannerText} onChange={e => setBannerText(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg" placeholder="VD: Chuyên cung cấp phụ kiện điện lạnh" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả phụ banner</label>
        <input type="text" value={bannerSubtext} onChange={e => setBannerSubtext(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg" placeholder="VD: Uy tín - Chất lượng - Giá tốt" />
      </div>

      {/* Banner image */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          <Image className="w-4 h-4 inline mr-1" />Ảnh banner
        </label>
        {bannerImageUrl && (
          <div className="flex items-center gap-3 mb-2">
            <img src={bannerImageUrl} alt="Banner" className="h-20 w-auto object-cover border rounded-lg" />
            <button type="button" onClick={() => setBannerImageUrl('')}
              className="flex items-center gap-1 text-red-600 text-sm hover:underline">
              <X className="w-4 h-4" />Xóa ảnh
            </button>
          </div>
        )}
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerImageChange} />
        <button type="button" disabled={uploadingBanner}
          onClick={() => bannerInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-secondary-50 disabled:opacity-50">
          <Upload className="w-4 h-4" />{uploadingBanner ? 'Đang tải...' : 'Chọn ảnh banner'}
        </button>
      </div>

      <button type="submit" disabled={isPending || uploadingLogo || uploadingBanner}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50">
        {isPending ? 'Đang lưu...' : 'Lưu giao diện'}
      </button>
    </form>
    {LogoCropModal}
    {BannerCropModal}
    </>
  );
}
