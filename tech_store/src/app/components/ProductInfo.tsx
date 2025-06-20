// src/app/components/ProductInfo.tsx
"use client"

import { Button, Card, Rate, Select, Space } from "antd";
import { 
  ShoppingCartOutlined, 
  ShareAltOutlined, 
  CarOutlined, 
  GiftOutlined 
} from "@ant-design/icons";
import { Product, Category } from "@/app/types";
import AddToCart from './AddToCart';
import "@ant-design/v5-patch-for-react-19";

const { Option } = Select;

interface ProductInfoProps {
  product: Product
  category: Category | null
  currentPrice: number
  selectedColor: string
  setSelectedColor: (color: string) => void
  selectedStorage: string
  setSelectedStorage: (storage: string) => void
  handleAddToCart: (product: Product) => void
  handleBuyNow: () => void
  handleShare: () => void
  reviewsCount: number
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
  // Function để lấy màu sắc có sẵn cho từng sản phẩm
  const getAvailableColors = (product: Product): string[] => {
    const productName = product.name.toLowerCase()
    // Laptop Acer Nitro 5
    if (productName.includes("acer") && productName.includes("nitro")) {
      return ["Đen"]
    }
    // MacBook
    if (productName.includes("macbook") || productName.includes("apple")) {
      return ["Silver", "Space Gray", "Starlight"]
    }

    const colorMap: { [key: string]: string[] } = {
      // MacBook - Silver, Space Gray, Starlight (backup)
      "68b1f3g488g6eg46h8g63fkl": ["Silver", "Space Gray", "Starlight"],
      // Chuột - đen, trắng, hồng
      "68b1f3g488g6eg46h8g63fkm": ["Đen", "Trắng", "Hồng"],
      // Bàn phím - đen, trắng
      "68b1f3g488g6eg46h8g63fkn": ["Đen", "Trắng"],
      // Tai nghe - đen, trắng
      "68b1f3g488g6eg46h8g63fko": ["Đen", "Trắng"],
      // Balo - chỉ có 1 màu
      "68b1f3g488g6eg46h8g63fkq": ["Mặc định"],
    }

    // Nếu là laptop khác
    if (productName.includes("laptop") && !productName.includes("macbook") && !productName.includes("apple")) {
      return ["Đen"]
    }

    return colorMap[product.category_id] || ["Mặc định"]
  }


  const shouldShowStorage = (product: Product): boolean => {
    // Chỉ hiển thị dung lượng cho laptop (MacBook và các laptop khác), loại trừ Balo
    const laptopCategories = ["68b1f3g488g6eg46h8g63fkl"] 
    return (
      (laptopCategories.includes(product.category_id) ||
        product.name.toLowerCase().includes("laptop") ||
        product.name.toLowerCase().includes("macbook")) &&
      product.category_id !== "68b1f3g488g6eg46h8g63fkq" 
    )
  }

  const availableColors = getAvailableColors(product)
  const showColorSelection = availableColors.length > 1
  const showStorageSelection = shouldShowStorage(product)

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <div className="flex items-center mb-2">
        <Rate disabled value={product.rating} allowHalf className="text-sm mr-2" />
        <span className="text-sm text-gray-500">({reviewsCount} đánh giá)</span>
      </div>
      <div className="text-lg font-bold text-red-600 mb-2">{currentPrice.toLocaleString("vi-VN")}đ</div>
      {currentPrice < product.price && (
        <div className="text-sm text-gray-400 line-through mb-2">{product.price.toLocaleString("vi-VN")}đ</div>
      )}
      <div className="text-sm text-gray-600 mb-2">
        Thương hiệu: <span className="font-semibold">{product.brand}</span>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        Danh mục: <span className="font-semibold">{category?.name || "Không xác định"}</span>
      </div>
      <div className="text-sm text-gray-600 mb-4">
        Tình trạng:{" "}
        <span className="font-semibold">{product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}</span>
      </div>

      <div className="mb-4">
        {/* Chỉ hiển thị chọn màu nếu có nhiều hơn 1 màu */}
        {showColorSelection && (
          <div className="text-sm text-gray-600 mb-2">
            Màu sắc:
            <Select value={selectedColor} onChange={setSelectedColor} style={{ width: 120, marginLeft: 8 }}>
              {availableColors.map((color) => (
                <Option key={color} value={color}>
                  {color}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {/* Chỉ hiển thị chọn dung lượng cho laptop */}
        {showStorageSelection && (
          <div className="text-sm text-gray-600 mb-4">
            Dung lượng:
            <Select value={selectedStorage} onChange={setSelectedStorage} style={{ width: 120, marginLeft: 8 }}>
              <Option value="256GB">256GB</Option>
              <Option value="512GB">512GB</Option>
              <Option value="1TB">1TB</Option>
            </Select>
          </div>
        )}
      </div>

      <Space size="middle" className="mb-4">
        <AddToCart product={product} />
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
  )
}