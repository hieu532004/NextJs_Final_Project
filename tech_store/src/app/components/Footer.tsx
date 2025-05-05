'use client';
import { Divider } from 'antd';
import { FacebookOutlined, InstagramOutlined, YoutubeOutlined, TwitterOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">TechStore</h3>
            <p className="mb-4">Cung cấp các sản phẩm công nghệ chính hãng với giá tốt nhất thị trường.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <FacebookOutlined className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <InstagramOutlined className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <YoutubeOutlined className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <TwitterOutlined className="text-xl" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Thông tin</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Giới thiệu</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Tin tức công nghệ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Tuyển dụng</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Khuyến mãi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Chính sách</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Chính sách bảo hành</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Chính sách vận chuyển</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Chính sách đổi trả</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <EnvironmentOutlined className="mt-1 mr-3" />
                <span>123 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng</span>
              </li>
              <li className="flex items-center">
                <PhoneOutlined className="mr-3" />
                <span>Hotline: 1900 1234</span>
              </li>
              <li className="flex items-center">
                <MailOutlined className="mr-3" />
                <span>Email: info@techstore.vn</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-lg font-bold text-white mb-2">Phương thức thanh toán</h4>
              <div className="flex space-x-3">
                <i className="fab fa-cc-visa text-2xl"></i>
                <i className="fab fa-cc-mastercard text-2xl"></i>
                <i className="fab fa-cc-paypal text-2xl"></i>
                <i className="fas fa-money-bill-wave text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
        <Divider className="border-gray-700" />
        <div className="text-center text-gray-400 text-sm">
          <p>© 2025 TechStore. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;