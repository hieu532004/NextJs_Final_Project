
'use client';

import { Input, Badge, Button, Dropdown, Menu, Drawer, Collapse } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, MenuOutlined, UserOutlined, DownOutlined, ThunderboltOutlined, TabletOutlined, LaptopOutlined, AudioOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../contexts/authContext'; // Import useAuth hook

const { Panel } = Collapse;

interface HeaderProps {
    searchValue: string;
    setSearchValue: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchValue, setSearchValue }) => {
    const { cartCount } = useCart();
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const { user: loggedInUser, logout } = useAuth(); // Lấy thông tin user và hàm logout từ context

    const toggleMobileMenu = () => setMobileMenuVisible(!mobileMenuVisible);

    const showLoginModal = () => setIsLoginModalVisible(true);
    const handleCancelLogin = () => setIsLoginModalVisible(false);

    const handleLoginSuccess = (user: any) => {
        console.log('Đăng nhập thành công:', user);
        setIsLoginModalVisible(false);
        // Logic cập nhật state người dùng đã được xử lý trong AuthContext
    };

    const showRegisterModal = () => {
        setIsRegisterModalVisible(true);
    };
    const showRegisterFromLogin = () => {
        setIsLoginModalVisible(false);
        setIsRegisterModalVisible(true);
    };

    const handleLogout = () => {
        logout();
        // Có thể thêm logic chuyển hướng sau khi đăng xuất nếu cần
    };

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
                                {loggedInUser ? (
                                    // Hiển thị thông tin người dùng khi đã đăng nhập
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
                                            <UserOutlined className="text-2xl text-blue-600" /> {/* Thay đổi icon */}
                                            <span className="ml-2 text-blue-600 font-semibold">{loggedInUser.name}</span> {/* Hiển thị tên */}
                                            <DownOutlined className="ml-1 text-gray-500 text-sm" />
                                        </span>
                                    </Dropdown>
                                ) : (
                                    // Hiển thị nút đăng nhập khi chưa đăng nhập
                                    <span
                                        className="flex items-center cursor-pointer"
                                        onClick={showLoginModal}
                                    >
                                        <UserOutlined className="text-2xl text-gray-700" />
                                        <span className="ml-2 text-gray-700">Đăng nhập</span>
                                    </span>
                                )}
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
                </div>
            </header>

            <LoginModal
                isVisible={isLoginModalVisible}
                onCancel={handleCancelLogin}
                onLoginSuccess={handleLoginSuccess}
                onShowRegister={showRegisterFromLogin}
            />
            <RegisterModal
                isVisible={isRegisterModalVisible}
                onCancel={() => setIsRegisterModalVisible(false)}
                onRegisterSuccess={(user : any) => console.log('Registered successfully:', user)}
                onShowLogin={() => {
                    setIsRegisterModalVisible(false);
                    setIsLoginModalVisible(true);
                }}
            />
            {/* Mobile Menu Drawer */}
            <Drawer
                title="Menu"
                placement="left"
                onClose={toggleMobileMenu}
                open={mobileMenuVisible}
                width={280}
            >
                <div className="space-y-4">
                    {/* Tìm kiếm trên mobile */}
                    <div className="py-2">
                        <Input
                            size="large"
                            placeholder="Tìm kiếm sản phẩm..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="!rounded-full"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

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
                    {loggedInUser ? (
                        <Link href="/account" className="flex items-center py-3 border-b cursor-pointer">
                            <UserOutlined className="text-2xl text-blue-600" />
                            <span className="ml-2 text-blue-600">{loggedInUser.name}</span>
                        </Link>
                    ) : (
                        <>
                            <span
                                className="flex items-center py-3 border-b cursor-pointer"
                                onClick={showLoginModal} // Gọi hàm mở modal
                            >
                                <UserOutlined className="text-2xl text-gray-700" />
                                <span className="ml-2 text-gray-700">Đăng nhập</span>
                            </span>
                            <span
                                className="flex items-center py-3 border-b cursor-pointer"
                                onClick={showRegisterModal} // Gọi hàm mở modal đăng ký (nếu cần)
                            >
                                <UserOutlined className="text-2xl text-gray-700" />
                                <span className="ml-2 text-gray-700">Đăng ký</span>
                            </span>
                        </>
                    )}

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