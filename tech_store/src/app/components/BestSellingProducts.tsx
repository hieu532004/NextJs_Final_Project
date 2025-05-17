'use client';
import { Button, Card, Rate } from 'antd';
import { ShoppingCartOutlined, RightOutlined } from '@ant-design/icons';
import { Product } from '@/app/types';
import Link from 'next/link';
import { useCart } from '@/app/contexts/CartContext';
interface BestSellingProductsProps {
  products: Product[];
}

const BestSellingProducts: React.FC<BestSellingProductsProps> = ({ products }) => {
  const { addToCart } = useCart(); // Lấy hàm addToCart từ CartContext

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sản phẩm bán chạy</h2>
        <Link href="/products">
          <Button type="link" className="text-blue-600 font-medium !rounded-button whitespace-nowrap">
            Xem tất cả <RightOutlined />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(4, 8).concat(products.slice(0, 4)).map((product) => (
          <Card
            key={product._id}
            hoverable
            cover={
              <div className="relative pt-4 px-4 h-48 overflow-hidden">
                <img alt={product.name} src={product.image} className="w-full h-full object-contain object-top" />
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Mới
                  </div>
                )}
              </div>
            }
            className="h-full flex flex-col"
          >
            <div className="flex-1">
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
              className="bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap"
              icon={<ShoppingCartOutlined />}
              onClick={() => handleAddToCart(product)}
            >
              Thêm vào giỏ
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;