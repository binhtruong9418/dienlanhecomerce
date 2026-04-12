import { useState, useEffect, FormEvent } from 'react';
import { Building2, Phone, Mail, MapPin, Clock, Share2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { CompanyInfo } from '../../api/settingApi';

// Fallback values matching frontend display defaults
const DEFAULTS = {
  companyName:  'PK Quạt hơi nước',
  phone:        '1900 xxxx',
  email:        'sales@dienlanhpro.com',
  address:      '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
  workingHours: 'Thứ 2 - Thứ 7: 8:00 - 18:00 | Chủ nhật: 8:00 - 12:00',
};

type FormState = Pick<CompanyInfo, 'companyName' | 'phone' | 'email' | 'address' | 'workingHours' | 'zaloLink' | 'facebookLink'>;

function buildForm(c: CompanyInfo): FormState {
  return {
    companyName:  c.companyName  || DEFAULTS.companyName,
    phone:        c.phone        || DEFAULTS.phone,
    email:        c.email        || DEFAULTS.email,
    address:      c.address      || DEFAULTS.address,
    workingHours: c.workingHours || DEFAULTS.workingHours,
    zaloLink:     c.zaloLink     || '',
    facebookLink: c.facebookLink || '',
  };
}

interface Props {
  companyInfo: CompanyInfo;
  onSave: (data: Partial<CompanyInfo>) => void;
  isPending: boolean;
}

function SectionHeading({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
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

export function SettingsCompanyInfoTab({ companyInfo, onSave, isPending }: Props) {
  const [form, setForm] = useState<FormState>(() => buildForm(companyInfo));
  useEffect(() => { setForm(buildForm(companyInfo)); }, [companyInfo]);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* ── Thông tin chung ── */}
      <section>
        <SectionHeading icon={Building2}>Thông tin chung</SectionHeading>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="text-sm font-medium text-secondary-700">
              Tên công ty <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={set('companyName')}
              required
              placeholder="VD: Công ty Điện Lạnh Pro"
              className="h-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm font-medium text-secondary-700">
              <MapPin className="w-3.5 h-3.5 inline mr-1 opacity-40" />Địa chỉ <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              value={form.address}
              onChange={set('address')}
              required
              rows={2}
              placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
              className="border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm min-h-0"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="workingHours" className="text-sm font-medium text-secondary-700">
              <Clock className="w-3.5 h-3.5 inline mr-1 opacity-40" />Giờ làm việc <span className="text-red-500">*</span>
            </Label>
            <Input
              id="workingHours"
              value={form.workingHours}
              onChange={set('workingHours')}
              required
              placeholder="VD: Thứ 2 - Thứ 7: 8:00 - 18:00"
              className="h-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Liên hệ ── */}
      <section>
        <SectionHeading icon={Phone}>Liên hệ</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium text-secondary-700">
              <Phone className="w-3.5 h-3.5 inline mr-1 opacity-40" />Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={set('phone')}
              required
              placeholder="VD: 0901 234 567"
              className="h-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-secondary-700">
              <Mail className="w-3.5 h-3.5 inline mr-1 opacity-40" />Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              placeholder="VD: sales@example.com"
              className="h-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Mạng xã hội ── */}
      <section>
        <SectionHeading icon={Share2}>Mạng xã hội</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="zaloLink" className="text-sm font-medium text-secondary-700">Link Zalo</Label>
            <Input
              id="zaloLink"
              type="url"
              value={form.zaloLink}
              onChange={set('zaloLink')}
              placeholder="https://zalo.me/..."
              className="h-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="facebookLink" className="text-sm font-medium text-secondary-700">Link Facebook</Label>
            <Input
              id="facebookLink"
              type="url"
              value={form.facebookLink}
              onChange={set('facebookLink')}
              placeholder="https://facebook.com/..."
              className="h-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-secondary-400 mt-2">Để trống nếu không có tài khoản mạng xã hội</p>
      </section>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm"
      >
        {isPending ? 'Đang lưu...' : 'Lưu thông tin'}
      </Button>
    </form>
  );
}
