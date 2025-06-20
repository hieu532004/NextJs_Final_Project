// app/(site)/page.tsx
import { CartProvider } from '@/app/contexts/CartContext';
import HomeClient from '@/app/components/HomeClient';
import { Category, Product, Banner, Brand, Review } from '@/app/types';
import axios from 'axios';
import '@ant-design/v5-patch-for-react-19';

async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}${endpoint}`);
    if (response.data.statusCode && response.data.statusCode !== 200) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return response.data.data || response.data || ({} as T);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return {} as T;
  }
}

export default async function Home() {
  const categoriesData = await fetchData<{ categories: Category[] }>('/categories');
  const productsData = await fetchData<{ products: Product[] }>('/products');
  const bannersData = await fetchData<{ banners: Banner[] }>('/banners');
  const brandsData = await fetchData<{ brands: Brand[] }>('/brands');
  const reviewsData = await fetchData<{ reviews: Review[] }>('/reviews');

  return (
    
      <HomeClient
        categories={categoriesData.categories || []}
        featuredProducts={productsData.products || []}
        banners={bannersData.banners || []}
        brands={brandsData.brands || []}
        reviews={reviewsData.reviews || []}
        initialCartCount={0} // Bỏ cartCount từ API, để HomeClient xử lý
      />
    
  );
}