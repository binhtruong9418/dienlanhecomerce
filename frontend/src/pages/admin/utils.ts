export function getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'quoted': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  }
  
  export function getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'quoted': return 'Đã báo giá';
      case 'completed': return 'Hoàn thành';
      default: return status;
    }
  }
  
  export const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
