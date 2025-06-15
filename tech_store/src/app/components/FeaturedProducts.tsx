'use client';

import { Button, Card, Rate, Skeleton } from 'antd';
import { ShoppingCartOutlined, RightOutlined } from '@ant-design/icons';
import { Product } from '../types';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: product.image,
    });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          // Hiển thị Skeleton khi không có sản phẩm
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="h-full flex flex-col border-none shadow-sm rounded-xl overflow-hidden">
              <Skeleton.Image active className="!w-full !h-48" />
              <Skeleton active paragraph={{ rows: 2 }} className="mt-4" />
              <Skeleton.Button active block className="!h-10 mt-4" />
            </Card>
          ))
        ) : (
          // Hiển thị sản phẩm khi có dữ liệu
          products.map((product) => (
            <Card
              key={product._id}
              hoverable
              className="h-full flex flex-col border-none shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden"
              cover={
  <Link href={`/products/${product.slug}`}>
    <div className="bg-gray-50 p-4 h-60 relative flex items-center justify-center rounded-t-xl">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
        style={{ objectFit: 'contain' }}
        className="transition-transform duration-300 hover:scale-105 !rounded-lg"
      />
      {product.discount > 0 && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{product.discount}%
        </div>
      )}
      {product.isNew && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Mới
        </div>
      )}
    </div>
  </Link>
}
            >
              <div className="flex-1 p-4">
                <h3 className="text-base font-medium text-gray-800 mb-2 line-clamp-2 h-12">{product.name}</h3>
                <div className="mb-2">
                  <Rate disabled defaultValue={product.rating} className="text-sm" />
                </div>
                <div className="mb-4">
                  <div className="text-lg font-bold text-red-600">
                    {product.salePrice.toLocaleString('vi-VN')}₫
                  </div>
                  {product.salePrice < product.price && (
                    <div className="text-sm text-gray-500 line-through">
                      {product.price.toLocaleString('vi-VN')}₫
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="primary"
                block
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap"
              >
                Thêm vào giỏ
              </Button>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;