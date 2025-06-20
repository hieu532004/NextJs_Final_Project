'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

// Kiểu dữ liệu cho sản phẩm trong giỏ hàng
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  slug?: string; // Thêm slug nếu cần thiết
}

// Kiểu dữ liệu cho context
interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
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

  // Hàm load từ localStorage (được memo hóa để tránh lặp)
  const loadCartFromLocalStorage = useCallback(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as unknown;
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'object' && item && 'id' in item)) {
          const validCart = parsed as CartItem[];
          setCart(validCart);
          setCartCount(validCart.reduce((count, item) => count + item.quantity, 0));
        } else {
          console.warn('Dữ liệu giỏ hàng không hợp lệ, khởi tạo lại');
          setCart([]);
          setCartCount(0);
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Lỗi phân tích localStorage:', error);
        setCart([]);
        setCartCount(0);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Gọi load khi component mount
  useEffect(() => {
    loadCartFromLocalStorage();
  }, [loadCartFromLocalStorage]);

  // Ghi cart vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartCount(cart.reduce((count, item) => count + item.quantity, 0));
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng:', error);
    }
  }, [cart]);

  useEffect(() => {
    const syncCart = () => {
      loadCartFromLocalStorage();
    };
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, [loadCartFromLocalStorage]);

  const addToCart = (item: CartItem) => {
    const quantityToAdd = item.quantity > 0 ? item.quantity : 1;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        cartItem =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color,
      );

      if (existingIndex !== -1) {
        return prevCart.map((cartItem, index) =>
          index === existingIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem,
        );
      }

      return [...prevCart, { ...item, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === id ? { ...item, quantity } : item)),
      );
    }
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

  const value: CartContextType = {
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
