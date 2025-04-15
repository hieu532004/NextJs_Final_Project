'use client';
import { Brand } from '@/app/types';

interface BrandShowcaseProps {
  brands: Brand[];
}

const BrandShowcase: React.FC<BrandShowcaseProps> = ({ brands }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thương hiệu nổi bật</h2>
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {brands.map((brand) => (
            <div key={brand._id} className="flex items-center justify-center">
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <i className={`${brand.icon} text-3xl text-gray-700`}></i>
                </div>
                <span className="text-sm font-medium text-gray-700">{brand.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandShowcase;