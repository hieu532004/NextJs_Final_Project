'use client';
import { Button } from 'antd';

const PromotionsBanner: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg overflow-hidden shadow-lg">
          <div className="p-8 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-3">Khuyến mãi đặc biệt</h3>
              <p className="text-blue-50 mb-4">
                Giảm đến 30% cho laptop gaming. Chỉ áp dụng đến hết ngày 15/04/2025!
              </p>
              <Button
                type="default"
                size="large"
                className="bg-white text-blue-600 hover:bg-blue-50 !rounded-button whitespace-nowrap"
              >
                Xem ngay
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://readdy.ai/api/search-image?query=Gaming%20laptop%20with%20RGB%20keyboard%20glowing%20in%20dark%20environment%2C%20sleek%20design%2C%20on%20a%20simple%20blue%20background%2C%20professional%20product%20photography%20with%20dramatic%20lighting%2C%20high%20resolution%2C%20detailed%20texture%2C%20commercial%20quality&width=300&height=200&seq=12&orientation=landscape"
                alt="Gaming Laptop Promotion"
                className="w-full max-w-xs"
              />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg overflow-hidden shadow-lg">
          <div className="p-8 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-3">Phụ kiện cao cấp</h3>
              <p className="text-purple-50 mb-4">
                Mua 2 tặng 1 cho tất cả phụ kiện. Chỉ áp dụng đến hết ngày 20/04/2025!
              </p>
              <Button
                type="default"
                size="large"
                className="bg-white text-purple-600 hover:bg-purple-50 !rounded-button whitespace-nowrap"
              >
                Khám phá
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://readdy.ai/api/search-image?query=Premium%20computer%20accessories%20collection%20including%20wireless%20headphones%2C%20mechanical%20keyboard%20and%20wireless%20mouse%2C%20on%20a%20simple%20purple%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%2C%20high%20resolution%2C%20detailed%20texture%2C%20commercial%20quality&width=300&height=200&seq=13&orientation=landscape"
                alt="Accessories Promotion"
                className="w-full max-w-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsBanner;