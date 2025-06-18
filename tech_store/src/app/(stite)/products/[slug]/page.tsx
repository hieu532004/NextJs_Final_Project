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
  const [selectedColor, setSelectedColor] = useState<string>("Trắng") // Thay đổi default color
  const [selectedStorage, setSelectedStorage] = useState<string>("256GB")
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [currentImages, setCurrentImages] = useState<string[]>([])

  const { addToCart } = useCart()
  const { user } = useAuth()

  // Sử dụng trạng thái đăng nhập từ context
  const isLoggedIn = !!user

  // Helper function để kiểm tra URL có hợp lệ không
  const isValidImageUrl = (url: string): boolean => {
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")
  }

  // Function để lấy màu sắc có sẵn cho từng sản phẩm
  const getAvailableColors = (product: Product): string[] => {
    const colorMap: { [key: string]: string[] } = {
      // MacBook 
      "68b1f3g488g6eg46h8g63fkl": ["Silver", "Space Gray", "Starlight"],
      // Chuột 
      "68b1f3g488g6eg46h8g63fkm": ["Đen", "Trắng", "Hồng"],
      // Bàn phím - đen, trắng
      "68b1f3g488g6eg46h8g63fkn": ["Đen", "Trắng"],
      // Tai nghe - đen, trắng
      "68b1f3g488g6eg46h8g63fko": ["Đen", "Trắng"],
      // Balo - chỉ có 1 màu
      "68b1f3g488g6eg46h8g63fkq": ["Mặc định"],
    }

    return colorMap[product.category_id] || ["Mặc định"]
  }

  // Tạo mảng ảnh dựa vào loại sản phẩm và màu sắc
  const generateProductImages = (product: Product, selectedColor: string) => {
    if (!product) return []

    const productName = product.name.toLowerCase()

    // Map ảnh theo màu sắc cho từng category_id
    const colorImageMap: { [key: string]: { [color: string]: string[] } } = {
      // Laptop - MacBook Air 
      "68b1f3g488g6eg46h8g63fkl": {
        Silver: [
          product.image,
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3",
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        "Space Gray": [
          "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3",
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3",
          "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
        Starlight: [
          "https://images.unsplash.com/photo-1484788984921-03950022c9ef?q=80&w=2132&auto=format&fit=crop&ixlib=rb-4.0.3",
          "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        ],
      },
      // Chuột
      "68b1f3g488g6eg46h8g63fkm": {
        Đen: [
          "https://product.hstatic.net/200000722513/product/g-pro-x-superlight-wireless-black-666_83650815ce2e486f9108dbbb17c29159_1450bb4a9bd34dcb92fc77f627eb600d_grande.jpg",
          "https://product.hstatic.net/200000722513/product/h-g-pro-x-superlight-wireless-black-2_4b0290dbd52041d7a10d68cb96d7392a_be321391ae184e6cbfc5106272104034_grande.jpg",
          "https://product.hstatic.net/200000722513/product/h-g-pro-x-superlight-wireless-black-4_88b86530a83d4c71b510f37427886a49_27d8f9d673534f1baba26c22fe8815d7_grande.jpg",
        ],
        Trắng: [
          product.image,
          "https://product.hstatic.net/200000722513/product/g-pro-x-superlight-wireless-white-666_1b449789ba424d6bb38370ca7bdecf2a_01499c0fa7d14e60902fea481990bdd1_grande.jpg",
          "https://product.hstatic.net/200000722513/product/h-g-pro-x-superlight-wireless-white-4_08c977bb7b024d8da1244cd5901793eb_cb7e68df88034aa389e95815aab6e5e6_grande.jpg",
        ],
        Hồng: [
          "https://product.hstatic.net/200000722513/product/1_81fcd168337f4753b00f14e761806a93_accbc40c9e3140a2a6a18cace29cb11a_grande.png",
          "https://product.hstatic.net/200000722513/product/bazooka-magenta-gallery-3_cf89a1fda5344bcbb359f112a790f72c_9f15ce9f47334f31be8cc1f8f50df47c_grande.jpg",
          "https://product.hstatic.net/200000722513/product/bazooka-magenta-gallery-3_cf89a1fda5344bcbb359f112a790f72c_9f15ce9f47334f31be8cc1f8f50df47c_grande.jpg",
        ],
      },
      // Bàn phím
      "68b1f3g488g6eg46h8g63fkn": {
        Đen: [
          "https://product.hstatic.net/200000453251/product/3_23d91d5ad3fa49e2940d37caa83a8451_master.png",
          "https://product.hstatic.net/200000453251/product/7_b4a2b5fea449408ea8aeedc7655e01d9_master.png",
          "https://product.hstatic.net/200000453251/product/9_798d4c9d2eab4ef5beb3993e61c28fb6_master.png",
        ],
        Trắng: [
          "https://product.hstatic.net/200000453251/product/6_369398f261994f3ab1547b4371941c98_master.png",
          "https://product.hstatic.net/200000453251/product/4_bfe061196c39463a9c46a794564de53b_master.png",
          "https://product.hstatic.net/200000453251/product/8_7796a25be58642daab9398bf0b6b1cfd_master.png",
        ],
      },
      // Tai nghe 
      "68b1f3g488g6eg46h8g63fko": {
        Đen: [
          "https://shopdunk.com/images/thumbs/0027837_den_550.jpeg",
          "https://shopdunk.com/images/thumbs/0027837_den_550.jpeg",
          "https://shopdunk.com/images/thumbs/0027839_den_550.jpeg",
        ],
        Trắng: [
          "https://shopdunk.com/images/thumbs/0027829_bac_550.jpeg",
          "https://shopdunk.com/images/thumbs/0027830_bac_550.jpeg",
          "https://shopdunk.com/images/thumbs/0027832_bac_550.jpeg",
        ],
      },
      // Cáp sạc 
      "68b1f3g488g6eg46h8g63fkp": {
        "Mặc định": [
          product.image,
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_i_xu_ng_28__9.png",
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_i_xu_ng_29__2_9.png",
        ],
      },
      // Balo laptop
      "68b1f3g488g6eg46h8g63fkq": {
        "Mặc định": [
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_i_xu_ng_28__9.png",
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_i_xu_ng_28__9.png",
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_i_xu_ng_28__9.png",
        ],
      },
      // Màn hình 
      "68b1f3g488g6eg46h8g63fkr": {
        "Mặc định": [
          "https://nvs.tn-cdn.net/2020/06/Dell-UltraSharp-U2720Q-27-1.jpg",
          "https://nvs.tn-cdn.net/2020/06/Dell-UltraSharp-U2720Q-27-4.jpg",
          "https://nvs.tn-cdn.net/2020/06/Dell-UltraSharp-U2720Q-27-3.jpg",
        ],
      },
    }

    // Xử lý riêng cho Acer Nitro 5 
    if (productName.includes("acer") && productName.includes("nitro")) {
      const acerImages: { [key: string]: string[] } = {
        Đen: [
          product.image, // Ảnh chính
          "https://cdn.tgdd.vn/Products/Images/44/272282/acer-nitro-5-tiger-an515-58-52sp-i5-nhqfhsv001-abc-1-750x500.jpg", 
          "https://cdn.tgdd.vn/Products/Images/44/272282/acer-nitro-5-tiger-an515-58-52sp-i5-nhqfhsv001-abc-4-750x500.jpg", 
        ],
      }
      return acerImages[selectedColor] || acerImages["Đen"]
    }

    // Xử lý riêng cho MacBook
    if (productName.includes("macbook") || productName.includes("apple")) {
      const macbookImages = colorImageMap["68b1f3g488g6eg46h8g63fkl"]
      if (macbookImages && macbookImages[selectedColor]) {
        return macbookImages[selectedColor]
      }
    }

    // Xử lý cho laptop khác 
    if (
      productName.includes("laptop") &&
      !productName.includes("macbook") &&
      !productName.includes("apple") &&
      !productName.includes("acer")
    ) {
      return [
        product.image,
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
      ]
    }

    // Lấy ảnh theo category và màu sắc
    const categoryImages = colorImageMap[product.category_id]
    if (categoryImages && categoryImages[selectedColor]) {
      console.log(`Loading images for color: ${selectedColor}`, categoryImages[selectedColor])
      return categoryImages[selectedColor]
    }

    // Fallback: Sử dụng ảnh mặc định
    const thumbnailMap: { [key: string]: string[] } = {
      "68b1f3g488g6eg46h8g63fkl": [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      "68b1f3g488g6eg46h8g63fkm": [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1967&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      "68b1f3g488g6eg46h8g63fkn": [
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      "68b1f3g488g6eg46h8g63fko": [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      "68b1f3g488g6eg46h8g63fkp": [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1601524909162-ae8725290836?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      "68b1f3g488g6eg46h8g63fkq": [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      "68b1f3g488g6eg46h8g63fkr": [
        "https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
      "68b1f3g488g6eg46h8g63fks": [
        "https://images.unsplash.com/photo-1625480860249-be231d9b90d4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1625480860249-be231d9b90d4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      ],
    }

    const thumbnails = thumbnailMap[product.category_id] || [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3",
    ]

    return [product.image, ...thumbnails]
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

        // Xử lý dữ liệu reviews
        let reviews: Review[] = []
        if (reviewsResponse.data) {
          if (Array.isArray(reviewsResponse.data)) {
            reviews = reviewsResponse.data
          } else if (reviewsResponse.data.data && Array.isArray(reviewsResponse.data.data.reviews)) {
            reviews = reviewsResponse.data.data.reviews
          } else if (Array.isArray(reviewsResponse.data.reviews)) {
            reviews = reviewsResponse.data.reviews
          } else if (reviewsResponse.data.reviews && typeof reviewsResponse.data.reviews === "object") {
            const reviewsObj = reviewsResponse.data.reviews
            if (reviewsObj._id) {
              reviews = [reviewsObj]
            } else {
              reviews = Object.values(reviewsObj).filter(
                (item: any) => item && typeof item === "object" && item._id,
              ) as Review[]
            }
          } else if (reviewsResponse.data._id) {
            reviews = [reviewsResponse.data]
          }
        }

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
        setAllReviews(productReviews)

        const related = products
          .filter((p) => p.category_id === foundProduct.category_id && p._id !== foundProduct._id)
          .slice(0, 4)
        setRelatedProducts(related)

        setError(null)
        setCurrentPrice(foundProduct.salePrice)

        // Tạo mảng ảnh dựa trên sản phẩm và màu sắc mặc định
        const productImages = generateProductImages(foundProduct, selectedColor)
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

    // Đặt màu mặc định phù hợp cho từng loại sản phẩm
    const getAvailableColors = (product: Product): string[] => {
      const productName = product.name.toLowerCase()

      // Laptop Acer Nitro 5 - chỉ có màu đen
      if (productName.includes("acer") && productName.includes("nitro")) {
        return ["Đen"]
      }

      // MacBook - Silver, Space Gray, Starlight
      if (productName.includes("macbook") || productName.includes("apple")) {
        return ["Silver", "Space Gray", "Starlight"]
      }

      // Kiểm tra theo category_id
      const colorMap: { [key: string]: string[] } = {
        "68b1f3g488g6eg46h8g63fkl": ["Silver", "Space Gray", "Starlight"],
        "68b1f3g488g6eg46h8g63fkm": ["Đen", "Trắng", "Hồng"],
        "68b1f3g488g6eg46h8g63fkn": ["Đen", "Trắng"],
        "68b1f3g488g6eg46h8g63fko": ["Đen", "Trắng"],
        "68b1f3g488g6eg46h8g63fkq": ["Mặc định"],
      }

      // Nếu là laptop khác (không phải MacBook)
      if (productName.includes("laptop") && !productName.includes("macbook") && !productName.includes("apple")) {
        return ["Đen"]
      }

      return colorMap[product.category_id] || ["Mặc định"]
    }

    const availableColors = getAvailableColors(product)
    if (!availableColors.includes(selectedColor)) {
      setSelectedColor(availableColors[0])
      return
    }

    // Cập nhật giá dựa trên dung lượng
    let priceAdjustment = 0
    if (selectedStorage === "512GB") {
      priceAdjustment = 2000000
    } else if (selectedStorage === "1TB") {
      priceAdjustment = 5000000
    }
    setCurrentPrice(product.salePrice + priceAdjustment)

    // Cập nhật ảnh dựa trên màu sắc được chọn
    const updatedImages = generateProductImages(product, selectedColor)
    setCurrentImages(updatedImages)

    console.log(`Color changed to: ${selectedColor}`)
    console.log("Updated images:", updatedImages)
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
              selectedColor={selectedColor}
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
