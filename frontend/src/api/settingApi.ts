import axiosClient from './axios';

export interface CompanyInfo {
  _id?: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  zaloLink: string;
  facebookLink: string;
  qrCodeUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  siteTitle?: string;
  siteDescription?: string;
  bannerText?: string;
  bannerSubtext?: string;
  bannerImageUrl?: string;
  quoteBannerImageUrl?: string;
  policyContent?: string;
  updatedAt?: string;
}

export interface SettingsResponse {
  success: boolean;
  companyInfo: CompanyInfo;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const settingApi = {
  getCompanyInfo: async (): Promise<CompanyInfo> => {
    try {
      const response = await axiosClient.get('/settings');
      return (response as any).companyInfo;
    } catch (error) {
      console.error('Failed to fetch company info:', error);
      return {
        companyName: 'Công ty TNHH Điện Lạnh ABC',
        phone: '1900 xxxx',
        email: 'info@dienlanh.com',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        workingHours: 'Thứ 2 - Thứ 7: 8:00 - 18:00',
        zaloLink: '',
        facebookLink: '',
        qrCodeUrl: '',
        logoUrl: '',
        faviconUrl: '',
        siteTitle: '',
        siteDescription: '',
        bannerText: '',
        bannerSubtext: '',
        bannerImageUrl: '',
        quoteBannerImageUrl: '',
        policyContent: '',
      };
    }
  },

  updateCompanyInfo: async (data: Partial<CompanyInfo>): Promise<CompanyInfo> => {
    const response = await axiosClient.put('/admin/company-info', data);
    return (response as any).companyInfo;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await axiosClient.put('/auth/change-password', payload);
  },
};

export default settingApi;
