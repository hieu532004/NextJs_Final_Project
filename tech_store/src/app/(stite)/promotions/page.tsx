'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button, Tag, Rate, notification } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useCart } from '@/app/contexts/CartContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

interface Product {
  _id: string;
  id: number;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  slug: string;
  discount: number;
  isNew: boolean;
  brand: string;
  stock: number;
  rating: number;
  installment_available: boolean;
  category_id: string;
}

export default function PromotionsPage() {
  const { setCartCount } = useCart();
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get('category'); // Đọc category từ URL
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/products');
        const productsData = response.data.data.products || [];
        // Lọc sản phẩm khuyến mãi (discount > 0 hoặc isNew = true)
        let promotedProducts = productsData.filter(
          (product: Product) => product.discount > 0 || product.isNew
        );
        // Nếu có query category, lọc thêm theo danh mục
        if (queryCategory) {
          promotedProducts = promotedProducts.filter(
            (product: Product) => product.category_id === queryCategory
          );
        }
        setProducts(promotedProducts);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu khuyến mãi. Vui lòng thử lại sau.');
        console.error('Error fetching promotions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [queryCategory]);

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
    return (
      <div className="flex flex-col min-h-screen">
        <Header searchValue={searchValue} setSearchValue={setSearchValue} />
        <main className="flex-grow container mx-auto p-4">Đang tải...</main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header searchValue={searchValue} setSearchValue={setSearchValue} />
        <main className="flex-grow container mx-auto p-4 text-red-500">{error}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <main className="flex-grow container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {queryCategory ? `Khuyến mãi ${queryCategory}` : 'Khuyến Mãi Nổi Bật'}
          </h1>
          <p className="text-gray-600">
            Khám phá các sản phẩm giảm giá và ưu đãi đặc biệt. Chỉ áp dụng đến hết ngày 15/05/2025!
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Card
                hoverable
                cover={
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-64">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="p-2 transition-transform duration-300 hover:scale-105"
                      />
                      {product.discount > 0 && (
                        <Tag color="red" className="absolute top-2 right-2">
                          -{product.discount}%
                        </Tag>
                      )}
                      {product.isNew && (
                        <Tag color="green" className="absolute top-2 left-2">
                          Mới
                        </Tag>
                      )}
                    </div>
                  </Link>
                }
                className="shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Card.Meta
                  title={
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                        {product.name}
                      </h3>
                    </Link>
                  }
                  description={
                    <div className="mt-2">
                      <div className="flex items-center mb-2">
                        <span className="text-red-500 font-bold text-xl">
                          {product.salePrice.toLocaleString('vi-VN')}đ
                        </span>
                        {product.discount > 0 && (
                          <span className="text-gray-500 line-through ml-2 text-sm">
                            {product.price.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>
                      <Rate disabled value={product.rating} allowHalf className="text-sm mb-2" />
                      <p className="text-gray-600 text-sm mb-2">Thương hiệu: {product.brand}</p>
                      <p className="text-gray-500 text-sm">
                        Còn {product.stock} sản phẩm
                      </p>
                      <div className="mt-4 flex space-x-2">
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          disabled={product.stock === 0}
                          className="w-full"
                        >
                          Mua ngay
                        </Button>
                        <Button
                          icon={<EyeOutlined />}
                          onClick={(e) => {
                            e.preventDefault();
                            // Logic xem nhanh (tùy chọn)
                          }}
                          className="w-full"
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {products.length === 0 && (
          <div className="text-center text-gray-600 py-8">
            Không có sản phẩm khuyến mãi nào tại thời điểm này.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}