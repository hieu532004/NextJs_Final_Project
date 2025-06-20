"use client";

import {
  Input,
  Badge,
  Button,
  Dropdown,
  Drawer,
  Collapse,
  List,
  Spin,
  Image,
} from "antd";
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
} from "@ant-design/icons";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "../contexts/CartContext";
import axios from "axios";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import RedirectLoginModal from "./RedirectLoginModal";
import { useAuth } from "@/app/contexts/authContext";

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

const Header: React.FC<HeaderProps> = ({
  searchValue,
  setSearchValue,
  toggleMobileMenu,
}) => {
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
    params.set("category", category);
    return `/products?${params.toString()}`;
  };

  // Dropdown Menus for Desktop
  const laptopMenu = {
    items: [
      {
        key: "1",
        label: "Laptop",
        onClick: () => router.push(createQueryString("laptop")),
      },
    ],
  };
  const accessoriesMenu = {
    items: [
      {
        key: "1",
        label: "Chuột",
        onClick: () => router.push(createQueryString("chuot")),
      },
      {
        key: "2",
        label: "Bàn phím",
        onClick: () => router.push(createQueryString("ban-phim")),
      },
      {
        key: "3",
        label: "Tai nghe",
        onClick: () => router.push(createQueryString("tai-nghe")),
      },
      {
        key: "4",
        label: "Cáp sạc",
        onClick: () => router.push(createQueryString("cap-sac")),
      },
      {
        key: "5",
        label: "Balo laptop",
        onClick: () => router.push(createQueryString("balo-laptop")),
      },
      {
        key: "6",
        label: "Phụ kiện khác",
        onClick: () => router.push(createQueryString("phu-kien-khac")),
      },
    ],
  };

  const officeEquipmentMenu = {
    items: [
      {
        key: "1",
        label: "Màn hình",
        onClick: () => router.push(createQueryString("man-hinh")),
      },
    ],
  };

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`
        );
        // Truy cập đúng vào data.products từ response
        const products = response.data.data.products || [];
        const filteredResults = products.filter((product: Product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults.slice(0, 5));
      } catch (error) {
        console.error("Error fetching products:", error);
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
      params.set("search", searchValue.trim());
      router.push(`/products?${params.toString()}`);
      setSearchResults([]);
      setMobileMenuVisible(false); // Đóng menu trên mobile sau khi tìm kiếm
    }
  };

  // Login/Logout Logic
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isRedirectLoginModalVisible, setIsRedirectLoginModalVisible] =
    useState(false);

  const showLoginModal = () => setIsLoginModalVisible(true);
  const handleCancelLogin = () => setIsLoginModalVisible(false);

  const handleLoginSuccess = (user: any) => {
    console.log("Đăng nhập thành công:", user);
    setIsLoginModalVisible(false);
  };

  const showRegisterFromLogin = () => {
    setIsLoginModalVisible(false);
    const [isRedirectLoginModalVisible, setIsRedirectLoginModalVisible] =
      useState(false);
    setIsRegisterModalVisible(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!loggedInUser) {
      setIsRedirectLoginModalVisible(true); // Hiện modal thông báo đăng nhập/đăng ký
    } else {
      router.push("/cart");
    }
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="mr-8">
                <h1 className="text-2xl font-bold text-blue-600 m-0">
                  TechStore
                </h1>
              </Link>

              <div className="hidden lg:block relative w-[450px]">
                <Input
                  size="large"
                  placeholder="Tìm kiếm sản phẩm..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  suffix={loading ? <Spin size="small" /> : null}
                  className="w-full !rounded-full border border-gray-300 shadow-sm focus:shadow-md transition-shadow duration-200"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onPressEnter={handleSearchSubmit}
                />

                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-lg mt-2 z-50 overflow-hidden border border-gray-200">
                    <ul className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
                      {searchResults.map((item) => (
                        <li key={item._id}>
                          <Link
                            href={`/products/${item.slug}`}
                            className="flex items-start p-3 hover:bg-gray-100 transition-colors"
                            onClick={() => setSearchResults([])}
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={60}
                              height={60}
                              className="object-contain rounded mr-3 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 font-medium line-clamp-2 ml-2">
                                {item.name}
                              </p>
                              <div className="text-red-600 font-bold text-sm mt-1 ml-2">
                                {item.salePrice.toLocaleString("vi-VN")}₫
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {searchValue && searchResults.length === 0 && !loading && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-50 p-4 text-gray-600 text-sm border border-gray-200">
                    Không tìm thấy sản phẩm nào.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/cart" onClick={handleCartClick}>
                  <Badge
                    count={cartCount}
                    className="[&_.ant-badge-count]:!bg-red-600 [&_.ant-badge-count]:!text-white cursor-pointer"
                  >
                    <ShoppingCartOutlined className="text-2xl !text-gray-700" />
                  </Badge>
                </Link>
                {loggedInUser ? (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "0",
                          label: (
                            <Link href="/account">
                              <UserOutlined className="mr-2" /> Tài khoản của
                              tôi
                            </Link>
                          ),
                        },
                        {
                          type: "divider",
                        },
                        {
                          key: "3",
                          label: "Đăng xuất",
                          onClick: handleLogout,
                        },
                      ],
                    }}
                    trigger={["click"]}
                  >
                    <span className="flex items-center cursor-pointer">
                      <UserOutlined className="text-2xl text-gray-500" />
                      <span className="ml-2 text-gray-500 font-semibold">
                        {loggedInUser.name}
                      </span>
                      <DownOutlined className="ml-1 text-gray-500 text-sm" />
                    </span>
                  </Dropdown>
                ) : (
                  <span
                    className="flex items-center cursor-pointer"
                    onClick={showLoginModal}
                  >
                    <UserOutlined className="text-2xl !text-gray-700" />
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
                          style={{ objectFit: "contain", marginRight: 8 }}
                        />
                        <div>
                          <div className="text-gray-800">{item.name}</div>
                          <div className="text-red-500 font-semibold">
                            {item.salePrice.toLocaleString("vi-VN")}₫
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
                <Dropdown menu={laptopMenu}>
                  <a className="text-gray-700 hover:text-blue-600 cursor-pointer flex items-center">
                    <LaptopOutlined className="mr-1" /> Laptop{" "}
                    <DownOutlined className="text-xs ml-1" />
                  </a>
                </Dropdown>
                <Dropdown menu={accessoriesMenu}>
                  <a className="text-gray-700 hover:text-blue-600 cursor-pointer flex items-center">
                    <TabletOutlined className="mr-1" /> Phụ kiện{" "}
                    <DownOutlined className="text-xs ml-1" />
                  </a>
                </Dropdown>
                <Dropdown menu={officeEquipmentMenu}>
                  <a className="text-gray-700 hover:text-blue-600 cursor-pointer flex items-center">
                    <AudioOutlined className="mr-1" /> Thiết bị văn phòng{" "}
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
                <a className="text-red-600 font-medium cursor-pointer">
                  Hotline: 1900 1234
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <RedirectLoginModal
        isVisible={isRedirectLoginModalVisible}
        onCancel={() => setIsRedirectLoginModalVisible(false)}
        onShowLogin={() => {
          setIsRedirectLoginModalVisible(false);
          setIsLoginModalVisible(true);
        }}
        onShowRegister={() => {
          setIsRedirectLoginModalVisible(false);
          setIsRegisterModalVisible(true);
        }}
      />

      <LoginModal
        isVisible={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        onShowRegister={() => {
          setIsLoginModalVisible(false);
          setIsRegisterModalVisible(true);
        }}
      />

      <RegisterModal
        isVisible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        onRegisterSuccess={() => console.log("Registered successfully")}
        onShowLogin={() => {
          setIsRegisterModalVisible(false);
          setIsLoginModalVisible(true);
        }}
      />
    </>
  );
};

export default Header;
