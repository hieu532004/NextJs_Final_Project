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
  product_id: string; // Thêm product_id để liên kết với sản phẩm
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  created_at: string;
  __v: number;
}

export interface Cart {
  items: { product_id: string; quantity: number }[];
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  birthDate?: string; // Hoặc Date nếu bạn muốn làm việc với kiểu Date
  gender?: string;
  // ... các thông tin khác liên quan đến người dùng
}