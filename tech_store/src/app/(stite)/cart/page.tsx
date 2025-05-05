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
}
