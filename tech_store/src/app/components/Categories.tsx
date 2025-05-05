'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Category } from '../types';

interface CategoriesProps {
  categories: Category[];
}

const Categories: FC<CategoriesProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8 text-center text-gray-600">
        No categories available
      </section>
    );
  }

  // Hàm tạo URL với query parameter category
  const createQueryString = (category: string) => {
    const params = new URLSearchParams();
    params.set('category', category);
    return `/products?${params.toString()}`;
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={createQueryString(category.slug)} // Sử dụng slug từ data.json
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            aria-label={`View ${category.name} products`}
          >
            <div className="p-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                <i
                  className={`${category.icon || 'fas fa-question'} text-2xl text-blue-600`}
                  aria-hidden="true"
                />
              </div>
              <span className="text-sm font-medium text-gray-800 text-center">
                {category.name || 'Unnamed Category'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;