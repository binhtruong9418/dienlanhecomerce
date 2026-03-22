import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteRequest extends Document {
  customerName: string;
  phone: string;
  email: string;
  company?: string;
  address?: string;
  businessType?: string;
  product: string;
  productId?: mongoose.Types.ObjectId;
  quantity: number;
  notes?: string;
  files: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  status: 'pending' | 'quoted' | 'completed' | 'cancelled';
  quotedPrice?: number;
  quotedBy?: mongoose.Types.ObjectId;
  quotedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const quoteRequestSchema = new Schema<IQuoteRequest>(
  {
    customerName: {
      type: String,
      required: [true, 'Tên khách hàng là bắt buộc'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      lowercase: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    product: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng là bắt buộc'],
      min: 1,
    },
    notes: {
      type: String,
    },
    files: [
      {
        name: String,
        url: String,
        size: Number,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'quoted', 'completed', 'cancelled'],
      default: 'pending',
    },
    quotedPrice: {
      type: Number,
      min: 0,
    },
    quotedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    quotedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuoteRequest>('QuoteRequest', quoteRequestSchema);