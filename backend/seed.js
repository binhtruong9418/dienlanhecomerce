const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ducbinh:o0JsVyDqAEnSckXe@quathoinuoc.qryek6q.mongodb.net/dienlanh';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Seed'))
  .catch(err => console.error('Error connecting to MongoDB', err));

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  order: Number,
  status: { type: String, default: 'active' },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: String,
  productModel: String,
  power: String,
  capacity: String,
  area: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  description: String,
  specifications: [{ label: String, value: String }],
  features: [{ icon: String, title: String, description: String }],
  inStock: Boolean,
  stock: Number,
  status: { type: String, default: 'active' }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const categoriesData = [
  {
    name: "Điều Hòa Cây",
    slug: "dieu-hoa-cay",
    description: "Điều hòa tủ đứng công suất lớn cho không gian rộng.",
    image: "https://dienmayrenhat.com.vn/wp-content/uploads/2019/04/dieu-hoa-cay-daikin-1.jpg",
    order: 1
  },
  {
    name: "Quạt Hơi Nước",
    slug: "quat-hoi-nuoc",
    description: "Quạt điều hòa, quạt làm mát bay hơi lý tưởng cho nhà xưởng, quán ăn.",
    image: "https://quatcongnghiepviet.com/wp-content/uploads/2021/04/quat-dieu-hoa-makano-mka-04000a.jpg",
    order: 2
  }
];

const getRichText = (name) => {
  return `
  <h2 style="color: #0b5394;"><strong>Giới thiệu tổng quan ${name}</strong></h2>
  <p>Sản phẩm <span style="color: #e06666;"><strong>${name}</strong></span> là giải pháp làm mát hàng đầu, được thiết kế chuyên biệt để mang lại trải nghiệm tối ưu cho người dùng. Thừa hưởng tinh hoa công nghệ đỉnh cao, thiết bị này không chỉ sở hữu công suất mạnh mẽ mà còn được tối ưu hóa khả năng tiêu thụ điện năng.</p>
  <h3><span style="color: #38761d;">Tính năng đặc trưng:</span></h3>
  <ul>
  <li><span style="color: #000000;"><strong>Luồng gió cực mạnh &amp; Cực êm:</strong> Phân bổ không khí lạnh trải rộng với thiết kế quạt lồng sóc thông minh.</span></li>
  <li><span style="color: #000000;"><strong>Thiết kế tinh tế &amp; Sang trọng:</strong> Màn hình tinh thể lấp lánh (Ice Crystal) giúp người dùng điều khiển và theo dõi dễ dàng.</span></li>
  <li><span style="color: #000000;"><strong>Công nghệ làm sạch không khí:</strong> Giữ bầu không khí luôn tươi mát nhờ bộ lọc bụi thô thông minh.</span></li>
  </ul>
  <p><em>Hãy sắm ngay siêu phẩm này để tận hưởng không gian sống đẳng cấp và mát rượi trong mùa hè rực lửa! Mọi chi tiết bảo hành đều cam kết 100% chính hãng dài hạn.</em></p>
  <table style="border-collapse: collapse; width: 100%; border-color: #b7b7b7; border-style: solid;" border="1">
  <tbody>
  <tr>
  <td style="width: 50%; padding: 10px;"><strong>Thương hiệu uy tín</strong></td>
  <td style="width: 50%; padding: 10px;">Đạt chứng nhận an toàn thiết bị gia dụng</td>
  </tr>
  <tr>
  <td style="width: 50%; padding: 10px;"><strong>Linh kiện nâng cấp</strong></td>
  <td style="width: 50%; padding: 10px;">Dàn đồng chống rỉ sét</td>
  </tr>
  </tbody>
  </table>
  `;
}

