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
}

export default function ProductImages({ images, productName, discount, isNew }: ProductImagesProps) {
  const carouselRef = useRef<CarouselRef>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    // Đảm bảo luôn có 3 ảnh, nếu không đủ thì dùng ảnh dự phòng
    const ensuredImages = [...images]
    while (ensuredImages.length < 3) {
      ensuredImages.push(
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      )
    }

    console.log("Images received in ProductImages:", ensuredImages)

    // Đặt ảnh ngay lập tức để tránh màn hình trống
    setLoadedImages(ensuredImages)
    setImagesLoaded(true)
  }, [images])

  const handleThumbnailClick = (index: number) => {
    carouselRef.current?.goTo(index)
    setActiveIndex(index)
  }

  const handleImageError = (index: number) => {
    console.log(`Error loading image at index ${index}`)
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
            <Image
              src={
                img ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
              }
              alt={`${productName} - Image ${index + 1}`}
              fill
              style={{ objectFit: "contain" }}
              className="p-4"
              onError={() => handleImageError(index)}
              unoptimized={true} // Tắt tối ưu hóa cho tất cả ảnh để tránh lỗi
            />
          </div>
        ))}
      </Carousel>

      {/* Hiển thị thumbnail */}
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
              alt={`Thumbnail ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              onError={() => handleImageError(index)}
              unoptimized={true} // Tắt tối ưu hóa cho tất cả ảnh để tránh lỗi
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
  )
}
