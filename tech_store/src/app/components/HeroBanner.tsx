'use client';
import { Carousel, Button } from 'antd';
import { Banner } from '@/app/types';
import Link from 'next/link';
import Image from 'next/image';

interface HeroBannerProps {
  banners: Banner[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ banners }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="relative">
        <Carousel autoplay effect="fade" dots={{ className: 'custom-dots' }} className="rounded-lg overflow-hidden">
          {banners.map((banner) => (
            <div key={banner.id} className="relative">
              <div className="relative h-[400px] md:h-[400px] bg-gradient-to-r from-blue-50 to-transparent">
                <div className="absolute inset-0 flex">
                  <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{banner.title}</h2>
                    <p className="text-lg text-gray-600 mb-6">{banner.description}</p>
                    <Link href="/products">
                    <Button
                      type="primary"
                      size="large"
                      className="w-max bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap"
                    >
                      
                      {banner.buttonText}
                    </Button>
                    </Link>
                   
                  </div>
                  <div className="hidden md:block w-1/2 relative">
                    <Image
  src={banner.image}
  alt={banner.title}
  fill
  className="object-cover object-top rounded-lg"
  priority
/>
                  </div>
                </div>
                <div className="block md:hidden absolute inset-0">
                  <Image
  src={banner.image}
  alt={banner.title}
  fill
  className="w-full h-full object-cover object-top opacity-20"
/>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default HeroBanner;