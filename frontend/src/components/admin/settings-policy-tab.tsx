import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import RichTextEditor from '../RichTextEditor';
import adminApi from '../../api/adminApi';
import { CompanyInfo } from '../../api/settingApi';

interface Props {
  companyInfo: CompanyInfo;
  onSave: (data: Partial<CompanyInfo>) => void;
  isPending: boolean;
}

export function SettingsPolicyTab({ companyInfo, onSave, isPending }: Props) {
  const [policyContent, setPolicyContent] = useState(companyInfo.policyContent || '');

  useEffect(() => {
    setPolicyContent(companyInfo.policyContent || '');
  }, [companyInfo.policyContent]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const res = await adminApi.uploadFile(file, 'policy');
      return (res as any).url ?? null;
    } catch {
      toast.error('Tải ảnh lên thất bại');
      return null;
    }
  };

  const handleSave = () => {
    onSave({ policyContent });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-secondary-500">
        Nội dung chính sách sẽ hiển thị trên trang chính sách của website.
      </p>
      <RichTextEditor
        value={policyContent}
        onChange={setPolicyContent}
        id="policy-editor"
        placeholder="Nhập nội dung chính sách..."
        height={450}
        onImageUpload={handleImageUpload}
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50"
      >
        {isPending ? 'Đang lưu...' : 'Lưu chính sách'}
      </button>
    </div>
  );
}
