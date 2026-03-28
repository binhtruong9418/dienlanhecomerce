export interface Category {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    order: number;
    status: 'active' | 'inactive' | 'deleted';
    parent?: string;
    createdAt: string;
    updatedAt: string;
  }