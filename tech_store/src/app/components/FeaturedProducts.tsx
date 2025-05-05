'use client';

import { Button, Card, Rate, notification } from 'antd';
import { ShoppingCartOutlined, RightOutlined } from '@ant-design/icons';
import { Product } from '../types';
import axios from 'axios';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const { setCartCount } = useCart();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const addToCart = async (productId: string, productName: string) => {
    setLoadingProductId(productId);
    try {
      await axios.post('http://localhost:3001/cart', {
        product_id: productId,
        quantity: 1,
      });
      const response = await axios.get('http://localhost:3001/cart');
      const cartData = response.data.data as { items: { quantity: number }[] };
      setCartCount(cartData.items.reduce((total, item) => total + item.quantity, 0));
      notification.success({
        message: 'Thêm vào giỏ hàng thành công!',
        description: `${productName} đã được thêm vào giỏ hàng.`,
        duration: 2,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng.',
        duration: 2,
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 relative">
          Sản phẩm nổi bật
          <span className="absolute -bottom-2 left-0 w-16 h-1 bg-blue-600"></span>
        </h2>
        <Link href="/products">
        <Button type="link" className="text-blue-600 font-medium !rounded-button whitespace-nowrap">
          Xem tất cả <RightOutlined />
        </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.length === 0 ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          products.map((product) => (
            <Card
              key={product._id}
              hoverable
              className="border-none shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden"
              cover={
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-square bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Mới
                      </div>
                    )}
                  </div>
                </Link>
              }
            >
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>
                <div className="flex items-center my-2">
                  <Rate disabled defaultValue={product.rating} className="!text-xs" />
                  <span className="text-xs text-gray-500 ml-2">
                    ({Math.round(product.rating * 20)})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-red-600">
                      {product.salePrice.toLocaleString('vi-VN')}₫
                    </div>
                    {product.salePrice < product.price && (
                      <div className="text-xs text-gray-400 line-through">
                        {product.price.toLocaleString('vi-VN')}₫
                      </div>
                    )}
                  </div>
                  <Button
                    type="text"
                    icon={<ShoppingCartOutlined />}
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => addToCart(product._id, product.name)}
                    loading={loadingProductId === product._id}
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;