const seedDB = async () => {
  try {
    console.log('Seeding Categories...');
    const createdCats = await Category.insertMany(categoriesData);

    const productsData = [
      {
        name: "Điều hòa tủ đứng Daikin 28000 BTU 1 chiều FVRN71BXV1V/RR71CBXV1V",
        slug: "dieu-hoa-tu-dung-daikin-fvrn71bxv1v",
        category: createdCats[0]._id,
        brand: "Daikin",
        productModel: "FVRN71BXV1V",
        power: "3.0 HP",
        capacity: "28,000 BTU",
        area: "40-50m2",
        price: 32500000,
        originalPrice: 35000000,
        images: ["https://dientudienlanhbachkhoa.com/wp-content/uploads/2020/05/2-102.jpg"],
        description: getRichText("Điều hòa tủ đứng Daikin 28000 BTU 1 chiều FVRN71BXV1V"),
        specifications: [
          { label: "Loại Gas", value: "R410A" },
          { label: "Công nghệ", value: "Standard" },
          { label: "Xuất xứ", value: "Malaysia" }
        ],
        features: [
          { icon: "zap", title: "Làm lạnh Nhanh", description: "Chế độ Turbo siêu tốc" },
          { icon: "wind", title: "Đảo gió đều", description: "4 hướng gió tự động" }
        ],
        inStock: true,
        stock: 12
      },
      {
        name: "Điều hòa tủ đứng Panasonic Inverter 2 HP CU/CS-E18NFQ",
        slug: "dieu-hoa-tu-dung-panasonic-e18nfq",
        category: createdCats[0]._id,
        brand: "Panasonic",
        productModel: "E18NFQ",
        power: "2.0 HP",
        capacity: "18,000 BTU",
        area: "20-30m2",
        price: 24900000,
        originalPrice: 28000000,
        images: ["https://dientudienlanhbachkhoa.com/wp-content/uploads/2020/05/E28NFQ.jpg"],
        description: getRichText("Điều hòa tủ đứng Panasonic Inverter 2 HP CU/CS-E18NFQ"),
        specifications: [
          { label: "Loại Gas", value: "R32" },
          { label: "Công nghệ", value: "Nanoe-G, Inverter" }
        ],
        features: [
          { icon: "zap", title: "Tiết kiệm 50%", description: "Công nghệ tiên tiến" }
        ],
        inStock: true,
        stock: 5
      },
      {
        name: "Quạt điều hòa không khí Boss S106",
        slug: "quat-dieu-hoa-khong-khi-boss-s106",
        category: createdCats[1]._id,
        brand: "Boss",
        productModel: "S106",
        power: "160W",
        capacity: "3000 m3/h",
        area: "25-30m2",
        price: 4990000,
        originalPrice: 6000000,
        images: ["https://dienmaycholon.vn/public/picture/product/product22617/quat-dieu-hoa-s_163.jpg"],
        description: getRichText("Quạt điều hòa không khí Boss S106"),
        specifications: [
          { label: "Dung tích nước", value: "30 Lít" },
          { label: "Tốc độ gió", value: "3 mức gió" }
        ],
        features: [
          { icon: "wind", title: "Cực mát", description: "Hơi nước dịu nhẹ" },
          { icon: "shield", title: "Lọc bụi", description: "Giữ không gian sạch sẽ" }
        ],
        inStock: true,
        stock: 20
      },
      {
        name: "Máy Làm Mát Không Khí Sunhouse SHD7746",
        slug: "may-lam-mat-khong-khi-sunhouse-shd7746",
        category: createdCats[1]._id,
        brand: "Sunhouse",
        productModel: "SHD7746",
        power: "110W",
        capacity: "4500 m3/h",
        area: "30-40m2",
        price: 3500000,
        originalPrice: 4200000,
        images: ["https://cdn.tgdd.vn/Products/Images/7306/208865/quat-dieu-hoa-sunhouse-shd7746-1-org.jpg"],
        description: getRichText("Máy Làm Mát Không Khí Sunhouse SHD7746"),
        specifications: [
          { label: "Dung tích nước", value: "45 Lít" },
          { label: "Hãng", value: "Sunhouse" }
        ],
        features: [
          { icon: "zap", title: "Siêu bền bỉ", description: "Động cơ dây lõi đồng" },
        ],
        inStock: true,
        stock: 15
      }
    ];

    console.log('Seeding Products...');
    await Product.insertMany(productsData);

    console.log('Seed Thêm Mới Mock Data Thành Công!');
    process.exit();
  } catch(e) {
    console.error('Seed errors:', e);
    process.exit(1);
  }
}

seedDB();
