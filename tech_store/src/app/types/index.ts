export interface Category {
  _id: string;
  id: string;
  name: string;
  icon: string;
  slug: string;
  __v: number;
}

export interface Product {
  _id: string;
  id: number;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  rating: number;
  isNew: boolean;
  discount: number;
  slug: string;
  category_id: string;
  stock: number;
  brand: string;
  installment_available: boolean;
  description?: string;
  storage?: string; // Added to support storage field used in ProductTabs
  __v: number;
}

export interface Banner {
  _id: string;
  id: number;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  link: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  __v: number;
}

export interface Brand {
  _id: string;
  name: string;
  icon: string;
  slug: string;
  logo_url: string;
  __v: number;
}

export interface Review {
  _id: string;
  id: number;
  product_id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  created_at: string;
  __v: number;
}

export interface CartItem {
  id: string; // Changed from product_id to id to match CartContext usage
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  birthDate?: string;
  gender?: 'male' | 'female'; // Updated to match useAuth expectation
}

export interface OrderItem {
  productId: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Order {
  id: string;
  orderItems: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  fullName: string;
  phone: string;
  email: string;
  userfullname?: string;
  detailAddress: string;
  commune: string;
  district: string;
  city: string;
  orderDate?: string;
  paymentMethod: "card" | "ewallet" | "bank" | "cod";
  status?: "placed" | "confirmed" | "preparing" | "shipping" | "delivered";
}

export interface ShippingFormValues {
  fullname: string;
  phone: string;
  address: string;
  city: string;
  commune?: string; // Added to align with Order interface
  district?: string; // Added to align with Order interface
  [key: string]: any;
}