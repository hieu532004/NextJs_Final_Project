'use client';

import { Divider } from 'antd';
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  TwitterOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">TechStore</h3>
            <p className="mb-4 text-gray-400">Cung cấp các sản phẩm công nghệ chính hãng với giá tốt nhất thị trường.</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FacebookOutlined className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <InstagramOutlined className="text-xl" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <YoutubeOutlined className="text-xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <TwitterOutlined className="text-xl" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Thông tin</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Tin tức công nghệ
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Chính sách</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/warranty" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/return" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-400">
                <EnvironmentOutlined className="mt-1 mr-3 text-gray-400" />
                <span>123 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng</span>
              </li>
              <li className="flex items-center text-gray-400">
                <PhoneOutlined className="mr-3 text-gray-400" />
                <span>Hotline: 1900 1234</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MailOutlined className="mr-3 text-gray-400" />
                <span>
                  <a href="mailto:info@techstore.vn" className="hover:text-white transition-colors duration-300">
                    Email: info@techstore.vn
                  </a>
                </span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-lg font-bold text-white mb-2">Phương thức thanh toán</h4>
              <div className="flex space-x-3">
                <i className="fab fa-cc-visa text-2xl text-gray-400 hover:text-white transition-colors duration-300"></i>
                <i className="fab fa-cc-mastercard text-2xl text-gray-400 hover:text-white transition-colors duration-300"></i>
                <i className="fab fa-cc-paypal text-2xl text-gray-400 hover:text-white transition-colors duration-300"></i>
                <i className="fas fa-money-bill-wave text-2xl text-gray-400 hover:text-white transition-colors duration-300"></i>
              </div>
            </div>
          </div>
        </div>
        <Divider className="border-gray-700" />
        <div className="text-center text-gray-500 text-sm">
          <p>
            © 2025 TechStore. Tất cả các quyền được bảo lưu. |{' '}
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
              Điều khoản
            </Link>{' '}
            |{' '}
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
              Bảo mật
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;