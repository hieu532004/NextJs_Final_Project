'use client';

import { Button, Card, Rate, Select, Space } from 'antd';
import {
  ShoppingCartOutlined,
  ShareAltOutlined,
  CarOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Product, Category } from '@/app/types';

const { Option } = Select;

interface ProductInfoProps {
  product: Product;
  category: Category | null;
  currentPrice: number;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedStorage: string;
  setSelectedStorage: (storage: string) => void;
  handleAddToCart: (product: Product) => void;
  handleBuyNow: () => void;
  handleShare: () => void;
  reviewsCount: number;
}

export default function ProductInfo({
  product,
  category,
  currentPrice,
  selectedColor,
  setSelectedColor,
  selectedStorage,
  setSelectedStorage,
  handleAddToCart,
  handleBuyNow,
  handleShare,
  reviewsCount,
}: ProductInfoProps) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <div className="flex items-center mb-2">
        <Rate disabled value={product.rating} allowHalf className="text-sm mr-2" />
        <span className="text-sm text-gray-500">({reviewsCount} đánh giá)</span>
      </div>
      <div className="text-lg font-bold text-red-600 mb-2">
        {currentPrice.toLocaleString('vi-VN')}đ
      </div>
      {currentPrice < product.price && (
        <div className="text-sm text-gray-400 line-through mb-2">
          {product.price.toLocaleString('vi-VN')}đ
        </div>
      )}
      <div className="text-sm text-gray-600 mb-2">
        Thương hiệu: <span className="font-semibold">{product.brand}</span>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        Danh mục: <span className="font-semibold">{category?.name || 'Không xác định'}</span>
      </div>
      <div className="text-sm text-gray-600 mb-4">
        Tình trạng:{' '}
        <span className="font-semibold">{product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}</span>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          Màu sắc:
          <Select value={selectedColor} onChange={setSelectedColor} style={{ width: 120, marginLeft: 8 }}>
            <Option value="Silver">Silver</Option>
            <Option value="Space Gray">Space Gray</Option>
            <Option value="Starlight">Starlight</Option>
          </Select>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Dung lượng:
          <Select value={selectedStorage} onChange={setSelectedStorage} style={{ width: 120, marginLeft: 8 }}>
            <Option value="256GB">256GB</Option>
            <Option value="512GB">512GB</Option>
            <Option value="1TB">1TB</Option>
          </Select>
        </div>
      </div>

      <Space size="middle" className="mb-4">
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          size="large"
          onClick={() => handleAddToCart(product)}
          disabled={product.stock === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm vào giỏ hàng
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Mua ngay
        </Button>
        <Button icon={<ShareAltOutlined />} size="large" onClick={handleShare}>
          Chia sẻ
        </Button>
      </Space>

      <Card className="border shadow-sm mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <CarOutlined className="mr-2" />
          <span>Giao hàng: Dự kiến giao hàng trong 2-3 ngày. Phí vận chuyển: 30.000đ</span>
        </div>
      </Card>

      <Card className="border shadow-sm mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">🛡️</span>
          Bảo hành chính hãng 1 năm tại các trung tâm bảo hành
        </div>
      </Card>

      <Card className="border shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <GiftOutlined className="mr-2 text-red-500" />
          Khuyến mãi
        </h3>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          <li className="mb-1">Phiếu mua hàng mệnh giá 300.000đ</li>
          <li className="mb-1">Hỗ trợ trả góp 0% qua thẻ tín dụng</li>
          <li className="mb-1">Nhập mã VNPAY giảm thêm 80.000đ (áp dụng thanh toán VNPAY-QR)</li>
        </ul>
      </Card>
    </>
  );
}