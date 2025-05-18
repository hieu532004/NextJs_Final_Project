'use client';

import { useRef } from 'react';
import { Card, Tag, Carousel } from 'antd';
import Image from 'next/image';
import { CarouselRef } from 'antd/es/carousel';

interface ProductImagesProps {
  images: string[];
  productName: string;
  discount: number;
  isNew: boolean;
}

export default function ProductImages({ images, productName, discount, isNew }: ProductImagesProps) {
  const carouselRef = useRef<CarouselRef>(null);

  return (
    <Card className="border-none shadow-sm relative">
      <Carousel ref={carouselRef} autoplay>
        {images.map((img, index) => (
          <div key={index} className="relative h-96">
            <Image
              src={img}
              alt={`${productName} - Image ${index + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              className="p-4"
            />
          </div>
        ))}
      </Carousel>
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative w-16 h-16 cursor-pointer border rounded"
            onClick={() => carouselRef.current?.goTo(index)}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
      {discount > 0 && (
        <Tag color="red" className="absolute top-2 left-2">
          -{discount}%
        </Tag>
      )}
      {isNew && (
        <Tag color="green" className="absolute top-2 right-2">
          Mới
        </Tag>
      )}
    </Card>
  );
}