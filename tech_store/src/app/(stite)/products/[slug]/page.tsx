"use client"

import { useEffect, useState, useRef } from "react"
import React from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import {
  Button,
  Card,
  Rate,
  notification,
  Tag,
  Divider,
  Row,
  Col,
  Space,
  Tabs,
  List,
  Avatar,
  Carousel,
  Select,
  Form,
  Input,
  message,
  Pagination,
  Progress,
} from "antd"
import { ShoppingCartOutlined, GiftOutlined, ShareAltOutlined, CarOutlined, LoginOutlined } from "@ant-design/icons"
import Image from "next/image"
import Link from "next/link"
import type { Product, Category, Review } from "@/app/types"
import { useCart } from "@/app/contexts/CartContext"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

interface ProductDetailProps {
  params: Promise<{ slug: string }>
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const { setCartCount } = useCart()
  const router = useRouter()
  const carouselRef = useRef<any>(null)

  const resolvedParams = React.use(params)
  const slug = resolvedParams.slug

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingAddToCart, setLoadingAddToCart] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>("Silver")
  const [selectedStorage, setSelectedStorage] = useState<string>("256GB")
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [averageRating, setAverageRating] = useState<number>(0)
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0]) // [1 sao, 2 sao, 3 sao, 4 sao, 5 sao]
  const pageSize = 5

  // Giả lập trạng thái đăng nhập
  const [isLoggedIn] = useState<boolean>(false) // Thay đổi thành true để kiểm tra trạng thái đăng nhập

  // Form đánh giá
  const [form] = Form.useForm()

  // Hàm tạo ảnh cho từng sản phẩm dựa trên loại sản phẩm
  const generateProductImages = (product: Product) => {
    // Ảnh chính của sản phẩm luôn là ảnh đầu tiên
    const mainImage = product.image || "/placeholder.svg?height=300&width=300"

    // Mảng chứa các ảnh
    const images = [mainImage]

    // Dựa vào category_id để tạo các ảnh phù hợp với loại sản phẩm
    if (product.category_id === "68b1f3g488g6eg46h8g63fkl") {
      // Laptop
      if (product.slug.includes("macbook")) {
        // MacBook
        images.push(
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?fit=crop&w=300&h=200", // Góc bàn phím
          "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?fit=crop&w=300&h=200", // Góc bên
        )
      } else if (product.slug.includes("acer") || product.slug.includes("nitro")) {
        // Acer Nitro
        images.push(
          "https://images.unsplash.com/photo-1605134513573-384dcf99a37c?fit=crop&w=300&h=200", // Góc bàn phím gaming
          "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?fit=crop&w=300&h=200", // Góc màn hình
        )
      } else {
        // Laptop khác
        images.push(
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?fit=crop&w=300&h=200",
          "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?fit=crop&w=300&h=200",
        )
      }
    } else if (product.category_id === "68b1f3g488g6eg46h8g63fkm") {
      // Chuột
      images.push(
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1629429407759-01cd3d5930e5?fit=crop&w=300&h=200",
      )
    } else if (product.category_id === "68b1f3g488g6eg46h8g63fkn") {
      // Bàn phím
      images.push(
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1595225476474-63038da0e238?fit=crop&w=300&h=200",
      )
    } else if (product.category_id === "68b1f3g488g6eg46h8g63fko") {
      // Tai nghe
      images.push(
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?fit=crop&w=300&h=200",
      )
    } else if (product.category_id === "68b1f3g488g6eg46h8g63fkp") {
      // Cáp sạc
      images.push(
        "https://images.unsplash.com/photo-1602526429747-ac387a91d43b?fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1633004584556-164756e69eb0?fit=crop&w=300&h=200",
      )
    } else if (product.category_id === "68b1f3g488g6eg46h8g63fkq") {
      // Balo
      images.push(
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?fit=crop&w=300&h=200",
      )
    } else if (product.category_id === "68b1f3g488g6eg46h8g63fkr") {
      // Màn hình
      images.push(
        "https://images.unsplash.com/photo-1616763355548-1b606f439f86?fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?fit=crop&w=300&h=200",
      )
    } else {
      // Phụ kiện khác
      images.push(
        "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1625723038446-40a8a37c5a2a?fit=crop&w=300&h=200",
      )
    }

    return images
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const [productsResponse, categoriesResponse, reviewsResponse] = await Promise.all([
          axios.get("http://localhost:3001/products"),
          axios.get("http://localhost:3001/categories"),
          axios.get("http://localhost:3001/reviews"),
        ])

        const productsData = productsResponse.data?.data?.products
        const categoriesData = categoriesResponse.data?.data?.categories
        const reviewsData = reviewsResponse.data?.data?.reviews

        if (!Array.isArray(productsData)) {
          throw new Error("Dữ liệu sản phẩm không đúng định dạng.")
        }
        if (!Array.isArray(categoriesData)) {
          throw new Error("Dữ liệu danh mục không đúng định dạng.")
        }
        if (!Array.isArray(reviewsData)) {
          throw new Error("Dữ liệu đánh giá không đúng định dạng.")
        }

        const products: Product[] = productsData
        const categories: Category[] = categoriesData
        const reviews: Review[] = reviewsData

        const foundProduct = products.find((p) => p.slug === slug)
        if (!foundProduct) {
          setError(`Không tìm thấy sản phẩm với slug: "${slug}". Vui lòng kiểm tra lại URL hoặc dữ liệu.`)
          return
        }
        setProduct(foundProduct)

        const foundCategory = categories.find((cat) => cat._id === foundProduct.category_id)
        setCategory(foundCategory || null)

        // Lọc đánh giá theo product_id
        const productReviews = reviews.filter((review) => review.product_id === foundProduct._id)
        setAllReviews(productReviews)

        // Tính toán thống kê đánh giá
        if (productReviews.length > 0) {
          const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
          setAverageRating(totalRating / productReviews.length)

          const distribution = [0, 0, 0, 0, 0]
          productReviews.forEach((review) => {
            const star = Math.round(review.rating)
            if (star >= 1 && star <= 5) {
              distribution[star - 1] += 1
            }
          })
          setRatingDistribution(distribution.map((count) => (count / productReviews.length) * 100))
        }

        // Phân trang đánh giá
        setDisplayedReviews(productReviews.slice(0, pageSize))

        const related = products
          .filter((p) => p.category_id === foundProduct.category_id && p._id !== foundProduct._id)
          .slice(0, 4)
        setRelatedProducts(related)

        setError(null)

        // Khởi tạo giá và hình ảnh ban đầu
        setCurrentPrice(foundProduct.salePrice)

        // Tạo các ảnh thumbnail dựa trên sản phẩm
        const productImages = generateProductImages(foundProduct)
        setCurrentImages(productImages)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau."
        setError(errorMessage)
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  // Logic cập nhật giá và hình ảnh khi thay đổi tùy chọn
  useEffect(() => {
    if (!product) return

    // Cập nhật giá dựa trên dung lượng
    let priceAdjustment = 0
    if (selectedStorage === "512GB") {
      priceAdjustment = 2000000 // Tăng giá 2 triệu cho 512GB
    } else if (selectedStorage === "1TB") {
      priceAdjustment = 5000000 // Tăng giá 5 triệu cho 1TB
    }
    setCurrentPrice(product.salePrice + priceAdjustment)

    // Cập nhật hình ảnh dựa trên sản phẩm và tùy chọn đã chọn
    if (product) {
      const productImages = generateProductImages(product)

      // Nếu có màu sắc khác, thay đổi ảnh chính để phản ánh màu sắc
      if (selectedColor === "Space Gray") {
        productImages[0] = productImages[0].replace("silver", "space-gray")
      } else if (selectedColor === "Starlight") {
        productImages[0] = productImages[0].replace("silver", "starlight")
      }

      setCurrentImages(productImages)
    }
  }, [selectedColor, selectedStorage, product])

  // Cập nhật danh sách đánh giá hiển thị khi thay đổi trang
  useEffect(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    setDisplayedReviews(allReviews.slice(start, end))
  }, [currentPage, allReviews])

  const addToCart = async () => {
    if (!product) return
    setLoadingAddToCart(true)
    try {
      await axios.post("http://localhost:3001/cart", {
        product_id: product._id,
        quantity: 1,
        color: selectedColor,
        storage: selectedStorage,
      })
      const response = await axios.get("http://localhost:3001/cart")
      const cartData = response.data as { items: { quantity: number }[] }
      setCartCount(cartData.items.reduce((total, item) => total + item.quantity, 0))
      notification.success({
        message: "Thêm vào giỏ hàng thành công!",
        description: `${product.name} (${selectedColor}, ${selectedStorage}) đã được thêm vào giỏ hàng.`,
        duration: 2,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng.",
        duration: 2,
      })
    } finally {
      setLoadingAddToCart(false)
    }
  }

  const handleBuyNow = () => {
    addToCart()
    router.push("/cart")
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      message.success("Đã sao chép liên kết sản phẩm!")
    })
  }

  const onFinishReview = async (values: any) => {
    if (!isLoggedIn) {
      message.error("Vui lòng đăng nhập để gửi đánh giá!")
      return
    }

    try {
      const newReview: Review = {
        _id: Date.now().toString(), // Tạo _id tạm thời
        id: allReviews.length + 1, // Tạo id tạm thời
        product_id: product?._id || "",
        name: values.name || "Ẩn danh",
        avatar: values.name?.charAt(0) || "A",
        rating: values.rating || 5,
        comment: values.comment || "",
        created_at: new Date().toISOString(),
        __v: 0,
      }
      await axios.post("http://localhost:3001/reviews", newReview)
      const updatedReviews = [newReview, ...allReviews]
      setAllReviews(updatedReviews)
      setDisplayedReviews(updatedReviews.slice(0, pageSize))
      setCurrentPage(1)

      // Cập nhật thống kê đánh giá
      const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0)
      setAverageRating(totalRating / updatedReviews.length)
      const distribution = [0, 0, 0, 0, 0]
      updatedReviews.forEach((review) => {
        const star = Math.round(review.rating)
        if (star >= 1 && star <= 5) {
          distribution[star - 1] += 1
        }
      })
      setRatingDistribution(distribution.map((count) => (count / updatedReviews.length) * 100))

      form.resetFields()
      message.success("Đánh giá của bạn đã được gửi!")
    } catch (error) {
      console.error("Error submitting review:", error)
      message.error("Không thể gửi đánh giá. Vui lòng thử lại.")
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4">Đang tải...</div>
  }

  if (error || !product) {
    return <div className="container mx-auto p-4 text-red-500">{error || "Không tìm thấy sản phẩm."}</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header searchValue="" setSearchValue={() => {}} toggleMobileMenu={() => {}} />

      {/* Nội dung chính */}
      <main className="flex-grow container mx-auto p-4">
        <div className="mb-4 text-sm">
          <Link href="/">Trang chủ</Link> / <Link href="/products">Sản phẩm</Link> / {product.name}
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Card className="border-none shadow-sm">
              <Carousel ref={carouselRef} autoplay>
                {currentImages.map((img, index) => (
                  <div key={index} className="relative h-96">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      style={{ objectFit: "contain" }}
                      className="p-4"
                    />
                  </div>
                ))}
              </Carousel>
              {/* Hình thu nhỏ */}
              <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
                {currentImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative min-w-[64px] w-16 h-16 cursor-pointer border rounded overflow-hidden hover:border-blue-500 transition-colors"
                    onClick={() => carouselRef.current?.goTo(index)}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>
              {product.discount > 0 && (
                <Tag color="red" className="absolute top-2 left-2">
                  -{product.discount}%
                </Tag>
              )}
              {product.isNew && (
                <Tag color="green" className="absolute top-2 right-2">
                  Mới
                </Tag>
              )}
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-2">
              <Rate disabled value={product.rating} allowHalf className="text-sm mr-2" />
              <span className="text-sm text-gray-500">({allReviews.length} đánh giá)</span>
            </div>
            <div className="text-lg font-bold text-red-600 mb-2">{currentPrice.toLocaleString("vi-VN")}đ</div>
            {currentPrice < product.price && (
              <div className="text-sm text-gray-400 line-through mb-2">{product.price.toLocaleString("vi-VN")}đ</div>
            )}
            <div className="text-sm text-gray-600 mb-2">
              Thương hiệu: <span className="font-semibold">{product.brand}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Danh mục: <span className="font-semibold">{category?.name || "Không xác định"}</span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Tình trạng:{" "}
              <span className="font-semibold">{product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}</span>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                Màu sắc:
                <Select
                  value={selectedColor}
                  onChange={(value) => setSelectedColor(value)}
                  style={{ width: 120, marginLeft: 8 }}
                >
                  <Option value="Silver">Silver</Option>
                  <Option value="Space Gray">Space Gray</Option>
                  <Option value="Starlight">Starlight</Option>
                </Select>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Dung lượng:
                <Select
                  value={selectedStorage}
                  onChange={(value) => setSelectedStorage(value)}
                  style={{ width: 120, marginLeft: 8 }}
                >
                  <Option value="256GB">256GB</Option>
                  <Option value="512GB">512GB</Option>
                  <Option value="1TB">1TB</Option>
                </Select>
              </div>
            </div>

            <Space size="middle" className="mb-4">
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                onClick={addToCart}
                loading={loadingAddToCart}
                disabled={product.stock === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Mua ngay
              </Button>
              <Button icon={<ShareAltOutlined />} size="large" onClick={handleShare}>
                Chia sẻ
              </Button>
            </Space>

            {/* Thông tin giao hàng */}
            <Card className="border shadow-sm mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <CarOutlined className="mr-2" />
                <span>Giao hàng: Dự kiến giao hàng trong 2-3 ngày. Phí vận chuyển: 30.000đ</span>
              </div>
            </Card>

            <Card className="border shadow-sm mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">🛡️</span>
                Bảo hành chính hãng 1 năm tại các trung tâm bảo hành
              </div>
            </Card>

            <Card className="border shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <GiftOutlined className="mr-2 text-red-500" />
                Khuyến mãi
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                <li className="mb-1">Phiếu mua hàng mệnh giá 300.000đ</li>
                <li className="mb-1">Hỗ trợ trả góp 0% qua thẻ tín dụng</li>
                <li className="mb-1">Nhập mã VNPAY giảm thêm 80.000đ (áp dụng thanh toán VNPAY-QR)</li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Tabs defaultActiveKey="1" className="mb-4">
          <TabPane tab="Mô tả sản phẩm" key="1">
            <div className="text-gray-700">
              <p className="mb-2">
                MacBook Air M2 2022 là dòng laptop cao cấp mới nhất của Apple, mang đến hiệu năng vượt trội với chip M2
                mạnh mẽ. Thiết kế mỏng nhẹ, sang trọng cùng màn hình Retina 13.6 inch sắc nét, đây là lựa chọn hoàn hảo
                cho công việc và giải trí.
              </p>
              <p className="mb-2">
                <strong>Tính năng nổi bật:</strong>
                <ul className="list-disc pl-5">
                  <li>Chip M2 với CPU 8 nhân và GPU 8 nhân, hiệu năng vượt trội.</li>
                  <li>Màn hình Liquid Retina 13.6 inch, độ phân giải 2560 x 1664, hỗ trợ True Tone.</li>
                  <li>Thời lượng pin lên đến 18 giờ, sạc nhanh qua cổng MagSafe.</li>
                  <li>Hệ thống 4 loa với âm thanh vòm Spatial Audio và Dolby Atmos.</li>
                  <li>Thiết kế không quạt, hoạt động êm ái và mát mẻ.</li>
                </ul>
              </p>
            </div>
          </TabPane>
          <TabPane tab="Thông số kỹ thuật" key="2">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p>
                  <strong>Thương hiệu:</strong> {product.brand}
                </p>
                <p>
                  <strong>Danh mục:</strong> {category?.name || "Không xác định"}
                </p>
                <p>
                  <strong>Chip:</strong> Apple M2 (8-core CPU, 8-core GPU, 16-core Neural Engine)
                </p>
                <p>
                  <strong>RAM:</strong> 8GB (có thể nâng cấp lên 16GB/24GB)
                </p>
                <p>
                  <strong>Bộ nhớ trong:</strong> {selectedStorage} SSD (có thể nâng cấp lên 512GB/1TB/2TB)
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>Màn hình:</strong> 13.6-inch Liquid Retina, 2560 x 1664, 500 nits, True Tone
                </p>
                <p>
                  <strong>Pin:</strong> Lên đến 18 giờ, sạc qua MagSafe
                </p>
                <p>
                  <strong>Cổng kết nối:</strong> 2 Thunderbolt/USB 4, jack tai nghe 3.5mm, MagSafe 3
                </p>
                <p>
                  <strong>Hệ điều hành:</strong> macOS Ventura (có thể nâng cấp lên phiên bản mới nhất)
                </p>
                <p>
                  <strong>Trọng lượng:</strong> 1.24 kg
                </p>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Đánh giá khách hàng" key="3">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Thống kê đánh giá</h3>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <Rate disabled value={averageRating} allowHalf className="text-lg" />
                  <span className="ml-2 text-lg font-semibold">{averageRating.toFixed(1)}/5</span>
                </div>
                <div className="text-sm text-gray-600">({allReviews.length} đánh giá)</div>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center">
                    <span className="w-16 text-sm">{star} sao</span>
                    <Progress percent={ratingDistribution[star - 1]} showInfo={false} className="w-48 mx-2" />
                    <span className="text-sm text-gray-600">{Math.round(ratingDistribution[star - 1])}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Gửi đánh giá của bạn</h3>
              {isLoggedIn ? (
                <Form form={form} onFinish={onFinishReview} layout="vertical">
                  <Form.Item name="name" label="Tên của bạn (không bắt buộc)">
                    <Input placeholder="Nhập tên của bạn" />
                  </Form.Item>
                  <Form.Item
                    name="rating"
                    label="Đánh giá"
                    rules={[{ required: true, message: "Vui lòng chọn số sao đánh giá!" }]}
                  >
                    <Rate />
                  </Form.Item>
                  <Form.Item
                    name="comment"
                    label="Bình luận"
                    rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
                  >
                    <TextArea rows={4} placeholder="Nhập bình luận của bạn" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Gửi đánh giá
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <div className="text-gray-600">
                  <p>Vui lòng đăng nhập để gửi đánh giá.</p>
                  <Button type="link" icon={<LoginOutlined />} onClick={() => router.push("/login")} className="p-0">
                    Đăng nhập ngay
                  </Button>
                </div>
              )}
            </div>

            <List
              itemLayout="horizontal"
              dataSource={displayedReviews}
              renderItem={(review) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{review.avatar}</Avatar>}
                    title={
                      <div>
                        {review.name} <Rate disabled value={review.rating} allowHalf className="text-sm ml-2" />
                      </div>
                    }
                    description={
                      <div>
                        <p>{review.comment}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(review.created_at).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={allReviews.length}
              onChange={(page) => setCurrentPage(page)}
              className="mt-4 text-center"
              showSizeChanger={false}
            />
          </TabPane>
        </Tabs>

        <Divider />
        <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
        <Row gutter={[16, 16]}>
          {relatedProducts.map((relatedProduct) => (
            <Col xs={24} sm={12} md={6} key={relatedProduct._id}>
              <Link href={`/products/${relatedProduct.slug}`}>
                <Card
                  hoverable
                  cover={
                    <div className="relative h-40">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        style={{ objectFit: "contain" }}
                        className="p-2"
                      />
                    </div>
                  }
                >
                  <Card.Meta
                    title={relatedProduct.name}
                    description={
                      <div>
                        <p className="text-red-600 font-bold">{relatedProduct.salePrice.toLocaleString("vi-VN")}đ</p>
                        {relatedProduct.salePrice < relatedProduct.price && (
                          <p className="text-gray-400 line-through text-sm">
                            {relatedProduct.price.toLocaleString("vi-VN")}đ
                          </p>
                        )}
                        <Rate disabled value={relatedProduct.rating} allowHalf className="text-sm" />
                      </div>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        <Divider />
        <Card className="border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Ưu đãi thanh toán Online</h2>
          <p className="text-sm text-gray-600">Giảm thêm 50.000đ khi thanh toán qua VNPAY hoặc Momo.</p>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
