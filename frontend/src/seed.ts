import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import CompanyInfo from './models/CompanyInfo';
import connectDB from './config/database';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await CompanyInfo.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@dienlanh.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
    });

    console.log('Admin created:', admin.email);

    // Create categories
    const categories = await Category.create([
      {
        name: 'Điều hòa cây',
        slug: 'dieu-hoa-cay',
        description: 'Điều hòa tủ đứng công suất lớn, phù hợp văn phòng, showroom, nhà xưởng',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/air-conditioner',
        order: 1,
        status: 'active',
      },
      {
        name: 'Quạt điều hòa',
        slug: 'quat-dieu-hoa',
        description: 'Quạt điều hòa hơi nước tiết kiệm điện, làm mát hiệu quả, di động linh hoạt',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/air-cooler',
        order: 2,
        status: 'active',
      },
      {
        name: 'Phụ kiện điều hòa',
        slug: 'phu-kien-dieu-hoa',
        description: 'Phụ kiện chính hãng: Remote, ống đồng, ga điều hòa, dây điện',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/accessories',
        order: 3,
        status: 'inactive',
      },
    ]);

    console.log('Categories created:', categories.length);

    // Create products
    // Trong seed.ts, sửa phần tạo product
    const products = await Product.create([
        {
        name: 'Điều hòa cây Daikin FVRN100BXV1V',
        slug: 'dieu-hoa-cay-daikin-fvrn100bxv1v',
        category: categories[0]._id,
        brand: 'Daikin',
        productModel: 'FVRN100BXV1V',  // Đổi từ model thành productModel
        power: '4.0 HP',
        capacity: '34,400 BTU',
        area: '40-50 m²',
        price: 28900000,
        originalPrice: 35000000,
        images: [
            'https://images.unsplash.com/photo-1762341123870-d706f257a12e?w=500',
        ],
        description: 'Điều hòa tủ đứng Daikin với công nghệ Inverter tiết kiệm điện, làm lạnh nhanh, vận hành êm ái.',
        specifications: [
            { label: 'Công nghệ', value: 'Inverter' },
            { label: 'Gas', value: 'R410A' },
            { label: 'Điện áp', value: '220V/50Hz' },
            { label: 'Độ ồn', value: '42-48 dB' },
        ],
        features: [
            {
            icon: 'zap',
            title: 'Tiết kiệm điện',
            description: 'Công nghệ Inverter tiết kiệm 60% điện năng',
            },
            {
            icon: 'maximize',
            title: 'Làm mát nhanh',
            description: 'Làm lạnh nhanh trong 5 phút',
            },
        ],
        inStock: true,
        stock: 10,
        status: 'active',
        },
        {
        name: 'Điều hòa cây LG APNQ36GR5A4',
        slug: 'dieu-hoa-cay-lg-apnq36gr5a4',
        category: categories[0]._id,
        brand: 'LG',
        productModel: 'APNQ36GR5A4',  // Đổi từ model thành productModel
        power: '4.0 HP',
        capacity: '36,000 BTU',
        area: '40-55 m²',
        price: 26500000,
        originalPrice: 32000000,
        images: [
            'https://images.unsplash.com/photo-1715593949273-09009558300a?w=500',
        ],
        description: 'Điều hòa tủ đứng LG với thiết kế hiện đại, làm mát nhanh, tiết kiệm điện.',
        specifications: [
            { label: 'Công nghệ', value: 'Inverter' },
            { label: 'Gas', value: 'R410A' },
            { label: 'Điện áp', value: '220V/50Hz' },
        ],
        features: [
            {
            icon: 'zap',
            title: 'Tiết kiệm điện',
            description: 'Công nghệ Inverter tiết kiệm 50%',
            },
        ],
        inStock: true,
        stock: 5,
        status: 'active',
        },
        {
        name: 'Quạt điều hòa Kangaroo KG50F66',
        slug: 'quat-dieu-hoa-kangaroo-kg50f66',
        category: categories[1]._id,
        brand: 'Kangaroo',
        productModel: 'KG50F66',  // Đổi từ model thành productModel
        power: '8000m³/h',
        capacity: '8000 m³/h',
        area: '30-40 m²',
        price: 3890000,
        originalPrice: 4500000,
        images: [
            'https://images.unsplash.com/photo-1610223864085-0c85c8735e15?w=500',
        ],
        description: 'Quạt điều hòa Kangaroo với bình chứa nước lớn, làm mát tự nhiên, di động linh hoạt.',
        specifications: [
            { label: 'Công suất', value: '200W' },
            { label: 'Bình chứa', value: '45L' },
            { label: 'Điện áp', value: '220V' },
        ],
        features: [
            {
            icon: 'fan',
            title: 'Làm mát tự nhiên',
            description: 'Hơi nước làm mát tự nhiên, an toàn',
            },
        ],
        inStock: true,
        stock: 15,
        status: 'active',
        },
    ]);

    // Create company info
    const companyInfo = await CompanyInfo.create({
      companyName: 'Công ty TNHH Điện Lạnh ABC',
      phone: '1900 1234',
      email: 'info@dienlanh.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      workingHours: 'Thứ 2 - Thứ 7: 8:00 - 18:00',
      zaloLink: 'https://zalo.me/0901234567',
      facebookLink: 'https://facebook.com/dienlanhpro',
      qrCodeUrl: 'https://images.unsplash.com/photo-1609770231080-e321deccc34c?w=200',
    });

    console.log('Company info created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();