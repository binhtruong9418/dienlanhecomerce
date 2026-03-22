import { Shield, Truck, Headphones, Award, Wrench, CreditCard } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Bảo hành chính hãng',
      description: 'Bảo hành 24 tháng, hỗ trợ kỹ thuật trọn đời',
    },
    {
      icon: Truck,
      title: 'Giao hàng & lắp đặt miễn phí',
      description: 'Miễn phí vận chuyển và lắp đặt tận nơi',
    },
    {
      icon: Headphones,
      title: 'Tư vấn chuyên nghiệp',
      description: 'Đội ngũ kỹ thuật tư vấn 24/7',
    },
    {
      icon: Award,
      title: 'Sản phẩm chính hãng',
      description: '100% hàng chính hãng, có tem nhãn',
    },
    {
      icon: Wrench,
      title: 'Bảo trì định kỳ',
      description: 'Dịch vụ bảo trì, vệ sinh máy định kỳ',
    },
    {
      icon: CreditCard,
      title: 'Thanh toán linh hoạt',
      description: 'Hỗ trợ trả góp 0%, nhiều hình thức thanh toán',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Cam kết của chúng tôi</h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Mang đến dịch vụ tốt nhất cho khách hàng với các chính sách ưu đãi và hỗ trợ toàn diện
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-xl hover:bg-secondary-50 transition-colors group"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h4 className="mb-2">{feature.title}</h4>
                  <p className="text-sm text-secondary-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
