
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

// Tạo context
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

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartCount, setCartCount] = useState<number>(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load dữ liệu từ localStorage khi mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCart(parsedCart)
      setCartCount(parsedCart.reduce((count: number, item: CartItem) => count + item.quantity, 0))
    }
    setIsInitialized(true)
  }, [])

  // Ghi lại vào localStorage mỗi khi cart thay đổi (sau khi đã initialized)
  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
      setCartCount(cart.reduce((count, item) => count + item.quantity, 0))
    } catch (error) {
      console.error("Không thể lưu giỏ hàng vào localStorage:", error)
    }
  }, [cart, isInitialized])

  const addToCart = (item: CartItem) => {
    const quantityToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color,
      )

      if (existingItemIndex !== -1) {
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem,
        )
      }

      return [...prevCart, { ...item, quantity: quantityToAdd }]
    })
  }

  const removeFromCart = (id: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const loadCartFromLocalStorage = () => {
    const stored = localStorage.getItem("cart")
    if (stored) setCart(JSON.parse(stored))
  }

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