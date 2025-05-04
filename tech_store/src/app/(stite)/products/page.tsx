'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Menu, Slider, Checkbox, Select, Rate, Tag, Button, Space, Pagination, Modal, notification } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/app/types';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useCart } from '@/app/contexts/CartContext';

const { Option } = Select;

export default function ProductList() {
  const { setCartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]); // Khoảng giá
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // Lọc theo thương hiệu
  const [minRating, setMinRating] = useState<number>(0); // Lọc theo đánh giá tối thiểu
  const [sortOrder, setSortOrder] = useState<string>('default'); // Sắp xếp
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null); // Sản phẩm xem nhanh
  const pageSize = 6; // Số sản phẩm mỗi trang

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:3001/products'),
          axios.get('http://localhost:3001/categories'),
        ]);
        const productsData = productsResponse.data.data.products;
        const categoriesData = categoriesResponse.data.data.categories;

        if (!Array.isArray(productsData)) {
          throw new Error('Dữ liệu sản phẩm không đúng định dạng.');
        }
        if (!Array.isArray(categoriesData)) {
          throw new Error('Dữ liệu danh mục không đúng định dạng.');
        }

        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);

        // Tìm khoảng giá tối đa để thiết lập Slider
        const prices = productsData.map((p: Product) => p.salePrice);
        const maxPrice = Math.max(...prices, 100000000);
        setPriceRange([0, maxPrice]);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lấy danh sách thương hiệu duy nhất
  const brands = Array.from(new Set(products.map(product => product.brand)));

  // Xử lý lọc và sắp xếp
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleBrandChange = (checkedValues: string[]) => {
    setSelectedBrands(checkedValues);
    setCurrentPage(1);
  };

  const handleRatingChange = (value: number) => {
    setMinRating(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Lọc sản phẩm
  let filteredProducts = products.filter(product => {
    const inCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const inPriceRange = product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1];
    const inBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const aboveMinRating = product.rating >= minRating;
    return inCategory && inPriceRange && inBrands && aboveMinRating;
  });

  // Sắp xếp sản phẩm
  if (sortOrder === 'priceAsc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.salePrice - b.salePrice);
  } else if (sortOrder === 'priceDesc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.salePrice - a.salePrice);
  } else if (sortOrder === 'ratingDesc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  // Phân trang
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Tìm tên danh mục đang chọn
  const selectedCategoryName = selectedCategory === 'all'
    ? 'Tất cả sản phẩm'
    : categories.find(cat => cat._id === selectedCategory)?.name || 'Không xác định';

  // Thêm vào giỏ hàng
  const addToCart = async (product: Product) => {
    try {
      await axios.post('http://localhost:3001/cart', {
        product_id: product._id,
        quantity: 1,
      });
      const response = await axios.get('http://localhost:3001/cart');
      const cartData = response.data as { items: { quantity: number }[] };
      setCartCount(cartData.items.reduce((total, item) => total + item.quantity, 0));
      notification.success({
        message: 'Thêm vào giỏ hàng thành công!',
        description: `${product.name} đã được thêm vào giỏ hàng.`,
        duration: 2,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng.',
        duration: 2,
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header 
        searchValue="" 
        setSearchValue={() => {}} 
        toggleMobileMenu={() => {}} 
      />

      {/* Nội dung chính */}
      <main className="flex-grow container mx-auto p-4">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm">
          <Link href="/">Trang chủ</Link> / <span>Sản phẩm</span>
          {selectedCategory !== 'all' && <> / <span>{selectedCategoryName}</span></>}
        </div>

        {/* Tiêu đề và số lượng sản phẩm */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{selectedCategoryName}</h1>
          <p className="text-sm text-gray-600">
            Tìm thấy {filteredProducts.length} sản phẩm
          </p>
        </div>

        <Row gutter={[16, 16]}>
          {/* Sidebar bộ lọc */}
          <Col xs={24} md={6}>
            <Card title="Bộ lọc sản phẩm" className="shadow-sm">
              {/* Lọc theo danh mục */}
              <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
              <Menu
                mode="vertical"
                selectedKeys={selectedCategory ? [selectedCategory] : ['all']}
                onClick={({ key }) => handleCategorySelect(key)}
              >
                <Menu.Item key="all">Tất cả sản phẩm</Menu.Item>
                {categories.map(category => (
                  <Menu.Item key={category._id}>{category.name}</Menu.Item>
                ))}
              </Menu>

              {/* Lọc theo giá */}
              <h3 className="text-lg font-semibold mt-4 mb-2">Khoảng giá</h3>
              <Slider
                range
                min={0}
                max={Math.max(...products.map(p => p.salePrice), 100000000)}
                value={priceRange}
                onChange={(value) => {
                  if (Array.isArray(value) && value.length === 2) {
                    handlePriceRangeChange(value as [number, number]);
                  }
                }}
                step={100000}
                tipFormatter={(value) => value?.toLocaleString('vi-VN') + 'đ'}
              />
              <p className="text-sm text-gray-600">
                {priceRange[0].toLocaleString('vi-VN')}đ - {priceRange[1].toLocaleString('vi-VN')}đ
              </p>

              {/* Lọc theo thương hiệu */}
              <h3 className="text-lg font-semibold mt-4 mb-2">Thương hiệu</h3>
              <Checkbox.Group
                options={brands.map(brand => ({ label: brand, value: brand }))}
                value={selectedBrands}
                onChange={handleBrandChange}
                className="flex flex-col space-y-2"
              />

              {/* Lọc theo đánh giá */}
              <h3 className="text-lg font-semibold mt-4 mb-2">Đánh giá tối thiểu</h3>
              <Rate
                value={minRating}
                onChange={handleRatingChange}
                className="text-sm"
              />
            </Card>
          </Col>

          {/* Danh sách sản phẩm */}
          <Col xs={24} md={18}>
            {/* Sắp xếp */}
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Hiển thị {paginatedProducts.length} trong số {filteredProducts.length} sản phẩm
              </span>
              <div>
                <label className="mr-2 font-semibold">Sắp xếp:</label>
                <Select
                  value={sortOrder}
                  onChange={handleSortChange}
                  style={{ width: 200 }}
                  placeholder="Sắp xếp"
                >
                  <Option value="default">Mặc định</Option>
                  <Option value="priceAsc">Giá: Thấp đến cao</Option>
                  <Option value="priceDesc">Giá: Cao đến thấp</Option>
                  <Option value="ratingDesc">Đánh giá: Cao đến thấp</Option>
                </Select>
              </div>
            </div>

            {/* Danh sách sản phẩm dạng lưới */}
            <Row gutter={[16, 16]}>
              {paginatedProducts.map((product) => (
                <Col xs={24} sm={12} md={8} key={product._id}>
                  <Card
                    cover={
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative h-48">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="p-2 transition-transform duration-300 hover:scale-105"
                          />
                          {product.isNew && (
                            <Tag color="green" className="absolute top-2 left-2">
                              Mới
                            </Tag>
                          )}
                          {product.discount > 0 && (
                            <Tag color="red" className="absolute top-2 right-2">
                              -{product.discount}%
                            </Tag>
                          )}
                        </div>
                      </Link>
                    }
                    actions={[
                      <Button
                        key="add-to-cart"
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        disabled={product.stock === 0}
                      >
                        Thêm vào giỏ
                      </Button>,
                      <Button
                        key="quick-view"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                          e.preventDefault();
                          setQuickViewProduct(product);
                        }}
                      >
                        Xem nhanh
                      </Button>,
                    ]}
                    className="shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <Card.Meta
                      title={
                        <Link href={`/products/${product.slug}`}>
                          <span className="text-lg font-semibold">{product.name}</span>
                        </Link>
                      }
                      description={
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="text-red-500 font-bold mr-2">
                              {product.salePrice.toLocaleString('vi-VN')}đ
                            </span>
                            {product.discount > 0 && (
                              <span className="text-gray-500 line-through text-sm">
                                {product.price.toLocaleString('vi-VN')}đ
                              </span>
                            )}
                          </div>
                          <Rate disabled value={product.rating} allowHalf className="text-sm mb-1" />
                          <p className="text-gray-600 text-sm">Thương hiệu: {product.brand}</p>
                          {product.installment_available && (
                            <p className="text-green-600 text-sm">Hỗ trợ trả góp</p>
                          )}
                          <p className="text-gray-500 text-sm">
                            Còn {product.stock} sản phẩm
                          </p>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Phân trang */}
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={handlePageChange}
              className="mt-6 text-center"
              showSizeChanger={false}
            />
          </Col>
        </Row>

        {/* Modal xem nhanh sản phẩm */}
        {quickViewProduct && (
          <Modal
            title={quickViewProduct.name}
            open={!!quickViewProduct}
            onCancel={() => setQuickViewProduct(null)}
            footer={null}
            width={800}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className="relative h-64">
                  <Image
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-2"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <h2 className="text-xl font-bold">{quickViewProduct.name}</h2>
                <div className="flex items-center mb-2">
                  <Rate disabled value={quickViewProduct.rating} allowHalf className="text-sm mr-2" />
                  <span className="text-sm text-gray-500">
                    ({Math.round(quickViewProduct.rating * 20)} đánh giá)
                  </span>
                </div>
                <p className="text-red-500 font-bold text-lg mb-2">
                  {quickViewProduct.salePrice.toLocaleString('vi-VN')}đ
                </p>
                {quickViewProduct.salePrice < quickViewProduct.price && (
                  <p className="text-gray-500 line-through text-sm mb-2">
                    {quickViewProduct.price.toLocaleString('vi-VN')}đ
                  </p>
                )}
                <p className="text-gray-600 mb-2">Thương hiệu: {quickViewProduct.brand}</p>
                <p className="text-gray-600 mb-4">
                  Tình trạng: {quickViewProduct.stock > 0 ? `Còn ${quickViewProduct.stock} sản phẩm` : 'Hết hàng'}
                </p>
                <Space>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    disabled={quickViewProduct.stock === 0}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Link href={`/products/${quickViewProduct.slug}`}>
                    <Button onClick={() => setQuickViewProduct(null)}>
                      Xem chi tiết
                    </Button>
                  </Link>
                </Space>
              </Col>
            </Row>
          </Modal>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}