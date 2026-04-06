import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Building2, Phone, Mail, MapPin, Clock, Link as LinkIcon } from 'lucide-react';
import { CompanyInfo } from '../../api/settingApi';

interface Props {
  companyInfo: CompanyInfo;
  onSave: (data: Partial<CompanyInfo>) => void;
  isPending: boolean;
}

export function SettingsCompanyInfoTab({ companyInfo, onSave, isPending }: Props) {
  const [form, setForm] = useState<CompanyInfo>(companyInfo);

  useEffect(() => {
    setForm(companyInfo);
  }, [companyInfo]);

  const set = (field: keyof CompanyInfo) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      companyName: form.companyName,
      phone: form.phone,
      email: form.email,
      address: form.address,
      workingHours: form.workingHours,
      zaloLink: form.zaloLink,
      facebookLink: form.facebookLink,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">
          <Building2 className="w-4 h-4 inline mr-1" />Tên công ty
        </label>
        <input type="text" value={form.companyName} onChange={set('companyName')}
          className="w-full px-4 py-2 border rounded-lg" required />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            <Phone className="w-4 h-4 inline mr-1" />Điện thoại
          </label>
          <input type="text" value={form.phone} onChange={set('phone')}
            className="w-full px-4 py-2 border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">
            <Mail className="w-4 h-4 inline mr-1" />Email
          </label>
          <input type="email" value={form.email} onChange={set('email')}
            className="w-full px-4 py-2 border rounded-lg" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />Địa chỉ
        </label>
        <input type="text" value={form.address} onChange={set('address')}
          className="w-full px-4 py-2 border rounded-lg" required />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          <Clock className="w-4 h-4 inline mr-1" />Giờ làm việc
        </label>
        <input type="text" value={form.workingHours} onChange={set('workingHours')}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="VD: Thứ 2 - Thứ 7: 8:00 - 18:00" required />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            <LinkIcon className="w-4 h-4 inline mr-1" />Link Zalo
          </label>
          <input type="url" value={form.zaloLink} onChange={set('zaloLink')}
            className="w-full px-4 py-2 border rounded-lg" placeholder="https://zalo.me/..." />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">
            <LinkIcon className="w-4 h-4 inline mr-1" />Link Facebook
          </label>
          <input type="url" value={form.facebookLink} onChange={set('facebookLink')}
            className="w-full px-4 py-2 border rounded-lg" placeholder="https://facebook.com/..." />
        </div>
      </div>

      <button type="submit" disabled={isPending}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 mt-4 disabled:opacity-50">
        {isPending ? 'Đang lưu...' : 'Lưu thông tin'}
      </button>
    </form>
  );
}
