import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  brand: string;
  power: string;
  capacity: string;
  area: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  specifications: Array<{
    label: string;
    value: string;
  }>;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  inStock: boolean;
  stock: number;
  status: 'active' | 'inactive' | 'deleted';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục là bắt buộc'],
    },
    brand: {
      type: String,
      required: [true, 'Thương hiệu là bắt buộc'],
    },
    power: {
      type: String,
      required: [true, 'Công suất là bắt buộc'],
    },
    capacity: {
      type: String,
      required: [true, 'Năng lực làm lạnh là bắt buộc'],
    },
    area: {
      type: String,
      required: [true, 'Diện tích sử dụng là bắt buộc'],
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm là bắt buộc'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    images: [
      {
        type: String,
        required: [true, 'Ít nhất một ảnh sản phẩm'],
      },
    ],
    description: {
      type: String,
      required: [true, 'Mô tả sản phẩm là bắt buộc'],
    },
    specifications: [
      {
        label: String,
        value: String,
      },
    ],
    features: [
      {
        icon: String,
        title: String,
        description: String,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deleted'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

export default mongoose.model<IProduct>('Product', productSchema);