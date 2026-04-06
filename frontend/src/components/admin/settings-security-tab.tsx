import { useState, ChangeEvent, FormEvent } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import settingApi from '../../api/settingApi';

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <p className="text-sm text-secondary-500">
        Đổi mật khẩu tài khoản quản trị. Mật khẩu mới phải có ít nhất 8 ký tự.
      </p>

      {/* Current password */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          <Lock className="w-4 h-4 inline mr-1" />Mật khẩu hiện tại
        </label>
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            value={form.currentPassword}
            onChange={set('currentPassword')}
            className="w-full px-4 py-2 pr-10 border rounded-lg"
            required
            autoComplete="current-password"
          />
          <button type="button" onClick={() => setShowCurrent(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* New password */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          <Lock className="w-4 h-4 inline mr-1" />Mật khẩu mới
        </label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={form.newPassword}
            onChange={set('newPassword')}
            className="w-full px-4 py-2 pr-10 border rounded-lg"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <button type="button" onClick={() => setShowNew(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          <Lock className="w-4 h-4 inline mr-1" />Xác nhận mật khẩu mới
        </label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={set('confirmPassword')}
          className="w-full px-4 py-2 border rounded-lg"
          required
          autoComplete="new-password"
        />
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <button type="submit" disabled={isPending}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50">
        {isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
      </button>
    </form>
  );
}
