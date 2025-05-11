'use client';

import { Input, Badge, Button, Dropdown, Menu, Drawer, Collapse, List, Spin, Image } from 'antd';
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
import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../contexts/authContext';

const { Panel } = Collapse;



interface HeaderProps {
    searchValue: string;
    setSearchValue: (value: string) => void;
    toggleMobileMenu?: () => void;
  }

interface Product {
  _id: string;
  id: number;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  slug: string;
  brand?: string;
}

const Header: React.FC<HeaderProps> = ({ searchValue, setSearchValue, toggleMobileMenu  }) => {
  const { cartCount } = useCart();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user: loggedInUser, logout } = useAuth();

  const handleMobileMenuToggle = () => {
    if (toggleMobileMenu) {
      toggleMobileMenu();
    }
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const createQueryString = (category: string) => {
    const params = new URLSearchParams();
    params.set('category', category);
    return `/products?${params.toString()}`;
  };

  // Dropdown Menus for Desktop
  const laptopMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => router.push(createQueryString('laptop'))}>
        Laptop
      </Menu.Item>
    </Menu>
  );

  const accessoriesMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => router.push(createQueryString('chuot'))}>
        Chuột
      </Menu.Item>
      <Menu.Item key="2" onClick={() => router.push(createQueryString('ban-phim'))}>
        Bàn phím
      </Menu.Item>
      <Menu.Item key="3" onClick={() => router.push(createQueryString('tai-nghe'))}>
        Tai nghe
      </Menu.Item>
      <Menu.Item key="4" onClick={() => router.push(createQueryString('cap-sac'))}>
        Cáp sạc
      </Menu.Item>
      <Menu.Item key="5" onClick={() => router.push(createQueryString('balo-laptop'))}>
        Balo laptop
      </Menu.Item>
      <Menu.Item key="6" onClick={() => router.push(createQueryString('phu-kien-khac'))}>
        Phụ kiện khác
      </Menu.Item>
    </Menu>
  );

  const officeEquipmentMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => router.push(createQueryString('man-hinh'))}>
        Màn hình
      </Menu.Item>
    </Menu>
  );

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/products');
        // Truy cập đúng vào data.products từ response
        const products = response.data.data.products || [];
        const filteredResults = products.filter((product: Product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults.slice(0, 5));
      } catch (error) {
        console.error('Error fetching products:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    performSearch(searchValue);
  }, [searchValue, performSearch]);

  useEffect(() => {
    if (!mobileMenuVisible) {
      setSearchResults([]);
    }
  }, [mobileMenuVisible]);

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      const params = new URLSearchParams();
      params.set('search', searchValue.trim());
      router.push(`/products?${params.toString()}`);
      setSearchResults([]);
      setMobileMenuVisible(false); // Đóng menu trên mobile sau khi tìm kiếm
    }
  };

  // Login/Logout Logic
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const showLoginModal = () => setIsLoginModalVisible(true);
  const handleCancelLogin = () => setIsLoginModalVisible(false);

  const handleLoginSuccess = (user: any) => {
    console.log('Đăng nhập thành công:', user);
    setIsLoginModalVisible(false);
  };

  const showRegisterModal = () => setIsRegisterModalVisible(true);
  const showRegisterFromLogin = () => {
    setIsLoginModalVisible(false);
    setIsRegisterModalVisible(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="mr-8">
                <h1 className="text-2xl font-bold text-blue-600 m-0">TechStore</h1>
              </Link>
              <div className="hidden lg:block relative">
                <Input
                  size="large"
                  placeholder="Tìm kiếm sản phẩm..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  suffix={loading ? <Spin size="small" /> : null}
                  className="w-96 !rounded-full"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onPressEnter={handleSearchSubmit}
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 z-50">
                    <List
                      dataSource={searchResults}
                      renderItem={(item) => (
                        <List.Item>
                          <Link
                            href={`/products/${item.slug}`}
                            className="w-full flex items-center p-2 hover:bg-gray-100"
                            onClick={() => setSearchResults([])}
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={40}
                              height={40}
                              style={{ objectFit: 'contain', marginRight: 8 }}
                            />
                            <div>
                              <div className="text-gray-800">{item.name}</div>
                              <div className="text-red-500 font-semibold">
                                {item.salePrice.toLocaleString('vi-VN')}₫
                              </div>
                            </div>
                          </Link>
                        </List.Item>
                      )}
                    />
                  </div>
                )}
                {searchValue && searchResults.length === 0 && !loading && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 z-50 p-4 text-gray-600">
                    Không tìm thấy sản phẩm nào.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/cart">
                  <Badge
                    count={cartCount}
                    className="[&_.ant-badge-count]:!bg-red-600 [&_.ant-badge-count]:!text-white cursor-pointer"
                  >
                    <ShoppingCartOutlined className="text-2xl text-gray-700" />
                  </Badge>
                </Link>
                {loggedInUser ? (
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="0">
                          <Link href="/account">
                            <UserOutlined className="mr-2" /> Tài khoản của tôi
                          </Link>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item key="3" onClick={handleLogout}>
                          Đăng xuất
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                  >
                    <span className="flex items-center cursor-pointer">
                      <UserOutlined className="text-2xl text-blue-600" />
                      <span className="ml-2 text-blue-600 font-semibold">{loggedInUser.name}</span>
                      <DownOutlined className="ml-1 text-gray-500 text-sm" />
                    </span>
                  </Dropdown>
                ) : (
                  <span
                    className="flex items-center cursor-pointer"
                    onClick={showLoginModal}
                  >
                    <UserOutlined className="text-2xl text-gray-700" />
                    <span className="ml-2 text-gray-700">Đăng nhập</span>
                  </span>
                )}
              </div>
              <div className="block lg:hidden">
                <Button
                  type="text"
                  icon={<MenuOutlined className="text-xl" />}
                  onClick={handleMobileMenuToggle}
                  className="text-gray-600 hover:text-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="block lg:hidden py-3 relative">
            <Input
              size="large"
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              suffix={loading ? <Spin size="small" /> : null}
              className="w-full !rounded-full"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearchSubmit}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 z-50">
                <List
                  dataSource={searchResults}
                  renderItem={(item) => (
                    <List.Item>
                      <Link
                        href={`/products/${item.slug}`}
                        className="w-full flex items-center p-2 hover:bg-gray-100"
                        onClick={() => setSearchResults([])}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          style={{ objectFit: 'contain', marginRight: 8 }}
                        />
                        <div>
                          <div className="text-gray-800">{item.name}</div>
                          <div className="text-red-500 font-semibold">
                            {item.salePrice.toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                      </Link>
                    </List.Item>
                  )}
                />
              </div>
            )}
            {searchValue && searchResults.length === 0 && !loading && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 z-50 p-4 text-gray-600">
                Không tìm thấy sản phẩm nào.
              </div>
            )}
          </div>

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

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
      >
        <div className="space-y-4">
          <div className="py-2">
            <Input
              size="large"
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              suffix={loading ? <Spin size="small" /> : null}
              className="!rounded-full"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearchSubmit}
            />
            {searchResults.length > 0 && (
              <div className="mt-1 bg-white shadow-lg rounded-md">
                <List
                  dataSource={searchResults}
                  renderItem={(item) => (
                    <List.Item>
                      <Link
                        href={`/products/${item.slug}`}
                        className="w-full flex items-center p-2 hover:bg-gray-100"
                        onClick={() => setSearchResults([])}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          style={{ objectFit: 'contain', marginRight: 8 }}
                        />
                        <div>
                          <div className="text-gray-800">{item.name}</div>
                          <div className="text-red-500 font-semibold">
                            {item.salePrice.toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                      </Link>
                    </List.Item>
                  )}
                />
              </div>
            )}
            {searchValue && searchResults.length === 0 && !loading && (
              <div className="mt-1 bg-white shadow-lg rounded-md p-4 text-gray-600">
                Không tìm thấy sản phẩm nào.
              </div>
            )}
          </div>

          <Link href="/cart" className="flex items-center justify-between py-3 border-b">
            <Badge
              count={cartCount}
              className="[&_.ant-badge-count]:!bg-red-600 [&_.ant-badge-count]:!text-white cursor-pointer"
            >
              <ShoppingCartOutlined className="text-2xl text-gray-700" />
              <span className="ml-2 text-gray-700">Giỏ hàng</span>
            </Badge>
          </Link>

          {loggedInUser ? (
            <Link href="/account" className="flex items-center py-3 border-b cursor-pointer">
              <UserOutlined className="text-2xl text-blue-600" />
              <span className="ml-2 text-blue-600">{loggedInUser.name}</span>
            </Link>
          ) : (
            <>
              <span
                className="flex items-center py-3 border-b cursor-pointer"
                onClick={showLoginModal}
              >
                <UserOutlined className="text-2xl text-gray-700" />
                <span className="ml-2 text-gray-700">Đăng nhập</span>
              </span>
              <span
                className="flex items-center py-3 border-b cursor-pointer"
                onClick={showRegisterModal}
              >
                <UserOutlined className="text-2xl text-gray-700" />
                <span className="ml-2 text-gray-700">Đăng ký</span>
              </span>
            </>
          )}

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

          <Link href="/promotions" className="flex items-center py-3 border-b cursor-pointer">
            <ThunderboltOutlined className="mr-2 text-gray-700" />
            <span className="text-gray-700">Khuyến mãi</span>
          </Link>

          <div className="pt-4">
            <div className="text-red-600 font-medium">Hotline: 1900 1234</div>
          </div>
        </div>
      </Drawer>

      <LoginModal
        isVisible={isLoginModalVisible}
        onCancel={handleCancelLogin}
        onLoginSuccess={handleLoginSuccess}
        onShowRegister={showRegisterFromLogin}
      />

      <RegisterModal
        isVisible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        onRegisterSuccess={() => console.log('Registered successfully')}
        onShowLogin={() => {
          setIsRegisterModalVisible(false);
          setIsLoginModalVisible(true);
        }}
      />
    </>
  );
};

export default Header;