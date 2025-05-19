'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Row, Col, Skeleton, Card, Divider, message } from 'antd';
import Link from 'next/link';
import { Product, Category, Review } from '@/app/types';
import { useCart } from '@/app/contexts/CartContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductImages from '@/app/components/ProductImages';
import ProductInfo from '@/app/components/ProductInfo';
import ProductTabs from '@/app/components/ProductTabs';
import RelatedProducts from '@/app/components/RelatedProducts';
import PaymentOffer from '@/app/components/PaymentOffer';

// Component Skeleton
function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Skeleton */}
      <div className="border-b">
        <div className="container mx-auto p-4">
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-grow container mx-auto p-4">
        {/* Breadcrumb Skeleton */}
        <div className="mb-4">
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
        </div>

        <Row gutter={[16, 16]}>
          {/* Image Section Skeleton */}
          <Col xs={24} md={10}>
            <Card className="border-none shadow-sm">
              <Skeleton.Image style={{ width: '100%', height: 384 }} />
              <div className="flex justify-center mt-4 space-x-2">
                {Array(3).fill(0).map((_, index) => (
                  <Skeleton.Image key={index} style={{ width: 64, height: 64 }} />
                ))}
              </div>
            </Card>
          </Col>

          {/* Product Info Skeleton */}
          <Col xs={24} md={14}>
            <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 2 }} />
            <Skeleton active title={false} paragraph={{ rows: 1, width: ['40%'] }} />
            <Skeleton active title={false} paragraph={{ rows: 3, width: ['30%', '20%', '25%'] }} />
            <div className="mb-4">
              <Skeleton.Input active style={{ width: 120 }} size="default" />
              <Skeleton.Input active style={{ width: 120 }} size="default" />
            </div>
            <Skeleton.Button active size="large" style={{ width: 160 }} />
            <Card className="border shadow-sm mb-4">
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            </Card>
            <Card className="border shadow-sm">
              <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        </Row>

        {/* Tabs Skeleton */}
        <div className="my-4">
          <Skeleton active title={{ width: '20%' }} paragraph={{ rows: 0 }} />
          <Skeleton active paragraph={{ rows: 5 }} title={false} />
        </div>

        {/* Related Products Skeleton */}
        <div className="my-4">
          <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 0 }} />
          <Row gutter={[16, 16]} className="mt-4">
            {Array(4).fill(0).map((_, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="border shadow-sm">
                  <Skeleton.Image style={{ width: '100%', height: 160 }} />
                  <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 2, width: ['60%', '40%'] }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Payment Offer Skeleton */}
        <Card className="border shadow-sm">
          <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 1 }} />
        </Card>
      </main>

      {/* Footer Skeleton */}
      <div className="border-t">
        <div className="container mx-auto p-4">
          <Skeleton active paragraph={{ rows: 3 }} title={false} />
        </div>
      </div>
    </div>
  );
}

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const selectedCategory = searchParams.get('category');

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [allReviews, setAllReviews]  = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('Silver');
  const [selectedStorage, setSelectedStorage] = useState<string>('256GB');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isLoggedIn] = useState<boolean>(false);

  const { addToCart } = useCart();

  // Fetch product, category, and reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse, reviewsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`),
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/categories`),
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/reviews`),
        ]);

        const products: Product[] = productsResponse.data?.data?.products;
        const categories: Category[] = categoriesResponse.data?.data?.categories;
        const reviews: Review[] = reviewsResponse.data?.data?.reviews;

        if (!Array.isArray(products)) throw new Error('Invalid products data.');
        if (!Array.isArray(categories)) throw new Error('Invalid categories data.');
        if (!Array.isArray(reviews)) throw new Error('Invalid reviews data.');

        const foundProduct = products.find((p) => p.slug === slug);
        if (!foundProduct) {
          setError(`Product with slug "${slug}" not found.`);
          return;
        }
        setProduct(foundProduct);

        const foundCategory = categories.find((cat) => cat._id === foundProduct.category_id);
        setCategory(foundCategory || null);

        const productReviews = reviews.filter((review) => review.product_id === foundProduct._id);
        setAllReviews(productReviews);

        const related = products
          .filter((p) => p.category_id === foundProduct.category_id && p._id !== foundProduct._id)
          .slice(0, 4);
        setRelatedProducts(related);

        setError(null);

        setCurrentPrice(foundProduct.salePrice);
        setCurrentImages([
          foundProduct.image,
          `https://readdy.ai/api/search-image?query=MacBook%20Air%20M2%202022%20side%20view%2C%20silver%2C%20clean%20white%20background%2C%20professional%20photography&width=300&height=200&seq=1&orientation=landscape`,
          `https://readdy.ai/api/search-image?query=Mac彼此:MacBook%20Air%20M2%202022%20keyboard%20view%2C%20silver%2C%20clean%20white%20background%2C%20professional%20photography&width=300&height=200&seq=2&orientation=landscape`,
        ]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load product data.';
        setError(errorMessage);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Fetch category products
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!selectedCategory) {
        setCategoryProducts([]);
        return;
      }

      setLoadingCategory(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`);
        const products = response.data.data.products;

        const categoryMap: { [key: string]: string[] } = {
          'laptop-gaming': ['Gaming'],
          'laptop-office': ['Văn Phòng'],
          'laptop-design': ['Đồ Họa'],
          macbook: ['MacBook'],
          mouse: ['Chuột'],
          keyboard: ['Bàn phím'],
          headphones: ['Tai nghe'],
          backpack: ['Balo'],
          monitor: ['Màn hình'],
          printer: ['Máy in'],
          scanner: ['Máy scan'],
          projector: ['Máy chiếu'],
        };

        const categoryKeywords = categoryMap[selectedCategory] || [];
        const filteredProducts = products.filter((product: Product) =>
          categoryKeywords.some((keyword) => product.name.includes(keyword))
        );
        setCategoryProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory]);

  // Update price and images
  useEffect(() => {
    if (!product) return;

    let priceAdjustment = 0;
    if (selectedStorage === '512GB') {
      priceAdjustment = 2000000;
    } else if (selectedStorage === '1TB') {
      priceAdjustment = 5000000;
    }
    setCurrentPrice(product.salePrice + priceAdjustment);

    const colorLower = selectedColor.toLowerCase();
    setCurrentImages([
      product.image.replace('silver', colorLower),
      `https://readdy.ai/api/search-image?query=MacBook%20Air%20M2%202022%20side%20view%2C%20${colorLower}%2C%20clean%20white%20background%2C%20professional%20photography&width=300&height=200&seq=1&orientation=landscape`,
      `https://readdy.ai/api/search-image?query=MacBook%20Air%20M2%202022%20keyboard%20view%2C%20${colorLower}%2C%20clean%20white%20background%2C%20professional%20photography&width=300&height=200&seq=2&orientation=landscape`,
    ]);
  }, [selectedColor, selectedStorage, product]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: product.image,
    });
    message.success('Added to cart!');
  };

  const handleBuyNow = () => {
    router.push('/cart');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      message.success('Link copied to clipboard!');
    });
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <div className="container mx-auto p-4 text-red-500">{error || 'Product not found.'}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchValue="" setSearchValue={() => {}} toggleMobileMenu={() => {}} />
      <main className="flex-grow container mx-auto p-4">
        <div className="mb-4 text-sm">
          <Link href="/">Trang chủ</Link> / <Link href="/products">Sản phẩm</Link> / {product.name}
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <ProductImages
              images={currentImages}
              productName={product.name}
              discount={product.discount}
              isNew={product.isNew}
            />
          </Col>
          <Col xs={24} md={14}>
            <ProductInfo
              product={product}
              category={category}
              currentPrice={currentPrice}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedStorage={selectedStorage}
              setSelectedStorage={setSelectedStorage}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              handleShare={handleShare}
              reviewsCount={allReviews.length}
            />
          </Col>
        </Row>
        <Divider />
        <ProductTabs
          product={product}
          category={category}
          reviews={allReviews}
          setReviews={setAllReviews}
          isLoggedIn={isLoggedIn}
          router={router}
        />
        <Divider />
        <RelatedProducts
          selectedCategory={selectedCategory}
          loadingCategory={loadingCategory}
          categoryProducts={categoryProducts}
          relatedProducts={relatedProducts}
        />
        <Divider />
        <PaymentOffer />
      </main>
      <Footer />
    </div>
  );
}