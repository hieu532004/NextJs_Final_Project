// src/app/components/ProductDetailClient.tsx
'use client';

import { useCart } from '../contexts/CartContext'; // Sử dụng useCart
import { Product } from '../types';
import { Card, Rate, Button, notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Image from 'next/image';
import axios from 'axios';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { setCartCount } = useCart(); // Dùng useCart thay vì useContext

  const addToCart = async () => {
    try {
      await axios.post('http://localhost:3001/cart', {
        product_id: product._id,
        quantity: 1,
      });
      const response = await axios.get('http://localhost:3001/cart');
      const cartData = response.data.data as { items: { quantity: number }[] };
      setCartCount(cartData.items.reduce((total, item) => total + item.quantity, 0));
      notification.success({
        message: 'Thêm vào giỏ hàng thành công!',
        description: `${product.name} đã được thêm.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng.',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-8">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="object-contain w-full"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Rate disabled defaultValue={product.rating} />
            <span className="ml-2 text-gray-600">({Math.round(product.rating * 20)} đánh giá)</span>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-4">
            {product.salePrice.toLocaleString('vi-VN')}₫
          </div>
          {product.salePrice < product.price && (
            <div className="text-lg text-gray-400 line-through mb-4">
              {product.price.toLocaleString('vi-VN')}₫
            </div>
          )}
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            className="bg-blue-600 hover:bg-blue-700"
            onClick={addToCart}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </div>
  );
}