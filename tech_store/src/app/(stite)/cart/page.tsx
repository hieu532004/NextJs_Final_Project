
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Separator } from "@/app/components/ui/separator"
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"
import { useCart, type CartItem } from "@/app/components/cart"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart()
  const [couponCode, setCouponCode] = useState("")

  const increaseQuantity = (id: string) => {
    const item = cartItems.find((item: CartItem) => item.id === id)
    if (item) {
      updateQuantity(id, item.quantity + 1)
    }
  }

  const decreaseQuantity = (id: string) => {
    const item = cartItems.find((item: CartItem) => item.id === id)
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1)
    }
  }

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = Number.parseInt(value)
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(id, quantity)
    }
  }

  const shipping = 10.0 // Fixed shipping cost
  const total = subtotal + shipping

  return (
    <>
      {/* <Navbar /> */}

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-blue-600">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded shadow-sm text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <Button className="bg-blue-600 hover:bg-blue-500 text-gray-800" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="py-4 px-6 text-left">Products</th>
                        <th className="py-4 px-6 text-center">Price</th>
                        <th className="py-4 px-6 text-center">Quantity</th>
                        <th className="py-4 px-6 text-center">Total</th>
                        <th className="py-4 px-6 text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {cartItems.map((item: CartItem) => (
                        <tr key={item.id}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">${item.price.toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded"
                                onClick={() => decreaseQuantity(item.id)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="text"
                                value={item.quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityChange(item.id, e.target.value)}
                                className="w-12 h-8 mx-2 text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded"
                                onClick={() => increaseQuantity(item.id)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <Button variant="outline" asChild>
                  <Link href="/shop">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex gap-2 mb-4">
                    <Input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button className="bg-blue-400 hover:bg-blue-500 text-gray-800 whitespace-nowrap">
                      Apply Coupon
                    </Button>
                  </div>
                  <Button className="w-full bg-blue-400 hover:bg-blue-500 text-gray-800" size="lg" asChild>
                    <Link href="/checkout">Proceed To Checkout</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <Footer /> */}
    </>
  )
=======
"use client";

import { useCart } from "@/app/contexts/CartContext";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Header from '../../components/Header';
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
// import { Header } from "antd/es/layout/layout";

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
  const { cart, setCartCount, removeFromCart, updateQuantity, clearCart, loadCartFromLocalStorage } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const toggleMobileMenu = () => setMobileMenuVisible(!mobileMenuVisible);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      alert("Đặt hàng thành công!");
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-6xl">
              <Header
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        toggleMobileMenu={toggleMobileMenu}
      />
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
    );
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <Header
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        toggleMobileMenu={toggleMobileMenu}
      />
      <h1 className="flex justify-center text-2xl font-bold mb-8 mt-4 justify-center items-center">Giỏ hàng</h1>
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

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition ${
                isCheckingOut
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-800"
              }`}
            >
              {isCheckingOut ? "Đang xử lý..." : "Tiến hành thanh toán"}
            </button>
          </div>
        </div>
      </div>
  );
}
