import { useState } from 'react';
import { Building2, Palette, FileText, Shield, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import settingApi, { CompanyInfo } from '../../api/settingApi';
import { SettingsCompanyInfoTab } from '../../components/admin/settings-company-info-tab';
import { SettingsAppearanceTab } from '../../components/admin/settings-appearance-tab';
import { SettingsPolicyTab } from '../../components/admin/settings-policy-tab';
import { SettingsSecurityTab } from '../../components/admin/settings-security-tab';

const TABS = [
  { value: 'info',       label: 'Thông tin',   icon: Building2, desc: 'Tên, liên hệ, mạng xã hội'        },
  { value: 'appearance', label: 'Giao diện',   icon: Palette,   desc: 'Logo, banner trang chủ & báo giá' },
  { value: 'policy',     label: 'Chính sách',  icon: FileText,  desc: 'Nội dung trang chính sách'         },
  { value: 'security',   label: 'Bảo mật',     icon: Shield,    desc: 'Mật khẩu đăng nhập admin'          },
];

export function SettingsAdmin() {
  const [activeValue, setActiveValue] = useState('info');
  const queryClient = useQueryClient();

  const { data: companyInfo, isLoading } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: settingApi.getCompanyInfo,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<CompanyInfo>) => settingApi.updateCompanyInfo(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['companyInfo'], data);
      toast.success('Cập nhật thành công!');
    },
    onError: () => toast.error('Có lỗi xảy ra khi cập nhật.'),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-secondary-400">
          <Loader className="w-7 h-7 animate-spin text-primary-500" />
          <p className="text-sm">Đang tải cài đặt...</p>
        </div>
      </div>
    );
  }

  const info = companyInfo!;
  return (
    <main className="flex-1 p-4 md:p-8 overflow-auto bg-secondary-50 min-h-full">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-secondary-900">Cài đặt</h1>
          <p className="text-sm text-secondary-500 mt-0.5">Quản lý thông tin công ty và giao diện website</p>
        </div>

        <Tabs value={activeValue} onValueChange={setActiveValue} className="gap-0">
          {/* Tab bar */}
          <TabsList className="w-full overflow-x-auto bg-white border border-secondary-200 rounded-2xl p-1.5 h-auto justify-start">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={`group min-w-[150px] md:min-w-0 md:flex-1 h-10 rounded-xl border px-3 shadow-none transition-all ${
                  activeValue === value
                    ? 'bg-primary-100 text-primary-700 border-primary-300 shadow-sm'
                    : 'bg-transparent text-secondary-600 border-transparent hover:bg-secondary-50 hover:text-secondary-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${activeValue === value ? 'text-primary-700' : 'text-secondary-500'}`} />
                  <span className="text-sm font-semibold">{label}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content card */}
          <div className="mt-3 bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Tab panels */}
            <div className="p-6">
              <TabsContent value="info" className="mt-0">
                <SettingsCompanyInfoTab companyInfo={info} onSave={mutation.mutate} isPending={mutation.isPending} />
              </TabsContent>
              <TabsContent value="appearance" className="mt-0">
                <SettingsAppearanceTab companyInfo={info} onSave={mutation.mutate} isPending={mutation.isPending} />
              </TabsContent>
              <TabsContent value="policy" className="mt-0">
                <SettingsPolicyTab companyInfo={info} onSave={mutation.mutate} isPending={mutation.isPending} />
              </TabsContent>
              <TabsContent value="security" className="mt-0">
                <SettingsSecurityTab />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
