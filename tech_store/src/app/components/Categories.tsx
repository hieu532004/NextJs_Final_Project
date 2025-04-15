// src/app/components/Categories.tsx
'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Category } from '../types';

// Interface riêng cho Categories
interface CategoriesProps {
  categories: Category[];
}

const Categories: FC<CategoriesProps> = ({ categories }) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link key={category._id} href={`/products/${category.slug}`}>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <span className="text-gray-800 font-medium">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;