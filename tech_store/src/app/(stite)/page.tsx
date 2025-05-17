// app/(site)/page.tsx
import axios from 'axios';
import { CartProvider } from '@/app/contexts/CartContext';
import HomeClient from '@/app/components/HomeClient';
import { Category, Product, Banner, Brand, Review, Cart } from '@/app/types';

async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}${endpoint}`);
    if (response.data.statusCode && response.data.statusCode !== 200) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    // Nếu có response.data.data (như /categories, /products), trả về response.data.data
    // Nếu không (như /cart sau khi sửa), trả về response.data
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export default async function Home() {
  const categoriesData = await fetchData<{ categories: Category[] }>('/categories');
  const productsData = await fetchData<{ products: Product[] }>('/products');
  const bannersData = await fetchData<{ banners: Banner[] }>('/banners');
  const brandsData = await fetchData<{ brands: Brand[] }>('/brands');
  const reviewsData = await fetchData<{ reviews: Review[] }>('/reviews');
  const cartData = await fetchData<Cart>('/cart');

  const cartCount = cartData.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartProvider>
      <HomeClient
        categories={categoriesData.categories}
        featuredProducts={productsData.products}
        banners={bannersData.banners}
        brands={brandsData.brands}
        reviews={reviewsData.reviews}
        initialCartCount={cartCount}
      />
    </CartProvider>
  );
}