import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanyInfo extends Document {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  zaloLink: string;
  facebookLink: string;
  qrCodeUrl: string;
  updatedAt: Date;
}

const companyInfoSchema = new Schema<ICompanyInfo>(
  {
    companyName: {
      type: String,
      required: true,
      default: 'Công ty TNHH Điện Lạnh ABC',
    },
    phone: {
      type: String,
      required: true,
      default: '1900 xxxx',
    },
    email: {
      type: String,
      required: true,
      default: 'info@dienlanh.com',
    },
    address: {
      type: String,
      required: true,
      default: '123 Đường ABC, Quận 1, TP.HCM',
    },
    workingHours: {
      type: String,
      required: true,
      default: 'Thứ 2 - Thứ 7: 8:00 - 18:00',
    },
    zaloLink: {
      type: String,
      default: '',
    },
    facebookLink: {
      type: String,
      default: '',
    },
    qrCodeUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one document exists
companyInfoSchema.pre('save', async function (next) {
  const count = await mongoose.model('CompanyInfo').countDocuments();
  if (count > 0 && this.isNew) {
    throw new Error('Chỉ được phép có một document CompanyInfo');
  }
  next();
});

export default mongoose.model<ICompanyInfo>('CompanyInfo', companyInfoSchema);