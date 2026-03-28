import { useState, useEffect } from 'react';
import { Settings, Building2, Phone, Mail, MapPin, Clock, Link as LinkIcon, Image, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import settingApi, { CompanyInfo } from '../../api/settingApi';

export function SettingsAdmin() {
  const queryClient = useQueryClient();
  
  const { data: serverCompanyInfo, isLoading } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: settingApi.getCompanyInfo,
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: '',
    phone: '',
    email: '',
    address: '',
    workingHours: '',
    zaloLink: '',
    facebookLink: '',
  });

  useEffect(() => {
    if (serverCompanyInfo) {
      setCompanyInfo({
        companyName: serverCompanyInfo.companyName || '',
        phone: serverCompanyInfo.phone || '',
        email: serverCompanyInfo.email || '',
        address: serverCompanyInfo.address || '',
        workingHours: serverCompanyInfo.workingHours || '',
        zaloLink: serverCompanyInfo.zaloLink || '',
        facebookLink: serverCompanyInfo.facebookLink || '',
      });
    }
  }, [serverCompanyInfo]);

  const mutation = useMutation({
    mutationFn: settingApi.updateCompanyInfo,
    onSuccess: (data) => {
      queryClient.setQueryData(['companyInfo'], data);
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi cập nhật.');
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(companyInfo);
  };

  if (isLoading) {
    return <div className="p-6 flex justify-center"><Loader className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-secondary-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <div className="flex items-center gap-3"><Settings className="w-8 h-8" /><h2 className="text-2xl font-bold">Cài đặt công ty</h2></div>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div><label className="block text-sm font-semibold mb-2"><Building2 className="w-4 h-4 inline mr-1"/>Tên công ty</label><input type="text" value={companyInfo.companyName} onChange={e => setCompanyInfo({...companyInfo, companyName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required /></div>
          
          <div className="grid md:grid-cols-2 gap-4">
             <div><label className="block text-sm font-semibold mb-2"><Phone className="w-4 h-4 inline mr-1"/>Điện thoại</label><input type="text" value={companyInfo.phone} onChange={e => setCompanyInfo({...companyInfo, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required /></div>
             <div><label className="block text-sm font-semibold mb-2"><Mail className="w-4 h-4 inline mr-1"/>Email</label><input type="email" value={companyInfo.email} onChange={e => setCompanyInfo({...companyInfo, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required /></div>
          </div>
          
          <div><label className="block text-sm font-semibold mb-2"><MapPin className="w-4 h-4 inline mr-1"/>Địa chỉ</label><input type="text" value={companyInfo.address} onChange={e => setCompanyInfo({...companyInfo, address: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required /></div>
          
          <div><label className="block text-sm font-semibold mb-2"><Clock className="w-4 h-4 inline mr-1"/>Giờ làm việc</label><input type="text" value={companyInfo.workingHours} onChange={e => setCompanyInfo({...companyInfo, workingHours: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="VD: Thứ 2 - Thứ 7: 8:00 - 18:00" required /></div>

          <div className="grid md:grid-cols-2 gap-4">
             <div><label className="block text-sm font-semibold mb-2"><LinkIcon className="w-4 h-4 inline mr-1"/>Link Zalo</label><input type="url" value={companyInfo.zaloLink} onChange={e => setCompanyInfo({...companyInfo, zaloLink: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://zalo.me/..." /></div>
             <div><label className="block text-sm font-semibold mb-2"><LinkIcon className="w-4 h-4 inline mr-1"/>Link Facebook</label><input type="url" value={companyInfo.facebookLink} onChange={e => setCompanyInfo({...companyInfo, facebookLink: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://facebook.com/..." /></div>
          </div>

          <button type="submit" disabled={mutation.isPending} className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 mt-4 disabled:opacity-50">
            {mutation.isPending ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </form>
      </div>
    </main>
  );
}
