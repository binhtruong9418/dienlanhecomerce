import { Zap, Maximize2, Wrench } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      icon: Zap,
      title: 'Tiết kiệm điện',
      description: 'Công nghệ Inverter giúp tiết kiệm đến 60% điện năng so với máy thường. Vận hành êm ái, ổn định.',
      color: 'bg-yellow-500',
    },
    {
      icon: Maximize2,
      title: 'Làm mát diện rộng',
      description: 'Công suất lớn, phù hợp cho không gian từ 30-80m². Luồng gió mạnh mẽ, phân bổ đều khắp phòng.',
      color: 'bg-blue-500',
    },
    {
      icon: Wrench,
      title: 'Bền bỉ, dễ bảo trì',
      description: 'Thiết kế chắc chắn, tuổi thọ cao. Dễ dàng vệ sinh, bảo trì định kỳ. Hỗ trợ kỹ thuật 24/7.',
      color: 'bg-green-500',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Lợi ích vượt trội</h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Những ưu điểm nổi bật khi sử dụng sản phẩm của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-secondary-50 hover:bg-white hover:shadow-xl transition-all group border-2 border-transparent hover:border-primary-500"
              >
                <div className={`${benefit.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-3">{benefit.title}</h3>
                <p className="text-secondary-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
