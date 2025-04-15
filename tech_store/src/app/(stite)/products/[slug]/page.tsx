// src/app/(site)/products/[slug]/page.tsx
import axios from 'axios';
import ProductDetailClient from '@/app/components/ProductDetailClient';
import { Product } from '@/app/types';

async function fetchProduct(slug: string): Promise<Product> {
  try {
    const response = await axios.get(`http://localhost:3001/products`);
    const products = response.data.data.products as Product[];
    const product = products.find((p) => p.slug === slug); // Tìm sản phẩm theo slug
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);

  return <ProductDetailClient product={product} />;
}