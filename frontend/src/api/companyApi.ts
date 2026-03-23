// api/companyApi.ts
import axiosClient from './axios';

export interface CompanyInfo {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  zaloLink: string;
  facebookLink: string;
  youtubeLink?: string;
  qrCodeUrl: string;
  hotline?: string;
}

const companyApi = {
  getCompanyInfo: async (): Promise<CompanyInfo> => {
    try {
      const response = await axiosClient.get('/admin/company-info');
      return response.companyInfo || response;
    } catch (error) {
      console.error('Failed to fetch company info:', error);
      // Return default values if API fails
      return {
        companyName: 'DienlanhPRO',
        phone: '1900 xxxx',
        email: 'info@dienlanh.com',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        workingHours: 'Thứ 2 - Thứ 7: 8:00 - 18:00',
        zaloLink: 'https://zalo.me',
        facebookLink: 'https://facebook.com',
        youtubeLink: 'https://youtube.com',
        qrCodeUrl: 'https://images.unsplash.com/photo-1598910781232-f3e046d81e3e',
        hotline: '1900 xxxx'
      };
    }
  },
};

export default companyApi;