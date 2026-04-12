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
  const activeTab = TABS.find(t => t.value === activeValue)!;

  return (
    <main className="flex-1 p-4 md:p-8 overflow-auto bg-secondary-50 min-h-full">
      <div className="max-w-2xl mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-secondary-900">Cài đặt</h1>
          <p className="text-sm text-secondary-500 mt-0.5">Quản lý thông tin công ty và giao diện website</p>
        </div>

        <Tabs value={activeValue} onValueChange={setActiveValue} className="gap-0">
          {/* Tab bar */}
          <TabsList className="w-full bg-white border border-secondary-200 border-b-0 rounded-t-2xl rounded-b-none h-auto p-0 justify-start overflow-x-auto">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-none border-b-2 border-transparent text-secondary-500
                  data-[state=active]:border-primary-600 data-[state=active]:text-primary-700 data-[state=active]:bg-primary-50/50
                  hover:text-secondary-700 hover:bg-secondary-50 transition-all whitespace-nowrap shadow-none bg-transparent"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content card */}
          <div className="bg-white border border-secondary-200 rounded-b-2xl rounded-tr-2xl shadow-sm overflow-hidden">
            {/* Tab subtitle strip */}
            <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-secondary-100 bg-secondary-50/60">
              <div className="w-6 h-6 rounded-md bg-primary-100 flex items-center justify-center flex-shrink-0">
                <activeTab.icon className="w-3.5 h-3.5 text-primary-600" />
              </div>
              <p className="text-xs text-secondary-500">{activeTab.desc}</p>
            </div>

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
