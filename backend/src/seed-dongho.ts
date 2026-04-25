import dotenv from 'dotenv';
import Category from './models/Category';
import Product from './models/Product';
import CompanyInfo from './models/CompanyInfo';
import connectDB from './config/database';

dotenv.config();

const seedDongho = async () => {
  try {
    await connectDB();

    // Clear only content data — keep User intact
    await Category.deleteMany({});
    await Product.deleteMany({});
    await CompanyInfo.deleteMany({});
    console.log('Cleared categories, products, companyInfo');

    // Categories
    const categories = await Category.create([
      {
        name: 'Đồng hồ nam',
        slug: 'dong-ho-nam',
        description: 'Đồng hồ nam cao cấp, thể thao và lịch lãm',
        image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500',
        order: 1,
        status: 'active',
      },
      {
        name: 'Đồng hồ nữ',
        slug: 'dong-ho-nu',
        description: 'Đồng hồ nữ thanh lịch, thời trang và sang trọng',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
        order: 2,
        status: 'active',
      },
      {
        name: 'Smartwatch',
        slug: 'smartwatch',
        description: 'Đồng hồ thông minh theo dõi sức khỏe, kết nối smartphone',
        image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500',
        order: 3,
        status: 'active',
      },
      {
        name: 'Phụ kiện đồng hồ',
        slug: 'phu-kien-dong-ho',
        description: 'Dây đeo, kính cường lực, hộp đựng đồng hồ chính hãng',
        image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=500',
        order: 4,
        status: 'active',
      },
    ]);
    console.log('Categories created:', categories.length);

    // Products
    // power → thời lượng pin, capacity → kích thước mặt, area → đối tượng
    const products = await Product.create([
      {
        name: 'Casio G-Shock GA-100-1A1DR',
        slug: 'casio-g-shock-ga-100-1a1dr',
        category: categories[0]._id,
        brand: 'Casio',
        productModel: 'GA-100-1A1DR',
        power: '2 năm',
        capacity: '55.5mm',
        area: 'Nam',
        price: 2850000,
        originalPrice: 3200000,
        images: [
          'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
        ],
        description: 'Đồng hồ Casio G-Shock chống va đập, chống nước 200m, thiết kế mạnh mẽ phong cách thể thao.',
        specifications: [
          { label: 'Kích thước mặt', value: '55.5 x 51.2 mm' },
          { label: 'Chống nước', value: '200m' },
          { label: 'Bộ máy', value: 'Pin (Battery)' },
          { label: 'Chất liệu dây', value: 'Nhựa Resin' },
          { label: 'Chất liệu vỏ', value: 'Nhựa Resin' },
        ],
        features: [
          { icon: 'shield', title: 'Chống va đập', description: 'Chuẩn kháng rung G-Shock' },
          { icon: 'droplets', title: 'Chống nước 200m', description: 'Phù hợp lặn biển' },
        ],
        inStock: true,
        stock: 20,
        status: 'active',
        fieldVisibility: { brand: true, model: true, power: true, capacity: true, area: true },
      },
      {
        name: 'Seiko 5 Sports SRPD55K1',
        slug: 'seiko-5-sports-srpd55k1',
        category: categories[0]._id,
        brand: 'Seiko',
        productModel: 'SRPD55K1',
        power: 'Cơ tự động',
        capacity: '42.5mm',
        area: 'Nam',
        price: 5200000,
        originalPrice: 6500000,
        images: [
          'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500',
        ],
        description: 'Đồng hồ cơ tự động Seiko 5 Sports, bộ máy NH36A nổi tiếng bền bỉ, kính Hardlex chống trầy.',
        specifications: [
          { label: 'Bộ máy', value: 'Automatic NH36A' },
          { label: 'Kích thước', value: '42.5mm' },
          { label: 'Chống nước', value: '100m' },
          { label: 'Kính', value: 'Hardlex' },
        ],
        features: [
          { icon: 'settings', title: 'Cơ tự động', description: 'Không cần pin, tự nạp bằng chuyển động' },
          { icon: 'eye', title: 'Lịch ngày', value: 'Hiển thị ngày tháng' },
        ],
        inStock: true,
        stock: 12,
        status: 'active',
        fieldVisibility: { brand: true, model: true, power: true, capacity: true, area: true },
      },
      {
        name: 'Daniel Wellington Classic Petite 28mm',
        slug: 'daniel-wellington-classic-petite-28mm',
        category: categories[1]._id,
        brand: 'Daniel Wellington',
        productModel: 'DW00100164',
        power: '2 năm',
        capacity: '28mm',
        area: 'Nữ',
        price: 3490000,
        originalPrice: 4200000,
        images: [
          'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500',
        ],
        description: 'Đồng hồ nữ Daniel Wellington thanh lịch tối giản, dây da màu trắng kem, mặt trắng tinh tế.',
        specifications: [
          { label: 'Kích thước mặt', value: '28mm' },
          { label: 'Chất liệu dây', value: 'Da thật' },
          { label: 'Chống nước', value: '30m' },
          { label: 'Bộ máy', value: 'Quartz' },
        ],
        features: [
          { icon: 'star', title: 'Thiết kế tối giản', description: 'Phong cách Scandinavian tinh tế' },
          { icon: 'repeat', title: 'Thay dây dễ dàng', description: 'Hệ thống quick-release' },
        ],
        inStock: true,
        stock: 18,
        status: 'active',
        fieldVisibility: { brand: true, model: true, power: true, capacity: true, area: true },
      },
      {
        name: 'Apple Watch Series 9 (GPS, 45mm)',
        slug: 'apple-watch-series-9-gps-45mm',
        category: categories[2]._id,
        brand: 'Apple',
        productModel: 'MR9A3VN/A',
        power: '18 giờ',
        capacity: '45mm',
        area: 'Nam / Nữ',
        price: 10990000,
        originalPrice: 12990000,
        images: [
          'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500',
        ],
        description: 'Apple Watch Series 9 với chip S9 SiP mới, màn hình Retina Always-On, theo dõi sức khỏe toàn diện.',
        specifications: [
          { label: 'Chip', value: 'Apple S9 SiP' },
          { label: 'Màn hình', value: 'LTPO OLED Always-On' },
          { label: 'Chống nước', value: '50m (WR50)' },
          { label: 'Kết nối', value: 'Bluetooth 5.3, Wi-Fi, NFC' },
          { label: 'Pin', value: '18 giờ' },
        ],
        features: [
          { icon: 'heart', title: 'Theo dõi sức khỏe', description: 'ECG, SpO2, nhiệt độ da' },
          { icon: 'zap', title: 'Sạc nhanh', description: 'Sạc 80% chỉ trong 45 phút' },
        ],
        inStock: true,
        stock: 8,
        status: 'active',
        fieldVisibility: { brand: true, model: true, power: true, capacity: true, area: true },
      },
      {
        name: 'Samsung Galaxy Watch 6 Classic 47mm',
        slug: 'samsung-galaxy-watch-6-classic-47mm',
        category: categories[2]._id,
        brand: 'Samsung',
        productModel: 'SM-R960NZKAXSP',
        power: '40 giờ',
        capacity: '47mm',
        area: 'Nam / Nữ',
        price: 8490000,
        originalPrice: 9990000,
        images: [
          'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=500',
        ],
        description: 'Samsung Galaxy Watch 6 Classic với vòng bezel xoay huyền thoại, theo dõi giấc ngủ nâng cao, tương thích Android.',
        specifications: [
          { label: 'Chip', value: 'Exynos W930' },
          { label: 'Màn hình', value: 'AMOLED 1.5 inch' },
          { label: 'RAM / ROM', value: '2GB / 16GB' },
          { label: 'Chống nước', value: '5ATM + IP68' },
          { label: 'Pin', value: '425mAh' },
        ],
        features: [
          { icon: 'rotate-cw', title: 'Bezel xoay', description: 'Điều hướng trực quan, cảm giác đồng hồ thật' },
          { icon: 'moon', title: 'Theo dõi giấc ngủ', description: 'Phân tích các giai đoạn ngủ chi tiết' },
        ],
        inStock: true,
        stock: 10,
        status: 'active',
        fieldVisibility: { brand: true, model: true, power: true, capacity: true, area: true },
      },
    ]);
    console.log('Products created:', products.length);

    // Company info
    await CompanyInfo.create({
      companyName: 'Bình Minh Smartwatch',
      phone: '0909 123 456',
      email: 'info@binhminhsmartwatch.com',
      address: '456 Đường Lê Lợi, Quận 1, TP.HCM',
      workingHours: 'Thứ 2 - Chủ Nhật: 8:00 - 21:00',
      zaloLink: 'https://zalo.me/0909123456',
      facebookLink: 'https://facebook.com/binhminhsmartwatch',
      qrCodeUrl: '',
      logoUrl: '',
      bannerText: 'Đồng hồ chính hãng — Uy tín hàng đầu',
      bannerSubtext: 'Chuyên cung cấp đồng hồ nam, nữ và smartwatch chính hãng. Bảo hành tận nơi, đổi trả trong 7 ngày.',
      bannerImageUrl: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1080',
      quoteBannerImageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1080',
      policyContent: '',
    });
    console.log('Company info created');

    console.log('✓ Seed đồng hồ hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDongho();
