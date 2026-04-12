import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
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
      <div className="bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 text-xs text-secondary-500 flex items-start gap-2">
        <span className="mt-0.5">💡</span>
        <span>Nội dung bên dưới sẽ hiển thị trên trang <strong>/chinh-sach</strong>. Hỗ trợ định dạng văn bản phong phú, hình ảnh và bảng.</span>
      </div>
      <RichTextEditor
        value={policyContent}
        onChange={setPolicyContent}
        id="policy-editor"
        placeholder="Nhập nội dung chính sách..."
        height={500}
        onImageUpload={handleImageUpload}
      />
      <Button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="w-full h-10 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm"
      >
        {isPending ? 'Đang lưu...' : 'Lưu chính sách'}
      </Button>
    </div>
  );
}
