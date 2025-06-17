"use client";

import { useCart } from "@/app/contexts/CartContext";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header"; // Assuming this Header component is external
import { Button, Input, Badge, Divider, Empty, message } from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

// The CartItem interface should come from your CartContext definitions
// but defined here for clarity if it's not globally accessible
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string; // Kept as it's in your original CartItem interface
  color?: string; // Kept as it's in your original CartItem interface
}

// Utility function to format price (centralized for consistency)
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, loadCartFromLocalStorage, clearCart } =
    useCart();

  // State for coupon code and discount percentage, as in the target layout
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0); // Renamed for clarity

  // Header specific states (from your original CartPage)
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const toggleMobileMenu = () => setMobileMenuVisible(!mobileMenuVisible);

  // Load cart from local storage on component mount
  useEffect(() => {
    loadCartFromLocalStorage();
  }, [loadCartFromLocalStorage]);

  // Memoized calculations for cart summary, using `cart` from context
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // Shipping fee is 30,000 VND if there are items, otherwise 0
  const shippingFee = useMemo(() => (subtotal > 0 ? 30000 : 0), [subtotal]);

  const discountAmount = useMemo(
    () => (subtotal * discountPercentage) / 100,
    [subtotal, discountPercentage]
  );

  const total = useMemo(
    () => subtotal + shippingFee - discountAmount,
    [subtotal, shippingFee, discountAmount]
  );

  // Handle applying coupon code
  const handleApplyCoupon = () => {
    // In a real application, you'd validate this with a backend API
    const code = couponCode.toLowerCase();
    if (code === "giamgia10") {
      setDiscountPercentage(10);
      message.success("Áp dụng mã giảm giá thành công: Giảm 10%");
    } else if (code === "giamgia20") {
      setDiscountPercentage(20);
      message.success("Áp dụng mã giảm giá thành công: Giảm 20%");
    } else {
      setDiscountPercentage(0); // Reset discount if invalid
      message.error("Mã giảm giá không hợp lệ");
    }
  };

  // If cart is empty, display the Ant Design Empty component
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          toggleMobileMenu={toggleMobileMenu}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Giỏ hàng</h1>
            </div>
          </div>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-500 text-lg">
                  Giỏ hàng của bạn đang trống
                </span>
              }
            >
              <Link href="/" passHref>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  className="mt-4 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  Mua sắm ngay
                </Button>
              </Link>
            </Empty>
          </div>
        </div>
      </div>
    );
  }

  // Render cart content when not empty
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        toggleMobileMenu={toggleMobileMenu}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cart Header (consistent with empty state) */}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product List Section */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h1 className="text-xl font-bold mb-1">Giỏ hàng</h1>
              </div>
            </div>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="w-24 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96} // Equivalent to w-24 (96px)
                          height={64} // Equivalent to h-24 (96px)
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          {/* Fallback icon if no image */}
                          <ShoppingCartOutlined className="w-8 h-8 text-gray-400 text-base" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow sm:ml-6 mt-4 sm:mt-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        <Link href={`/products/${item.slug}`} passHref>
                          <span className="text-sm font-medium hover:underline cursor-pointer">
                            {item.name}
                          </span>
                        </Link>
                      </h3>
                      {/* Display size/color if they exist */}
                      {item.size && (
                        <p className="text-sm text-gray-500">
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-500">
                          Màu: {item.color}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end mt-4 sm:mt-0">
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined/>}
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 !rounded-button whitespace-nowrap cursor-pointer"
                      ></Button>
                      <div className="flex items-center mb-1">
                        <Button
                          icon={<MinusOutlined />}
                          type="text"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="border border-black rounded-md text-sm text-gray-500 !rounded-button whitespace-nowrap cursor-pointer"
                        />
                        <span className="px-4 py-1 text-center text-sm w-12">
                          {item.quantity}
                        </span>
                        <Button
                          icon={<PlusOutlined />}
                          type="text"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="border border-gray-300 rounded-md text-smtext-gray-500 !rounded-button whitespace-nowrap cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  <Divider className="my-0" />
                </div>
              ))}
            </div>
            {/* Action buttons at the bottom of the product list */}
            <div className="p-4 flex justify-between">
              <Link href="/" passHref>
                <Button
                  type="link"
                  className="flex items-center text-gray-600 hover:text-black"
                  icon={<ShoppingOutlined/>} // Changed from ArrowLeft for Ant Design consistency
                >
                  <div className="text-base ">Tiếp tục mua sắm</div>
                </Button>
              </Link>

              <Button
                type="link"
                danger
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 flex items-center"
                icon={<DeleteOutlined />} // Changed from Trash2
              >
                <div className="text-base ">Xóa giỏ hàng</div>
              </Button>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold mb-1">Thông tin đơn hàng</h1>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Tạm tính:</span>
                  <span className="text-sm font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Phí vận chuyển:</span>
                  <span className="text-sm font-medium">
                    {formatPrice(shippingFee)}
                  </span>
                </div>
                {discountPercentage > 0 && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span>Giảm giá ({discountPercentage}%):</span>
                    <span className="font-medium">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="my-3">
                <p className="text-sm text-gray-600 mb-3">
                  Mã giảm giá:
                </p>
                <div className="flex">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="rounded-l-md text-sm"
                  />
                  <Button
                    type="primary"
                    onClick={handleApplyCoupon}
                    className="rounded-r-md !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
                <Divider className="my-3 border-1 border-black" />
                <div className="flex justify-between py-2">
                  <span className="font-bold text-lg">
                    Tổng thanh toán:
                  </span>
                  <span className="font-bold text-lg text-red-600">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-gray-500 text-sm text-right">(Đã bao gồm VAT)</p>
              </div>

              

              <Link href="/cart/checkout" passHref>
                <Button
                  type="primary"
                  size="large"
                  block
                  className="h-14 text-lg font-medium !rounded-button whitespace-nowrap cursor-pointer"
                >
                  Thanh toán ngay
                </Button>
              </Link>

              <p className="text-xs text-center text-gray-500 mt-4">
                Bằng cách nhấn "Thanh toán ngay", bạn đồng ý với các điều khoản
                và điều kiện của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
