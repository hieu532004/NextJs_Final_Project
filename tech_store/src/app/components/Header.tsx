// src/app/components/Header.tsx
'use client';

import { Input, Badge, Button } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext'; // Sử dụng useCart

interface HeaderProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchValue, setSearchValue, toggleMobileMenu }) => {
  const { cartCount } = useCart(); // Dùng useCart thay vì useContext

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="TechStore Logo" width={120} height={40} priority />
        </Link>
        <div className="flex-1 mx-4">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="!rounded-full"
            size="large"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/account">
            <Button type="text" icon={<UserOutlined />} className="text-gray-600 hover:text-blue-600" />
          </Link>
          <Link href="/cart">
            <Badge count={cartCount} className="[&_.ant-badge-count]:!bg-red-600 [&_.ant-badge-count]:!text-white">
              <Button
                type="text"
                icon={<ShoppingCartOutlined />}
                className="text-gray-600 hover:text-blue-600"
              />
            </Badge>
          </Link>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-600 hover:text-blue-600"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;