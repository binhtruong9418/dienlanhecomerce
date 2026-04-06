import { useState } from 'react';
import { Settings, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import settingApi, { CompanyInfo } from '../../api/settingApi';
import { SettingsCompanyInfoTab } from '../../components/admin/settings-company-info-tab';
import { SettingsAppearanceTab } from '../../components/admin/settings-appearance-tab';
import { SettingsPolicyTab } from '../../components/admin/settings-policy-tab';
import { SettingsSecurityTab } from '../../components/admin/settings-security-tab';

const TABS = ['Thông tin', 'Giao diện', 'Chính sách', 'Bảo mật'];

export function SettingsAdmin() {
  const [activeTab, setActiveTab] = useState(0);
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
    onError: () => {
      toast.error('Có lỗi xảy ra khi cập nhật.');
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const info = companyInfo!;

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-secondary-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Cài đặt công ty</h2>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-secondary-200 bg-secondary-50">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-3 text-sm font-semibold transition-colors ${
                activeTab === i
                  ? 'border-b-2 border-primary-600 text-primary-600 bg-white'
                  : 'text-secondary-500 hover:text-secondary-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 0 && (
            <SettingsCompanyInfoTab
              companyInfo={info}
              onSave={mutation.mutate}
              isPending={mutation.isPending}
            />
          )}
          {activeTab === 1 && (
            <SettingsAppearanceTab
              companyInfo={info}
              onSave={mutation.mutate}
              isPending={mutation.isPending}
            />
          )}
          {activeTab === 2 && (
            <SettingsPolicyTab
              companyInfo={info}
              onSave={mutation.mutate}
              isPending={mutation.isPending}
            />
          )}
          {activeTab === 3 && <SettingsSecurityTab />}
        </div>
      </div>
    </main>
  );
}
