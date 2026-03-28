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
  updatedAt?: string;
}

export interface SettingsResponse {
  success: boolean;
  companyInfo: CompanyInfo;
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
      } as CompanyInfo;
    }
  },
  updateCompanyInfo: async (data: Partial<CompanyInfo>): Promise<CompanyInfo> => {
    const response = await axiosClient.put('/admin/company-info', data);
    return (response as any).companyInfo;
  }
};

export default settingApi;
