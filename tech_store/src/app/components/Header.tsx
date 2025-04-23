// src/app/components/Header.tsx
'use client';

import { Input, Badge, Button, Dropdown, Menu, Drawer, Collapse } from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  UserOutlined,
  LaptopOutlined,
  TabletOutlined,
  AudioOutlined,
  ThunderboltOutlined,
  DownOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const { Panel } = Collapse;

interface HeaderProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchValue, setSearchValue }) => {
  const { cartCount } = useCart();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => setMobileMenuVisible(!mobileMenuVisible);

  // Dropdown Menus for Desktop
  const laptopMenu = (
    <Menu>
      <Menu.Item key="1">Laptop Gaming</Menu.Item>
      <Menu.Item key="2">Laptop Văn Phòng</Menu.Item>
      <Menu.Item key="3">Laptop Đồ Họa</Menu.Item>
      <Menu.Item key="4">MacBook</Menu.Item>
    </Menu>
  );

  const accessoriesMenu = (
    <Menu>
      <Menu.Item key="1">Chuột</Menu.Item>
      <Menu.Item key="2">Bàn phím</Menu.Item>
      <Menu.Item key="3">Tai nghe</Menu.Item>
      <Menu.Item key="4">Balo laptop</Menu.Item>
    </Menu>
  );

  const officeEquipmentMenu = (
    <Menu>
      <Menu.Item key="1">Màn hình</Menu.Item>
      <Menu.Item key="2">Máy in</Menu.Item>
      <Menu.Item key="3">Máy scan</Menu.Item>
      <Menu.Item key="4">Máy chiếu</Menu.Item>
    </Menu>
  );

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Main Header Row */}
          <div className="flex items-center justify-between py-4">
            {/* Logo and Search (Desktop) */}
            <div className="flex items-center">
              <Link href="/" className="mr-8">
                <h1 className="text-2xl font-bold text-blue-600 m-0">TechStore</h1>
              </Link>
              <div className="hidden lg:block">
                <Input
                  size="large"
                  placeholder="Tìm kiếm sản phẩm..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-96 !rounded-full"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>

            {/* Cart, Account, Mobile Menu Toggle */}
            <div className="flex items-center">
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/cart">
                  <Badge
                    count={cartCount}
                    className="[&_.ant-badge-count]:!bg-red-600 [&_.ant-badge-count]:!text-white cursor-pointer"
                  >
                    <ShoppingCartOutlined className="text-2xl text-gray-700" />
                  </Badge>
                </Link>
                <Link href="/account" className="flex items-center cursor-pointer">
                  <UserOutlined className="text-2xl text-gray-700" />
                  <span className="ml-2 text-gray-700">Đăng nhập</span>
                </Link>
              </div>
              <div className="block lg:hidden ml-4">
                <Button
                  type="text"
                  icon={<MenuOutlined className="text-xl" />}
                  onClick={toggleMobileMenu}
                  className="text-gray-600 hover:text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Search Bar (Mobile) */}
          <div className="block lg:hidden py-3">
            <Input
              size="large"
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-full !rounded-full"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* Navigation and Hotline (Desktop) */}
          <div className="hidden lg:block border-t border-gray-200">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-8">
                <Dropdown overlay={laptopMenu}>
                  <a className="text-gray-700 hover:text-blue-600 cursor-pointer flex items-center">
                    <LaptopOutlined className="mr-1" /> Laptop{' '}
                    <DownOutlined className="text-xs ml-1" />
                  </a>
                </Dropdown>
                <Dropdown overlay={accessoriesMenu}>
                  <a className="text-gray-700 hover:text-blue-600 cursor-pointer flex items-center">
                    <TabletOutlined className="mr-1" /> Phụ kiện{' '}
                    <DownOutlined className="text-xs ml-1" />
                  </a>
                </Dropdown>
                <Dropdown overlay={officeEquipmentMenu}>
                  <a className="text-gray-700 hover:text-blue-600 cursor-pointer flex items-center">
                    <AudioOutlined className="mr-1" /> Thiết bị văn phòng{' '}
                    <DownOutlined className="text-xs ml-1" />
                  </a>
                </Dropdown>
                <Link
                  href="/promotions"
                  className="text-gray-700 hover:text-blue-600 cursor-pointer flex items-center"
                >
                  <ThunderboltOutlined className="mr-1" /> Khuyến mãi
                </Link>
              </div>
              <div>
                <a className="text-red-600 font-medium cursor-pointer">Hotline: 1900 1234</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={toggleMobileMenu}
        open={mobileMenuVisible}
        width={280}
      >
        <div className="space-y-4">
          {/* Cart */}
          <Link href="/cart" className="flex items-center justify-between py-3 border-b">
            <Badge
              count={cartCount}
              className="[&_.ant-badge-count]:!bg-red-600 [&_.ant-badge-count]:!text-white cursor-pointer"
            >
              <ShoppingCartOutlined className="text-2xl text-gray-700" />
              <span className="ml-2 text-gray-700">Giỏ hàng</span>
            </Badge>
          </Link>

          {/* Account */}
          <Link href="/account" className="flex items-center justify-between py-3 border-b cursor-pointer">
            <div className="flex items-center">
              <UserOutlined className="text-2xl text-gray-700" />
              <span className="ml-2 text-gray-700">Đăng nhập / Đăng ký</span>
            </div>
          </Link>

          {/* Collapsible Navigation */}
          <Collapse ghost expandIconPosition="right">
            <Panel
              header={
                <span className="text-gray-700">
                  <LaptopOutlined className="mr-2" /> Laptop
                </span>
              }
              key="1"
            >
              <div className="pl-8 space-y-3">
                <Link href="/laptop/gaming" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Laptop Gaming
                </Link>
                <Link href="/laptop/office" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Laptop Văn Phòng
                </Link>
                <Link href="/laptop/design" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Laptop Đồ Họa
                </Link>
                <Link href="/laptop/macbook" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  MacBook
                </Link>
              </div>
            </Panel>
            <Panel
              header={
                <span className="text-gray-700">
                  <TabletOutlined className="mr-2" /> Phụ kiện
                </span>
              }
              key="2"
            >
              <div className="pl-8 space-y-3">
                <Link href="/accessories/mouse" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Chuột
                </Link>
                <Link href="/accessories/keyboard" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Bàn phím
                </Link>
                <Link href="/accessories/headphones" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Tai nghe
                </Link>
                <Link href="/accessories/backpack" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Balo laptop
                </Link>
              </div>
            </Panel>
            <Panel
              header={
                <span className="text-gray-700">
                  <AudioOutlined className="mr-2" /> Thiết bị văn phòng
                </span>
              }
              key="3"
            >
              <div className="pl-8 space-y-3">
                <Link href="/office/monitor" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Màn hình
                </Link>
                <Link href="/office/printer" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Máy in
                </Link>
                <Link href="/office/scanner" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Máy scan
                </Link>
                <Link href="/office/projector" className="text-gray-700 cursor-pointer hover:text-blue-600 block">
                  Máy chiếu
                </Link>
              </div>
            </Panel>
          </Collapse>

          {/* Promotions */}
          <Link href="/promotions" className="flex items-center py-3 border-b cursor-pointer">
            <ThunderboltOutlined className="mr-2 text-gray-700" />
            <span className="text-gray-700">Khuyến mãi</span>
          </Link>

          {/* Hotline */}
          <div className="pt-4">
            <div className="text-red-600 font-medium">Hotline: 1900 000</div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;