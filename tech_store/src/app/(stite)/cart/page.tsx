"use client";

import { useCart } from "@/app/contexts/CartContext";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Header from '../../components/Header';
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "antd";
import '@ant-design/v5-patch-for-react-19';

export interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, loadCartFromLocalStorage } = useCart();
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const toggleMobileMenu = () => setMobileMenuVisible(!mobileMenuVisible);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  useEffect(() => {
    loadCartFromLocalStorage();
  }, [loadCartFromLocalStorage]);


  if (cart.length === 0) {
    return (
      <div>
        <div>    <Header
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          toggleMobileMenu={toggleMobileMenu}
        /></div>
        <div className="container mx-auto max-w-6xl">

          <h1 className="text-2xl flex justify-center  font-bold mb-8 mt-4 ml-4">Giỏ hàng</h1>
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-6">
              Giỏ hàng của bạn đang trống
            </p>
            <Link
              href="/"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-gray-800 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Header
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          toggleMobileMenu={toggleMobileMenu}
        />
      </div>
      <div className="container mx-auto max-w-6xl">

        <h1 className="flex justify-center text-2xl font-bold mb-8 mt-4 items-center">Giỏ hàng</h1>
        <div className="lg:col-span-2">
          <div className="rounded-lg shadow-sm overflow-hidden border border-gray-500 bg-white">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b text-base font-medium text-gray-500">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-center">Tổng</div>
            </div>

            {cart.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b items-center"
              >
                <div className="col-span-6 flex items-center space-x-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-white">
                    {item.image ? (
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-500">Màu: {item.color}</p>
                    )}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm flex items-center mt-2 md:hidden"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  <p className="md:hidden text-sm text-gray-500 mb-1">Giá:</p>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </div>

                <div className="col-span-2 flex justify-center">
                  <p className="md:hidden text-sm text-gray-500 mb-1">
                    Số lượng:
                  </p>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="col-span-2 text-center flex justify-between md:justify-center items-center">
                  <p className="md:hidden text-sm text-gray-500">Tổng:</p>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-gray-400 hover:text-red-500 hidden md:block"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 flex justify-between">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-black"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tiếp tục mua sắm
              </Link>

              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa giỏ hàng
              </button>
            </div>
          </div>
        </div>

        <div className=" lg:col-span-1 my-4 rounded border border-gray-500 bg-white">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Tổng giỏ hàng</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between pb-3 border-b">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium">Miễn phí</span>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>
            </div>

            <Link href="/cart/checkout">
              <Button
                type="primary"
                block
                className="bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap"

              >
                Tiến Hành Thanh Toán
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
