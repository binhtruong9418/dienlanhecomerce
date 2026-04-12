import { useState, ChangeEvent, FormEvent } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import settingApi from '../../api/settingApi';

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

export function SettingsSecurityTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Xác nhận mật khẩu không khớp');
      return;
    }
    setIsPending(true);
    setError('');
    try {
      await settingApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Đổi mật khẩu thành công');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Đổi mật khẩu thất bại';
      setError(msg);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <section>
        <SectionHeading icon={Lock}>Đổi mật khẩu</SectionHeading>
        <p className="text-xs text-secondary-400 mb-4">
          Mật khẩu mới phải có ít nhất 8 ký tự.
        </p>

        <div className="space-y-4">
          {/* Current password */}
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-secondary-700">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                value={form.currentPassword}
                onChange={set('currentPassword')}
                required
                autoComplete="current-password"
                className="h-10 pr-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-sm font-medium text-secondary-700">
              Mật khẩu mới <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                value={form.newPassword}
                onChange={set('newPassword')}
                required
                minLength={8}
                autoComplete="new-password"
                className="h-10 pr-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-secondary-700">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              required
              autoComplete="new-password"
              className="h-10 border-secondary-200 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 text-sm"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-2 rounded-lg mt-4">
            {error}
          </p>
        )}
      </section>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm"
      >
        {isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
      </Button>
    </form>
  );
}
