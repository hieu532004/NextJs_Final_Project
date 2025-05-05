'use client';

import Link from 'next/link';
import { memo } from 'react';
import { Brand } from '../types';

interface BrandShowcaseProps {
  brands: Brand[];
}

const BrandShowcase: React.FC<BrandShowcaseProps> = ({ brands }) => {
  if (!brands || brands.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        No brands available
      </div>
    );
  }

  // Hàm tạo URL với query parameter brand
  const createQueryString = (brand: string) => {
    const params = new URLSearchParams();
    params.set('brand', brand);
    return `/products?${params.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thương hiệu nổi bật</h2>
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={createQueryString(brand.slug)} // Sử dụng query parameter brand
              className="flex items-center justify-center"
              aria-label={`View ${brand.name} products`}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <i
                    className={`${brand.icon || 'fas fa-question'} text-3xl text-gray-700`}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{brand.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(BrandShowcase);