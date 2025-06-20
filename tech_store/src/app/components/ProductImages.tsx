"use client"

import { useRef, useState, useEffect } from "react"
import { Card, Tag, Carousel } from "antd"
import Image from "next/image"
import type { CarouselRef } from "antd/es/carousel"

interface ProductImagesProps {
  images: string[]
  productName: string
  discount: number
  isNew: boolean
  selectedColor?: string
}

export default function ProductImages({ images, productName, discount, isNew, selectedColor }: ProductImagesProps) {
  const carouselRef = useRef<CarouselRef>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    const ensuredImages = [...images]
    while (ensuredImages.length < 3) {
      ensuredImages.push(
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
      )
    }

    setLoadedImages(ensuredImages)
    setImagesLoaded(true)
    setActiveIndex(0)
    carouselRef.current?.goTo(0)
  }, [images, selectedColor])

  const handleThumbnailClick = (index: number) => {
    carouselRef.current?.goTo(index)
    setActiveIndex(index)
  }

  const handleImageError = (index: number) => {
    const newImages = [...loadedImages]
    newImages[index] =
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
    setLoadedImages(newImages)
  }

  if (!imagesLoaded) {
    return (
      <Card className="border-none shadow-sm relative">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-sm relative">
      <Carousel ref={carouselRef} autoplay={false} beforeChange={(_, next) => setActiveIndex(next)}>
        {loadedImages.map((img, index) => (
          <div key={index} className="relative h-96">
            {/* Tag nằm trong ảnh hiện tại */}
            {index === activeIndex && (
              <div className="absolute top-2 left-2 z-10 flex gap-2">
                {discount > 0 && (
                  <Tag color="red" className="rounded px-2 py-1 text-xs shadow-sm">
                    -{discount}%
                  </Tag>
                )}
                {isNew && (
                  <Tag color="green" className="rounded px-2 py-1 text-xs shadow-sm">
                    Mới
                  </Tag>
                )}
              </div>
            )}

            <Image
              src={
                img ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
              }
              alt={`${productName} - ${selectedColor || "Default"} - Image ${index + 1}`}
              fill
              style={{ objectFit: "contain" }}
              className="p-4"
              onError={() => handleImageError(index)}
              unoptimized={true}
            />
          </div>
        ))}
      </Carousel>

      {/* Thumbnail images */}
      <div className="flex justify-center mt-4 space-x-4">
        {loadedImages.map((img, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 cursor-pointer border rounded overflow-hidden ${
              activeIndex === index ? "border-blue-500 border-2" : "border-gray-200"
            } hover:border-blue-300 transition-all duration-200`}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image
              src={
                img ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
              }
              alt={`${selectedColor || "Default"} Thumbnail ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              onError={() => handleImageError(index)}
              unoptimized={true}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
