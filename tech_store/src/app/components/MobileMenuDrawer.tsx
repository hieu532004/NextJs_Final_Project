// src/app/components/MobileMenuDrawer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Drawer, Badge, Input, Spin, Divider } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, HomeOutlined, RightOutlined, FireOutlined, TagOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { Category, Product } from '../types';

interface MobileMenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
}

interface BrandWithProducts {
  brand: string;
  products: Product[];
}

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ visible, onClose, categories }) => {
  const { cartCount } = useCart();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [brandsByCategory, setBrandsByCategory] = useState<BrandWithProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0 });
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const brandSubmenuRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const brandHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Kiểm tra nếu là thiết bị di động
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Cập nhật vị trí của submenu khi hover
  useEffect(() => {
    if (hoveredCategory && categoryRefs.current[hoveredCategory]) {
      const rect = categoryRefs.current[hoveredCategory]?.getBoundingClientRect();
      if (rect) {
        setSubmenuPosition({ top: rect.top });
      }
    }
  }, [hoveredCategory]);

  // Lấy sản phẩm và thương hiệu theo danh mục
  useEffect(() => {
    const fetchCategoryData = async (categoryId: string) => {
      if (!categoryId) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`);
        const allProducts = response.data.data.products;
        
        // Lọc sản phẩm theo category_id
        const filtered = allProducts.filter((product: Product) => product.category_id === categoryId);
        setCategoryProducts(filtered);
        
        // Nhóm sản phẩm theo thương hiệu
        const brands: string[] = Array.from(new Set(filtered.map((product: Product) => product.brand)));
        const brandsWithProducts: BrandWithProducts[] = brands.map((brand: string): BrandWithProducts => ({
          brand,
          products: filtered.filter((product: Product): boolean => product.brand === brand)
        }));
        
        setBrandsByCategory(brandsWithProducts);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setCategoryProducts([]);
        setBrandsByCategory([]);
      } finally {
        setLoading(false);
      }
    };

    // Nếu đang ở mobile thì chỉ fetch khi expand, còn desktop thì fetch khi hover
    if ((isMobile && expandedCategory) || (!isMobile && hoveredCategory)) {
      const categoryId = isMobile ? expandedCategory : hoveredCategory;
      if (categoryId) {
        fetchCategoryData(categoryId);
      }
    }
  }, [hoveredCategory, expandedCategory, isMobile]);

  // Lọc sản phẩm theo thương hiệu khi hover vào thương hiệu
  useEffect(() => {
    if (hoveredBrand && categoryProducts.length > 0) {
      const filtered = categoryProducts.filter(product => product.brand === hoveredBrand);
      setBrandProducts(filtered);
    }
  }, [hoveredBrand, categoryProducts]);

  // Xử lý hover vào danh mục
  const handleCategoryMouseEnter = (categoryId: string) => {
    if (!isMobile) {
      // Xóa timeout trước đó nếu có
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setHoveredCategory(categoryId);
      setHoveredBrand(null); // Reset hovered brand
    }
  };

  // Xử lý rời khỏi danh mục
  const handleCategoryMouseLeave = () => {
    if (!isMobile) {
      // Đặt timeout để tránh menu biến mất ngay lập tức
      hoverTimeoutRef.current = setTimeout(() => {
        // Chỉ đóng menu nếu chuột không nằm trên submenu
        if (submenuRef.current && !isMouseOverElement(submenuRef.current) && 
            brandSubmenuRef.current && !isMouseOverElement(brandSubmenuRef.current)) {
          setHoveredCategory(null);
          setHoveredBrand(null);
        }
      }, 100);
    }
  };

  // Xử lý hover vào submenu
  const handleSubmenuMouseEnter = () => {
    if (!isMobile && hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Xử lý rời khỏi submenu
  const handleSubmenuMouseLeave = () => {
    if (!isMobile) {
      hoverTimeoutRef.current = setTimeout(() => {
        if (brandSubmenuRef.current && !isMouseOverElement(brandSubmenuRef.current)) {
          setHoveredCategory(null);
          setHoveredBrand(null);
        }
      }, 100);
    }
  };

  // Xử lý hover vào thương hiệu
  const handleBrandMouseEnter = (brand: string) => {
    if (!isMobile) {
      if (brandHoverTimeoutRef.current) {
        clearTimeout(brandHoverTimeoutRef.current);
        brandHoverTimeoutRef.current = null;
      }
      setHoveredBrand(brand);
    }
  };

  // Xử lý rời khỏi thương hiệu
  const handleBrandMouseLeave = () => {
    if (!isMobile) {
      brandHoverTimeoutRef.current = setTimeout(() => {
        if (brandSubmenuRef.current && !isMouseOverElement(brandSubmenuRef.current)) {
          setHoveredBrand(null);
        }
      }, 100);
    }
  };

  // Xử lý hover vào submenu thương hiệu
  const handleBrandSubmenuMouseEnter = () => {
    if (!isMobile && brandHoverTimeoutRef.current) {
      clearTimeout(brandHoverTimeoutRef.current);
      brandHoverTimeoutRef.current = null;
    }
  };

  // Xử lý rời khỏi submenu thương hiệu
  const handleBrandSubmenuMouseLeave = () => {
    if (!isMobile) {
      brandHoverTimeoutRef.current = setTimeout(() => {
        setHoveredBrand(null);
      }, 100);
    }
  };

  // Kiểm tra xem chuột có đang ở trên phần tử không
  const isMouseOverElement = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const mouseX = window.event ? (window.event as any).clientX : -1;
    const mouseY = window.event ? (window.event as any).clientY : -1;
    
    return (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    );
  };

  // Xử lý click vào danh mục (chỉ cho mobile)
  const handleCategoryClick = (categoryId: string) => {
    if (isMobile) {
      if (expandedCategory === categoryId) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(categoryId);
      }
    }
  };

  // Lấy tên danh mục từ ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : '';
  };

  return (
    <>
      <Drawer
        title="TechStore"
        placement="right"
        onClose={onClose}
        open={visible}
        width={300}
        className="[&_.ant-drawer-body]:p-4 mobile-menu-drawer"
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
                <div 
                  key={category._id} 
                  className="category-item relative"
                  ref={el => { categoryRefs.current[category._id] = el; }}
                >
                  {/* Desktop: Chỉ hover, không click */}
                  {!isMobile ? (
                    <div 
                      className={`flex items-center justify-between py-2 cursor-pointer text-gray-800 hover:text-blue-600 ${
                        hoveredCategory === category._id ? 'text-blue-600' : ''
                      }`}
                      onMouseEnter={() => handleCategoryMouseEnter(category._id)}
                      onMouseLeave={handleCategoryMouseLeave}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{category.name}</span>
                      </div>
                      <RightOutlined className="text-xs" />
                    </div>
                  ) : (
                    /* Mobile: Click để mở rộng */
                    <div 
                      className={`flex items-center justify-between py-2 cursor-pointer text-gray-800 hover:text-blue-600 ${
                        expandedCategory === category._id ? 'text-blue-600' : ''
                      }`}
                      onClick={() => handleCategoryClick(category._id)}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{category.name}</span>
                      </div>
                      <RightOutlined className="text-xs" />
                    </div>
                  )}
                  
                  {/* Hiển thị menu phụ khi hover hoặc click */}
                  {((isMobile && expandedCategory === category._id) || 
                    (!isMobile && hoveredCategory === category._id)) && (
                    <div 
                      ref={submenuRef}
                      className={`category-submenu ${isMobile ? 'mobile-submenu' : 'desktop-submenu'}`}
                      style={!isMobile ? { top: submenuPosition.top } : {}}
                      onMouseEnter={handleSubmenuMouseEnter}
                      onMouseLeave={handleSubmenuMouseLeave}
                    >
                      <div className="submenu-header">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">{category.name}</h4>
                          <Link 
                            href={`/products?category=${category.slug}`}
                            onClick={onClose}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Xem tất cả
                          </Link>
                        </div>
                      </div>
                      <div className="submenu-content">
                        {loading ? (
                          <div className="flex justify-center py-4">
                            <Spin size="small" />
                          </div>
                        ) : brandsByCategory.length > 0 ? (
                          <div className="space-y-1">
                            {/* Sản phẩm nổi bật */}
                            <div className="featured-section mb-3">
                              <div className="flex items-center text-xs font-medium text-gray-500 mb-2">
                                <FireOutlined className="mr-1 text-orange-500" />
                                <span>Sản phẩm nổi bật</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {categoryProducts
                                  .filter(product => product.isNew || product.discount > 10)
                                  .slice(0, 2)
                                  .map(product => (
                                    <Link 
                                      href={`/products/${product.slug}`} 
                                      key={product._id}
                                      onClick={onClose}
                                      className="featured-product block"
                                    >
                                      <div className="bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors h-full">
                                        <div className="relative w-full h-16 mb-1">
                                          <Image
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            style={{ objectFit: 'contain' }}
                                            className="rounded-md"
                                          />
                                          {product.discount > 0 && (
                                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded">
                                              -{product.discount}%
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs font-medium text-gray-900 truncate">
                                          {product.name}
                                        </p>
                                        <p className="text-xs text-red-600 font-semibold">
                                          {product.salePrice.toLocaleString('vi-VN')}đ
                                        </p>
                                      </div>
                                    </Link>
                                  ))}
                              </div>
                            </div>
                            
                            <Divider className="my-2" />
                            
                            {/* Danh sách thương hiệu */}
                            <div className="brands-section">
                              <div className="flex items-center text-xs font-medium text-gray-500 mb-2">
                                <TagOutlined className="mr-1 text-blue-500" />
                                <span>Thương hiệu</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                {brandsByCategory.map(({ brand, products }) => (
                                  <div 
                                    key={brand}
                                    className={`brand-item p-2 rounded-md cursor-pointer ${
                                      hoveredBrand === brand ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                    }`}
                                    onMouseEnter={() => handleBrandMouseEnter(brand)}
                                    onMouseLeave={handleBrandMouseLeave}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium">{brand}</span>
                                      <span className="text-xs text-gray-500">({products.length})</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 py-2">Không có sản phẩm</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Submenu thương hiệu */}
                  {!isMobile && hoveredBrand && hoveredCategory && (
                    <div 
                      ref={brandSubmenuRef}
                      className="brand-submenu"
                      onMouseEnter={handleBrandSubmenuMouseEnter}
                      onMouseLeave={handleBrandSubmenuMouseLeave}
                    >
                      <div className="submenu-header">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">{hoveredBrand}</h4>
                          <Link 
                            href={`/products?brand=${hoveredBrand}&category=${getCategoryName(hoveredCategory)}`}
                            onClick={onClose}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Xem tất cả
                          </Link>
                        </div>
                      </div>
                      <div className="submenu-content">
                        {brandProducts.length > 0 ? (
                          <div className="space-y-3">
                            {brandProducts.slice(0, 5).map((product) => (
                              <Link 
                                href={`/products/${product.slug}`} 
                                key={product._id}
                                onClick={onClose}
                                className="product-item block"
                              >
                                <div className="flex items-start space-x-2 hover:bg-gray-50 p-2 rounded-md transition-colors">
                                  <div className="relative w-12 h-12 flex-shrink-0">
                                    <Image
                                      src={product.image || "/placeholder.svg"}
                                      alt={product.name}
                                      fill
                                      style={{ objectFit: 'contain' }}
                                      className="rounded-md"
                                    />
                                    {product.discount > 0 && (
                                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded">
                                        -{product.discount}%
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 truncate">
                                      {product.name}
                                    </p>
                                    <div className="flex items-center">
                                      <p className="text-xs text-red-600 font-semibold">
                                        {product.salePrice.toLocaleString('vi-VN')}đ
                                      </p>
                                      {product.discount > 0 && (
                                        <p className="text-[10px] text-gray-500 line-through ml-1">
                                          {product.price.toLocaleString('vi-VN')}đ
                                        </p>
                                      )}
                                    </div>
                                    {product.isNew && (
                                      <span className="text-[10px] text-green-600">Mới</span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 py-2">Không có sản phẩm</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>

      {/* CSS cho menu phụ */}
      <style jsx global>{`
        /* Thiết lập chung cho menu phụ */
        .category-submenu, .brand-submenu {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
          width: 280px;
        }
        
        .submenu-header {
          padding: 12px 15px;
          border-bottom: 1px solid #f0f0f0;
          background-color: #f9f9f9;
        }
        
        .submenu-content {
          padding: 12px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .product-item:hover {
          background-color: #f5f5f5;
        }
        
        /* Desktop: hiển thị bên trái drawer */
        @media (min-width: 768px) {
          .desktop-submenu {
            position: fixed;
            left: calc(100% - 300px - 290px);
            animation: fadeIn 0.2s ease-in-out;
          }
          
          .brand-submenu {
            position: fixed;
            left: calc(100% - 300px - 290px - 290px);
            top: var(--submenu-top, 0);
            animation: fadeIn 0.2s ease-in-out;
          }
          
          /* Thêm vùng kết nối giữa danh mục và submenu */
          .category-item {
            position: relative;
          }
          
          .category-item::after {
            content: '';
            position: absolute;
            top: 0;
            right: -20px;
            width: 20px;
            height: 100%;
            background: transparent;
          }
          
          /* Thêm vùng kết nối giữa brand và submenu */
          .brand-item {
            position: relative;
          }
          
          .brand-item::after {
            content: '';
            position: absolute;
            top: 0;
            right: -20px;
            width: 20px;
            height: 100%;
            background: transparent;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        }
        
        /* Mobile: hiển thị bên trong drawer */
        @media (max-width: 767px) {
          .mobile-submenu {
            margin-left: 20px;
            margin-top: 5px;
            margin-bottom: 10px;
            width: auto;
            box-shadow: none;
            border: 1px solid #f0f0f0;
          }
        }
        
        /* Styling cho featured products */
        .featured-product {
          transition: transform 0.2s ease;
        }
        
        .featured-product:hover {
          transform: translateY(-2px);
        }
        
        /* Styling cho brand items */
        .brand-item {
          transition: all 0.2s ease;
        }
      `}</style>
    </>
  );
};

export default MobileMenuDrawer;