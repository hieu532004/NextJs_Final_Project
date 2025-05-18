'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import Header from './Header';
import MobileMenuDrawer from './MobileMenuDrawer';
import HeroBanner from './HeroBanner';
import Categories from './Categories';
import FeaturedProducts from './FeaturedProducts';
import BestSellingProducts from './BestSellingProducts';
import PromotionsBanner from './PromotionsBanner';
import BrandShowcase from './BrandShowcase';
import CustomerReviews from './CustomerReviews';
import Newsletter from './Newsletter';
import Footer from './Footer';
import FilterDrawer from './FilterDrawer';
import { Category, Product, Banner, Brand, Review } from '../types';

interface HomeClientProps {
  categories: Category[];
  featuredProducts: Product[];
  banners: Banner[];
  brands: Brand[];
  reviews: Review[];
  initialCartCount: number;
}

export default function HomeClient({
  categories,
  featuredProducts,
  banners,
  brands,
  reviews,
  initialCartCount,
}: HomeClientProps) {
  const { setCartCount } = useCart();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setCartCount(initialCartCount);
  }, [initialCartCount, setCartCount]);

  const toggleMobileMenu = () => setMobileMenuVisible(!mobileMenuVisible);

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const resetFilters = () => {
    setPriceRange([0, 50000000]);
    setSelectedBrands([]);
  };

  return (
    <>
      <Header
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        toggleMobileMenu={toggleMobileMenu}
      />
      <MobileMenuDrawer
        visible={mobileMenuVisible}
        onClose={toggleMobileMenu}
        categories={categories}
      />
      <HeroBanner banners={banners} />
      <Categories categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <BestSellingProducts products={featuredProducts} />
      <PromotionsBanner />
      <BrandShowcase brands={brands} />
      <CustomerReviews reviews={reviews} />
      <Newsletter />
      <Footer />
      <FilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        brands={brands.map((b) => b.name)}
        selectedBrands={selectedBrands}
        handleBrandChange={handleBrandChange}
        resetFilters={resetFilters}
      />
    </>
  );
}