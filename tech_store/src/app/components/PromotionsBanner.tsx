'use client';

import { Button } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface PromotionBanner {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  category: string;
  endDate: string;
}

const PromotionsBanner: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dữ liệu giả lập (thay thế bằng API nếu có)
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        // Giả lập dữ liệu (thay bằng axios.get('/promotions') nếu có API)
        const mockPromotions = [
          {
            id: 1,
            title: 'Khuyến mãi đặc biệt',
            description: 'Giảm đến 30% cho laptop gaming. Chỉ áp dụng đến hết ngày 15/04/2025!',
            buttonText: 'Xem ngay',
            image:
              'https://readdy.ai/api/search-image?query=Gaming%20laptop%20with%20RGB%20keyboard%20glowing%20in%20dark%20environment%2C%20sleek%20design%2C%20on%20a%20simple%20blue%20background%2C%20professional%20product%20photography%20with%20dramatic%20lighting%2C%20high%20resolution%2C%20detailed%20texture%2C%20commercial%20quality&width=300&height=200&seq=12&orientation=landscape',
            category: 'laptop',
            endDate: '2025-04-15',
          },
          {
            id: 2,
            title: 'Phụ kiện cao cấp',
            description: 'Mua 2 tặng 1 cho tất cả phụ kiện. Chỉ áp dụng đến hết ngày 20/04/2025!',
            buttonText: 'Khám phá',
            image:
              'https://readdy.ai/api/search-image?query=Premium%20computer%20accessories%20collection%20including%20wireless%20headphones%2C%20mechanical%20keyboard%20and%20wireless%20mouse%2C%20on%20a%20simple%20purple%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%2C%20high%20resolution%2C%20detailed%20texture%2C%20commercial%20quality&width=300&height=200&seq=13&orientation=landscape',
            category: 'phu-kien-khac',
            endDate: '2025-04-20',
          },
        ];
        setPromotions(mockPromotions);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>;
  }

  if (promotions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        Không có khuyến mãi nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`bg-gradient-to-r ${
              promo.id === 1 ? 'from-blue-600 to-blue-400' : 'from-purple-600 to-purple-400'
            } rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105`}
          >
            <div className="p-8 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-3">{promo.title}</h3>
                <p className="text-white mb-4">{promo.description}</p>
                <Link href={`/promotions?category=${promo.category}`}>
                  <Button
                    type="default"
                    size="large"
                    className={`bg-white ${
                      promo.id === 1 ? 'text-blue-600 hover:bg-blue-50' : 'text-purple-600 hover:bg-purple-50'
                    } !rounded-button whitespace-nowrap transition-colors duration-300`}
                  >
                    {promo.buttonText}
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full max-w-xs object-contain rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/fallback-image.jpg'; // Fallback image nếu lỗi
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsBanner;