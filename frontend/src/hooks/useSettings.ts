import { useQuery } from '@tanstack/react-query';
import settingApi from '../api/settingApi';

export const useSettings = () => {
  const { data: companyInfo, isLoading, error } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: settingApi.getCompanyInfo,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });

  return {
    companyInfo,
    isLoading,
    error,
  };
};
