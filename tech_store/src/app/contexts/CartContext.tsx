'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

// Định nghĩa kiểu dữ liệu cho context
interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>; // Hỗ trợ callback
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  loadCartFromLocalStorage: () => void;
}

// Tạo context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  // Load dữ liệu từ localStorage khi mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.every((item: any) => item && item.id !== undefined)) {
          setCart(parsedCart);
          setCartCount(parsedCart.reduce((count, item) => count + item.quantity, 0));
        } else {
          console.warn('Dữ liệu giỏ hàng không hợp lệ, khởi tạo lại giỏ hàng rỗng');
          setCart([]);
          setCartCount(0);
          localStorage.removeItem('cart'); // Xóa dữ liệu không hợp lệ
        }
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu giỏ hàng từ localStorage:', error);
        setCart([]);
        setCartCount(0);
        localStorage.removeItem('cart'); // Xóa dữ liệu lỗi
      }
    }
  }, []);

  // Ghi lại vào localStorage khi cart thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartCount(cart.reduce((count, item) => count + item.quantity, 0)); // Đồng bộ cartCount
    } catch (error) {
      console.error('Không thể lưu giỏ hàng vào localStorage:', error);
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    const quantityToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color,
      );

      if (existingItemIndex !== -1) {
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem,
        );
      }

      return [...prevCart, { ...item, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const loadCartFromLocalStorage = () => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const parsedCart = JSON.parse(stored);
        if (Array.isArray(parsedCart) && parsedCart.every((item: any) => item && item.id !== undefined)) {
          setCart(parsedCart);
        } else {
          console.warn('Dữ liệu giỏ hàng không hợp lệ, khởi tạo lại giỏ hàng rỗng');
          setCart([]);
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu giỏ hàng từ localStorage:', error);
        setCart([]);
        localStorage.removeItem('cart');
      }
    }
  };

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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
