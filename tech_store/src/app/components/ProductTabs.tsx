"use client"

import { useState, useEffect } from "react"
import { Tabs, Row, Col, Rate, Form, Input, Button, List, Avatar, Pagination, Progress, message } from "antd"
import { LoginOutlined } from "@ant-design/icons"
import axios from "axios"
import type { Product, Category, Review } from "@/app/types"
import { useAuth } from "@/app/contexts/authContext"
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"

const { TextArea } = Input

interface Router {
  push: (href: string) => void
}

interface ProductTabsProps {
  product: Product
  category: Category | null
  reviews: Review[]
  setReviews: (reviews: Review[]) => void
  isLoggedIn: boolean
  router: Router
}

export default function ProductTabs({ product, category, reviews, setReviews }: ProductTabsProps) {
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [averageRating, setAverageRating] = useState<number>(0)
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const pageSize = 5

  const [form] = Form.useForm()
  const { user } = useAuth()
  const userLoggedIn = !!user

  // Cập nhật thống kê đánh giá
  useEffect(() => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      setAverageRating(totalRating / reviews.length)

      const distribution = [0, 0, 0, 0, 0]
      reviews.forEach((review) => {
        const star = Math.round(review.rating)
        if (star >= 1 && star <= 5) {
          distribution[star - 1] += 1
        }
      })
      setRatingDistribution(distribution.map((count) => (count / reviews.length) * 100))
    }
  }, [reviews])

  // Phân trang đánh giá
  useEffect(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    setDisplayedReviews(reviews.slice(start, end))
  }, [currentPage, reviews])

  // Gửi đánh giá
  const onFinishReview = async (values: any) => {
    if (!userLoggedIn) {
      message.error("Vui lòng đăng nhập để gửi đánh giá!")
      setShowLoginModal(true)
      return
    }

    try {
      const newReview: Review = {
        _id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        id: Date.now(),
        product_id: product._id,
        name: values.name || user?.name || "Ẩn danh",
        avatar: (values.name || user?.name)?.charAt(0) || "A",
        rating: values.rating || 5,
        comment: values.comment || "",
        created_at: new Date().toISOString(),
        __v: 0,
      }

      // Gửi đánh giá lên server
      await axios.post(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/reviews`, newReview)

      // Cập nhật state local
      const updatedReviews = [newReview, ...reviews]
      setReviews(updatedReviews)
      setCurrentPage(1)

      form.resetFields()
      message.success("Đánh giá của bạn đã được gửi thành công!")
    } catch (error) {
      console.error("Error submitting review:", error)
      message.error("Không thể gửi đánh giá. Vui lòng thử lại!")
    }
  }

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        className="mb-4"
        items={[
          {
            key: "1",
            label: "Mô tả sản phẩm",
            children: (
              <div className="text-gray-700">
                <p className="mb-2">
                  {product.name} là sản phẩm chất lượng cao với thiết kế hiện đại và tính năng vượt trội.
                </p>
                <div className="mb-2">
                  <strong>Tính năng nổi bật:</strong>
                  <ul className="list-disc pl-5">
                    <li>Thiết kế hiện đại, sang trọng</li>
                    <li>Hiệu suất cao, ổn định</li>
                    <li>Chất lượng vượt trội</li>
                    <li>Bảo hành chính hãng</li>
                    <li>Hỗ trợ khách hàng 24/7</li>
                  </ul>
                </div>
              </div>
            ),
          },
          {
            key: "2",
            label: "Thông số kỹ thuật",
            children: (
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <p>
                    <strong>Thương hiệu:</strong> {product.brand}
                  </p>
                  <p>
                    <strong>Danh mục:</strong> {category?.name || "Không xác định"}
                  </p>
                  <p>
                    <strong>Tình trạng:</strong> {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>Giá gốc:</strong> {product.price.toLocaleString("vi-VN")}đ
                  </p>
                  <p>
                    <strong>Giá khuyến mãi:</strong> {product.salePrice.toLocaleString("vi-VN")}đ
                  </p>
                  <p>
                    <strong>Đánh giá:</strong> {product.rating}/5 sao
                  </p>
                </Col>
              </Row>
            ),
          },
          {
            key: "3",
            label: "Đánh giá khách hàng",
            children: (
              <>
                {/* Thống kê đánh giá */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Thống kê đánh giá</h3>
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <Rate disabled value={averageRating} allowHalf className="text-lg" />
                      <span className="ml-2 text-lg font-semibold">{averageRating.toFixed(1)}/5</span>
                    </div>
                    <div className="text-sm text-gray-600">({reviews.length} đánh giá)</div>
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

                {/* Form gửi đánh giá */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Gửi đánh giá của bạn</h3>
                  {userLoggedIn ? (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <p className="text-green-700 mb-2">
                        <strong>Xin chào {user?.name}!</strong> Bạn có thể gửi đánh giá cho sản phẩm này.
                      </p>
                      <Form form={form} onFinish={onFinishReview} layout="vertical">
                        <Form.Item name="name" label="Tên hiển thị" initialValue={user?.name}>
                          <Input placeholder="Nhập tên hiển thị" />
                        </Form.Item>
                        <Form.Item
                          name="rating"
                          label="Đánh giá"
                          rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
                        >
                          <Rate />
                        </Form.Item>
                        <Form.Item
                          name="comment"
                          label="Bình luận"
                          rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
                        >
                          <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn..." />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
                            Gửi đánh giá
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center">
                      <p className="mb-3 text-gray-600">Vui lòng đăng nhập để gửi đánh giá sản phẩm.</p>
                      <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        onClick={() => setShowLoginModal(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Đăng nhập để đánh giá
                      </Button>
                    </div>
                  )}
                </div>

                {/* Danh sách đánh giá */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Đánh giá từ khách hàng</h3>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                      <p>Hãy là người đầu tiên đánh giá!</p>
                    </div>
                  ) : (
                    <>
                      <List
                        itemLayout="horizontal"
                        dataSource={displayedReviews}
                        renderItem={(review) => (
                          <List.Item className="border-b border-gray-100 last:border-b-0">
                            <List.Item.Meta
                              avatar={<Avatar className="bg-blue-500">{review.avatar}</Avatar>}
                              title={
                                <div className="flex items-center">
                                  <span className="font-medium">{review.name}</span>
                                  <Rate disabled value={review.rating} allowHalf className="text-sm ml-2" />
                                </div>
                              }
                              description={
                                <div>
                                  <p className="text-gray-700 mb-2">{review.comment}</p>
                                  <p className="text-gray-500 text-sm">
                                    {new Date(review.created_at).toLocaleDateString("vi-VN", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                      {reviews.length > pageSize && (
                        <Pagination
                          current={currentPage}
                          pageSize={pageSize}
                          total={reviews.length}
                          onChange={setCurrentPage}
                          className="mt-4 text-center"
                          showSizeChanger={false}
                          showQuickJumper
                          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} đánh giá`}
                        />
                      )}
                    </>
                  )}
                </div>
              </>
            ),
          },
        ]}
      />

      {/* Modals */}
      <LoginModal
        isVisible={showLoginModal}
        onCancel={() => setShowLoginModal(false)}
        onShowRegister={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />

      <RegisterModal
        isVisible={showRegisterModal}
        onCancel={() => setShowRegisterModal(false)}
        onRegisterSuccess={() => setShowRegisterModal(false)}
        onShowLogin={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </>
  )
}
