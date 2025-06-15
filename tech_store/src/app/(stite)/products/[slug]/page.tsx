"use client"

import { useEffect, useState } from "react"
import React from "react"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { Row, Col, Skeleton, Card, Divider, message } from "antd"
import Link from "next/link"
import type { Product, Category, Review } from "@/app/types"
import { useCart } from "@/app/contexts/CartContext"
import { useAuth } from "@/app/contexts/authContext"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import ProductImages from "@/app/components/ProductImages"
import ProductInfo from "@/app/components/ProductInfo"
import ProductTabs from "@/app/components/ProductTabs"
import RelatedProducts from "@/app/components/RelatedProducts"
import PaymentOffer from "@/app/components/PaymentOffer"

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
              <Skeleton.Image style={{ width: "100%", height: 384 }} />
              <div className="flex justify-center mt-4 space-x-2">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton.Image key={index} style={{ width: 64, height: 64 }} />
                  ))}
              </div>
            </Card>
          </Col>

          {/* Product Info Skeleton */}
          <Col xs={24} md={14}>
            <Skeleton active title={{ width: "60%" }} paragraph={{ rows: 2 }} />
            <Skeleton active title={false} paragraph={{ rows: 1, width: ["40%"] }} />
            <Skeleton active title={false} paragraph={{ rows: 3, width: ["30%", "20%", "25%"] }} />
            <div className="mb-4">
              <Skeleton.Input active style={{ width: 120 }} size="default" />
              <Skeleton.Input active style={{ width: 120 }} size="default" />
            </div>
            <Skeleton.Button active size="large" style={{ width: 160 }} />
            <Card className="border shadow-sm mb-4">
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            </Card>
            <Card className="border shadow-sm">
              <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        </Row>

        {/* Tabs Skeleton */}
        <div className="my-4">
          <Skeleton active title={{ width: "20%" }} paragraph={{ rows: 0 }} />
          <Skeleton active paragraph={{ rows: 5 }} title={false} />
        </div>

        {/* Related Products Skeleton */}
        <div className="my-4">
          <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 0 }} />
          <Row gutter={[16, 16]} className="mt-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <Card className="border shadow-sm">
                    <Skeleton.Image style={{ width: "100%", height: 160 }} />
                    <Skeleton active title={{ width: "80%" }} paragraph={{ rows: 2, width: ["60%", "40%"] }} />
                  </Card>
                </Col>
              ))}
          </Row>
        </div>

        {/* Payment Offer Skeleton */}
        <Card className="border shadow-sm">
          <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 1 }} />
        </Card>
      </main>

      {/* Footer Skeleton */}
      <div className="border-t">
        <div className="container mx-auto p-4">
          <Skeleton active paragraph={{ rows: 3 }} title={false} />
        </div>
      </div>
    </div>
  )
}

interface ProductDetailProps {
  params: Promise<{ slug: string }>
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resolvedParams = React.use(params)
  const slug = resolvedParams.slug
  const selectedCategory = searchParams.get("category")

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCategory, setLoadingCategory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>("Silver")
  const [selectedStorage, setSelectedStorage] = useState<string>("256GB")
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [currentImages, setCurrentImages] = useState<string[]>([])

  const { addToCart } = useCart()
  const { user } = useAuth()

  // Sử dụng trạng thái đăng nhập từ context
  const isLoggedIn = !!user

