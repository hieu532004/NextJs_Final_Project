// src/app/components/MobileMenuDrawer.tsx
'use client';

import { Drawer, Badge, Input } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext'; // Sử dụng useCart
import { Category } from '../types';

interface MobileMenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
}

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ visible, onClose, categories }) => {
  const { cartCount } = useCart(); // Dùng useCart thay vì useContext

  return (
    <Drawer
      title="TechStore"
      placement="right"
      onClose={onClose}
      open={visible}
      width={300}
      className="[&_.ant-drawer-body]:p-4"
    >
      <div className="space-y-6">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          prefix={<SearchOutlined />}
          className="!rounded-full"
        />
        <div className="space-y-4">
          <Link href="/" onClick={onClose}>
            <div className="flex items-center space-x-2 text-gray-800 hover:text-blue-600">
              <HomeOutlined className="text-lg" />
              <span>Trang chủ</span>
            </div>
          </Link>
          <Link href="/cart" onClick={onClose}>
            <div className="flex items-center space-x-2 text-gray-800 hover:text-blue-600">
              <ShoppingCartOutlined className="text-lg" />
              <span>Giỏ hàng</span>
              <Badge count={cartCount} />
            </div>
          </Link>
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Danh mục</h3>
            {categories.map((category) => (
              <Link key={category.id} href={`/products/${category.slug}`} onClick={onClose}>
                <div className="flex items-center space-x-2 text-gray-800 hover:text-blue-600">
                  <span>{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileMenuDrawer;