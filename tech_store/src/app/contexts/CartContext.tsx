"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng
export interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

// Định nghĩa kiểu dữ liệu cho context
interface CartContextType {
  cart: CartItem[]
  cartCount: number
  setCartCount: (count: number) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  loadCartFromLocalStorage: () => void
}

// Tạo context với giá trị mặc định
const CartContext = createContext<CartContextType>({
  cart: [],
  cartCount: 0,
  setCartCount: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
  loadCartFromLocalStorage: () => {},
})

// Hook để sử dụng context
export const useCart = () => useContext(CartContext)

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Khởi tạo state từ localStorage (nếu có) hoặc mảng rỗng
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartCount, setCartCount] = useState<number>(0)

  // Load giỏ hàng từ localStorage khi component được mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
        setCartCount(parsedCart.reduce((count: number, item: CartItem) => count + item.quantity, 0))
      }
    } catch (error) {
      console.error("Không thể load giỏ hàng từ localStorage:", error)
    }
  }, [])

  // Lưu giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
      console.log("==========")
      console.log(cart)
      setCartCount(cart.reduce((count, item) => count + item.quantity, 0))
    } catch (error) {
      console.error("Không thể lưu giỏ hàng vào localStorage:", error)
    }
  }, [cart])

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (item: CartItem) => {
  const quantityToAdd = item.quantity != null && item.quantity > 0 ? item.quantity : 1

  setCart((prevCart) => {
    const existingItemIndex = prevCart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.size === item.size &&
        cartItem.color === item.color,
    )

    if (existingItemIndex !== -1) {
      // Cập nhật quantity
      return prevCart.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
          : cartItem
      )
    }

    // Thêm mới vào giỏ
    return [...prevCart, { ...item, quantity: quantityToAdd }]
  })
}

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }
  const loadCartFromLocalStorage = () => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCart([])
  }

  // Tính tổng giá trị giỏ hàng
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Đếm tổng số sản phẩm trong giỏ hàng
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  // Giá trị context
  const value = {
    cart,
    cartCount,
    setCartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    loadCartFromLocalStorage,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