  // Tạo mảng ảnh dựa vào loại sản phẩm với URL tùy chỉnh cho thumbnail
  const generateProductImages = (product: Product) => {
    if (!product) return []

    // Mảng chứa các URL thumbnail tùy chỉnh theo category_id
    const thumbnailMap: { [key: string]: string[] } = {
      // Laptop - MacBook Air
      "68b1f3g488g6eg46h8g63fkl": [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      // Chuột
      "68b1f3g488g6eg46h8g63fkm": [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1967&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      // Bàn phím
      "68b1f3g488g6eg46h8g63fkn": [
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      // Tai nghe
      "68b1f3g488g6eg46h8g63fko": [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      // Cáp sạc
      "68b1f3g488g6eg46h8g63fkp": [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1601524909162-ae8725290836?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      // Balo laptop
      "68b1f3g488g6eg46h8g63fkq": [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      // Màn hình
      "68b1f3g488g6eg46h8g63fkr": [
        "https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      // Phụ kiện khác
      "68b1f3g488g6eg46h8g63fks": [
        "https://images.unsplash.com/photo-1625480860249-be231d9b90d4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1625480860249-be231d9b90d4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
    }

    // Lấy thumbnail tương ứng với category_id, hoặc dùng mặc định nếu không tìm thấy
    const thumbnails = thumbnailMap[product.category_id] || [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3",
    ]

    // Tạo mảng ảnh với ảnh chính và các thumbnail
    const productImages = [product.image, ...thumbnails]

    console.log("Generated images:", productImages)
    return productImages
  }

  // Fetch product, category, and reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const [productsResponse, categoriesResponse, reviewsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`),
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/categories`),
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/reviews`),
        ])

        const products: Product[] = productsResponse.data?.data?.products
        const categories: Category[] = categoriesResponse.data?.data?.categories

        // Xử lý dữ liệu reviews - sửa lại để xử lý đúng cấu trúc từ CodeSandbox
        let reviews: Review[] = []
        console.log("Raw reviews response:", reviewsResponse.data)

        if (reviewsResponse.data) {
          // Trường hợp 1: Response trực tiếp là array
          if (Array.isArray(reviewsResponse.data)) {
            reviews = reviewsResponse.data
          }
          // Trường hợp 2: Có nested structure với data.reviews
          else if (reviewsResponse.data.data && Array.isArray(reviewsResponse.data.data.reviews)) {
            reviews = reviewsResponse.data.data.reviews
          }
          // Trường hợp 3: Có reviews property là array
          else if (Array.isArray(reviewsResponse.data.reviews)) {
            reviews = reviewsResponse.data.reviews
          }
          // Trường hợp 4: reviews là object (từ CodeSandbox), chuyển thành array
          else if (reviewsResponse.data.reviews && typeof reviewsResponse.data.reviews === "object") {
            // Nếu reviews là object với các key là ID, chuyển thành array
            const reviewsObj = reviewsResponse.data.reviews
            if (reviewsObj._id) {
              // Nếu là single object, wrap trong array
              reviews = [reviewsObj]
            } else {
              // Nếu là object với multiple keys, convert values thành array
              reviews = Object.values(reviewsObj).filter((item: any) => item && typeof item === "object" && item._id) as Review[]
            }
          }
          // Trường hợp 5: reviews trực tiếp là single object
          else if (reviewsResponse.data._id) {
            reviews = [reviewsResponse.data]
          }
        }

        console.log("Processed reviews:", reviews)

        if (!Array.isArray(products)) throw new Error("Invalid products data.")
        if (!Array.isArray(categories)) throw new Error("Invalid categories data.")

        const foundProduct = products.find((p) => p.slug === slug)
        if (!foundProduct) {
          setError(`Product with slug "${slug}" not found.`)
          return
        }
        setProduct(foundProduct)

        const foundCategory = categories.find((cat) => cat._id === foundProduct.category_id)
        setCategory(foundCategory || null)

        const productReviews = Array.isArray(reviews)
          ? reviews.filter((review) => review.product_id === foundProduct._id)
          : []

        console.log("Product reviews for", foundProduct._id, ":", productReviews)
        setAllReviews(productReviews)

        const related = products
          .filter((p) => p.category_id === foundProduct.category_id && p._id !== foundProduct._id)
          .slice(0, 4)
        setRelatedProducts(related)

        setError(null)

        setCurrentPrice(foundProduct.salePrice)

        // Tạo mảng ảnh dựa trên sản phẩm
        const productImages = generateProductImages(foundProduct)
        setCurrentImages(productImages)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load product data."
        setError(errorMessage)
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  // Fetch category products
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!selectedCategory) {
        setCategoryProducts([])
        return
      }

      setLoadingCategory(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`)
        const products = response.data.data.products

        const categoryMap: { [key: string]: string[] } = {
          "laptop-gaming": ["Gaming"],
          "laptop-office": ["Văn Phòng"],
          "laptop-design": ["Đồ Họa"],
          macbook: ["MacBook"],
          mouse: ["Chuột"],
          keyboard: ["Bàn phím"],
          headphones: ["Tai nghe"],
          backpack: ["Balo"],
          monitor: ["Màn hình"],
          printer: ["Máy in"],
          scanner: ["Máy scan"],
          projector: ["Máy chiếu"],
        }

        const categoryKeywords = categoryMap[selectedCategory] || []
        const filteredProducts = products.filter((product: Product) =>
          categoryKeywords.some((keyword) => product.name.includes(keyword)),
        )
        setCategoryProducts(filteredProducts)
      } catch (error) {
        console.error("Error fetching category products:", error)
      } finally {
        setLoadingCategory(false)
      }
    }

    fetchCategoryProducts()
  }, [selectedCategory])

  // Update price and images based on selected options
  useEffect(() => {
    if (!product) return

    let priceAdjustment = 0
    if (selectedStorage === "512GB") {
      priceAdjustment = 2000000
    } else if (selectedStorage === "1TB") {
      priceAdjustment = 5000000
    }
    setCurrentPrice(product.salePrice + priceAdjustment)

    // Cập nhật ảnh dựa trên màu sắc được chọn (chỉ áp dụng cho MacBook)
    if (product.name.includes("MacBook") || product.name.includes("Apple")) {
      const colorLower = selectedColor.toLowerCase()

      // Lấy các thumbnail từ map
      const thumbnails = [
        `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3`,
        `https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3`,
      ]

      // Tạo mảng ảnh với ảnh chính và các thumbnail
      const updatedImages = [product.image, ...thumbnails]

      setCurrentImages(updatedImages)
    }
  }, [selectedColor, selectedStorage, product])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: product.image,
    })
    message.success("Added to cart!")
  }

  const handleBuyNow = () => {
    router.push("/cart")
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      message.success("Link copied to clipboard!")
    })
  }

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (error || !product) {
    return <div className="container mx-auto p-4 text-red-500">{error || "Product not found."}</div>
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
  )
}
