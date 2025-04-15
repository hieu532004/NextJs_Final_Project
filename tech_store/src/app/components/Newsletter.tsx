'use client';
import { Button, Input } from 'antd';

const Newsletter: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-600 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Đăng ký nhận tin</h3>
            <p className="text-blue-100 mb-0">Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt</p>
          </div>
          <div className="md:w-1/2">
            <div className="flex flex-col sm:flex-row">
              <Input size="large" placeholder="Email của bạn" className="rounded-l-full flex-1 border-none" />
              <Button
                type="primary"
                size="large"
                className="mt-3 sm:mt-0 bg-white text-blue-600 hover:bg-blue-50 rounded-r-full sm:rounded-l-none !rounded-button whitespace-nowrap"
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;