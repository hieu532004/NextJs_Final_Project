'use client';

import { useState, useEffect } from 'react';
import { Tabs, Row, Col, Rate, Form, Input, Button, List, Avatar, Pagination, Progress, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Product, Category, Review } from '@/app/types';

const { TabPane } = Tabs;
const { TextArea } = Input;

interface Router {
  push: (href: string) => void;
}

interface ProductTabsProps {
  product: Product;
  category: Category | null;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  isLoggedIn: boolean;
  router: Router;
}

export default function ProductTabs({
  product,
  category,
  reviews,
  setReviews,
  isLoggedIn,
  router,
}: ProductTabsProps) {
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0]);
  const pageSize = 5;

  const [form] = Form.useForm();

  useEffect(() => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(totalRating / reviews.length);

      const distribution = [0, 0, 0, 0, 0];
      reviews.forEach((review) => {
        const star = Math.round(review.rating);
        if (star >= 1 && star <= 5) {
          distribution[star - 1] += 1;
        }
      });
      setRatingDistribution(distribution.map((count) => (count / reviews.length) * 100));
    }
  }, [reviews]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setDisplayedReviews(reviews.slice(start, end));
  }, [currentPage, reviews]);

  const onFinishReview = async (values: any) => {
    if (!isLoggedIn) {
      message.error('Vui lòng đăng nhập để gửi đánh giá!');
      return;
    }

    try {
      const newReview: Review = {
        _id: Date.now().toString(),
        id: reviews.length + 1,
        product_id: product._id,
        name: values.name || 'Ẩn danh',
        avatar: values.name?.charAt(0) || 'A',
        rating: values.rating || 5,
        comment: values.comment || '',
        created_at: new Date().toISOString(),
        __v: 0,
      };
      await axios.post(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/reviews`, newReview);
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      setDisplayedReviews(updatedReviews.slice(0, pageSize));
      setCurrentPage(1);

      const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(totalRating / updatedReviews.length);
      const distribution = [0, 0, 0, 0, 0];
      updatedReviews.forEach((review) => {
        const star = Math.round(review.rating);
        if (star >= 1 && star <= 5) {
          distribution[star - 1] += 1;
        }
      });
      setRatingDistribution(distribution.map((count) => (count / updatedReviews.length) * 100));

      form.resetFields();
      message.success('Đánh giá của bạn đã được gửi!');
    } catch (error) {
      console.error('Error submitting review:', error);
      message.error('Không thể gửi đánh giá. Vui lòng thử lại.');
    }
  };

  return (
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
            MacBook Air M2 2022 là dòng laptop cao cấp mới nhất của Apple, mang đến hiệu năng vượt trội với chip M2 mạnh mẽ. Thiết kế mỏng nhẹ, sang trọng cùng màn hình Retina 13.6 inch sắc nét, đây là lựa chọn hoàn hảo cho công việc và giải trí.
          </p>
          <div className="mb-2">
            <strong>Tính năng nổi bật:</strong>
            <ul className="list-disc pl-5">
              <li>Chip M2 với CPU 8 nhân và GPU 8 nhân, hiệu năng vượt trội.</li>
              <li>Màn hình Liquid Retina 13.6 inch, độ phân giải 2560 x 1664, hỗ trợ True Tone.</li>
              <li>Thời lượng pin lên đến 18 giờ, sạc nhanh qua cổng MagSafe.</li>
              <li>Hệ thống 4 loa với âm thanh vòm Spatial Audio và Dolby Atmos.</li>
              <li>Thiết kế không quạt, hoạt động êm ái và mát mẻ.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      key: "2",
      label: "Thông số kỹ thuật",
      children: (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <p><strong>Thương hiệu:</strong> {product.brand}</p>
            <p><strong>Danh mục:</strong> {category?.name || 'Không xác định'}</p>
            <p><strong>Chip:</strong> Apple M2 (8-core CPU, 8-core GPU, 16-core Neural Engine)</p>
            <p><strong>RAM:</strong> 8GB (có thể nâng cấp lên 16GB/24GB)</p>
            <p><strong>Bộ nhớ trong:</strong> {product.storage || '256GB'} SSD (có thể nâng cấp lên 512GB/1TB/2TB)</p>
          </Col>
          <Col span={12}>
            <p><strong>Màn hình:</strong> 13.6-inch Liquid Retina, 2560 x 1664, 500 nits, True Tone</p>
            <p><strong>Pin:</strong> Lên đến 18 giờ, sạc qua MagSafe</p>
            <p><strong>Cổng kết nối:</strong> 2 Thunderbolt/USB 4, jack tai nghe 3.5mm, MagSafe 3</p>
            <p><strong>Hệ điều hành:</strong> macOS Ventura (có thể nâng cấp lên phiên bản mới nhất)</p>
            <p><strong>Trọng lượng:</strong> 1.24 kg</p>
          </Col>
        </Row>
      )
    },
    {
      key: "3",
      label: "Đánh giá khách hàng",
      children: (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Thống kê đánh giá</h3>
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <Rate disabled value={averageRating} allowHalf className="text-lg" />
                <span className="ml-2 text-lg font-semibold">{averageRating.toFixed(1)}/5</span>
              </div>
              <div className="text-sm text-gray-600">
                ({reviews.length} đánh giá)
              </div>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center">
                  <span className="w-16 text-sm">{star} sao</span>
                  <Progress percent={ratingDistribution[star - 1]} showInfo={false} className="w-48 mx-2" />
                  <span className="text-sm text-gray-600">
                    {Math.round(ratingDistribution[star - 1])}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Gửi đánh giá của bạn</h3>
            {isLoggedIn ? (
              <Form form={form} onFinish={onFinishReview} layout="vertical">
                <Form.Item
                  name="name"
                  label="Tên của bạn (không bắt buộc)"
                >
                  <Input placeholder="Nhập tên của bạn" />
                </Form.Item>
                <Form.Item
                  name="rating"
                  label="Đánh giá"
                  rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá!' }]}
                >
                  <Rate />
                </Form.Item>
                <Form.Item
                  name="comment"
                  label="Bình luận"
                  rules={[{ required: true, message: 'Vui lòng nhập bình luận!' }]}
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
                <Button
                  type="link"
                  icon={<LoginOutlined />}
                  onClick={() => router.push('/login')}
                  className="p-0"
                >
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
                        {new Date(review.created_at).toLocaleDateString('vi-VN')}
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
            total={reviews.length}
            onChange={(page) => setCurrentPage(page)}
            className="mt-4 text-center"
            showSizeChanger={false}
          />
        </>
      )
    }
  ]}
/>
  );
}