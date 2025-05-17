// src/app/(site)/products/[slug]/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import React from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Spin,
  Skeleton,
} from 'antd';
import {
  ShoppingCartOutlined,
  GiftOutlined,
  StarOutlined,
  ShareAltOutlined,
  CarOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Category, Review } from '@/app/types';
import { useCart } from '@/app/contexts/CartContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

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
          {/* Image Carousel Skeleton */}
          <Col xs={24} md={10}>
            <Card className="border-none shadow-sm">
              <Skeleton.Image style={{ width: '100%', height: 384 }} />
              <div className="flex justify-center mt-4 space-x-2">
                {Array(3).fill(0).map((_, index) => (
                  <Skeleton.Image key={index} style={{ width: 64, height: 64 }} />
                ))}
              </div>
            </Card>
          </Col>

          {/* Product Info Skeleton */}
          <Col xs={24} md={14}>
            <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 2 }} />
            <Skeleton active title={false} paragraph={{ rows: 1, width: ['40%'] }} />
            <Skeleton active title={false} paragraph={{ rows: 3, width: ['30%', '20%', '25%'] }} />

            {/* Options Skeleton */}
            <div className="mb-4">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Skeleton.Input active style={{ width: 120 }} size="default" />
                <Skeleton.Input active style={{ width: 120 }} size="default" />
              </Space>
            </div>

            {/* Buttons Skeleton */}
            <Space size="middle" className="mb-4">
              <Skeleton.Button active size="large" style={{ width: 160 }} />
              <Skeleton.Button active size="large" style={{ width: 120 }} />
              <Skeleton.Button active size="large" style={{ width: 100 }} />
            </Space>

            {/* Shipping & Warranty Skeleton */}
            <Card className="border shadow-sm mb-4">
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            </Card>
            <Card className="border shadow-sm mb-4">
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            </Card>
            <Card className="border shadow-sm">
              <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 3, width: ['80%', '60%', '70%'] }} />
            </Card>
          </Col>
        </Row>

        {/* Tabs Skeleton */}
        <div className="my-4">
          <Skeleton active title={{ width: '20%' }} paragraph={{ rows: 0 }} />
          <Skeleton active paragraph={{ rows: 5 }} title={false} />
        </div>

        {/* Related Products Skeleton */}
        <div className="my-4">
          <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 0 }} />
          <Row gutter={[16, 16]} className="mt-4">
            {Array(4).fill(0).map((_, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="border shadow-sm">
                  <Skeleton.Image style={{ width: '100%', height: 160 }} />
                  <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 2, width: ['60%', '40%'] }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Payment Offer Skeleton */}
        <Card className="border shadow-sm">
          <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 1 }} />
        </Card>
      </main>

      {/* Footer Skeleton */}
      <div className="border-t">
        <div className="container mx-auto p-4">
          <Skeleton active paragraph={{ rows: 3 }} title={false} />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const { setCartCount } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const carouselRef = useRef<any>(null);

  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  const selectedCategory = searchParams.get('category');

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('Silver');
  const [selectedStorage, setSelectedStorage] = useState<string>('256GB');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0]);
  const pageSize = 5;

  const [isLoggedIn] = useState<boolean>(false);

  const [form] = Form.useForm();

  // Fetch thông tin sản phẩm chi tiết
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse, reviewsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`),
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/categories`),
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/reviews`),
        ]);

        const productsData = productsResponse.data?.data?.products;
        const categoriesData = categoriesResponse.data?.data?.categories;
        const reviewsData = reviewsResponse.data?.data?.reviews;

        if (!Array.isArray(productsData)) {
          throw new Error('Dữ liệu sản phẩm không đúng định dạng.');
        }
        if (!Array.isArray(categoriesData)) {
          throw new Error('Dữ liệu danh mục không đúng định dạng.');
        }
        if (!Array.isArray(reviewsData)) {
          throw new Error('Dữ liệu đánh giá không đúng định dạng.');
        }

        const products: Product[] = productsData;
        const categories: Category[] = categoriesData;
        const reviews: Review[] = reviewsData;

        const foundProduct = products.find((p) => p.slug === slug);
        if (!foundProduct) {
          setError(`Không tìm thấy sản phẩm với slug: "${slug}". Vui lòng kiểm tra lại URL hoặc dữ liệu.`);
          return;
        }
        setProduct(foundProduct);

        const foundCategory = categories.find((cat) => cat._id === foundProduct.category_id);
        setCategory(foundCategory || null);

        const productReviews = reviews.filter((review) => review.product_id === foundProduct._id);
        setAllReviews(productReviews);

        if (productReviews.length > 0) {
          const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(totalRating / productReviews.length);

          const distribution = [0, 0, 0, 0, 0];
          productReviews.forEach((review) => {
            const star = Math.round(review.rating);
            if (star >= 1 && star <= 5) {
              distribution[star - 1] += 1;
            }
          });
          setRatingDistribution(distribution.map((count) => (count / productReviews.length) * 100));
        }

        setDisplayedReviews(productReviews.slice(0, pageSize));

        const related = products.filter(
          (p) => p.category_id === foundProduct.category_id && p._id !== foundProduct._id
        ).slice(0, 4);
        setRelatedProducts(related);

        setError(null);

        setCurrentPrice(foundProduct.salePrice);
        setCurrentImages([
          foundProduct.image,
          `https://readdy.ai/api/search-image?query=MacBook%20Air%20M2%202022%20side%20view%2C%20silver%2C%20clean%20white%20background%2C%20professional%20photography&width=300&height=200&seq=1&orientation=landscape`,
          `https://readdy.ai/api/search-image?query=MacBook%20Air%20M2%202022%20keyboard%20view%2C%20silver%2C%20clean%20white%20background%2C%20professional%20photography&width=300&height=200&seq=2&orientation=landscape`,
        ]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.';
        setError(errorMessage);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Fetch sản phẩm theo danh mục
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!selectedCategory) {
        setCategoryProducts([]);
        return;
      }

      setLoadingCategory(true);
      try {
        const response = await axios.get('${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products');
        const products = response.data.data.products;

        const categoryMap: { [key: string]: string[] } = {
          'laptop-gaming': ['Gaming'],
          'laptop-office': ['Văn Phòng'],
          'laptop-design': ['Đồ Họa'],
          'macbook': ['MacBook'],
          'mouse': ['Chuột'],
          'keyboard': ['Bàn phím'],
          'headphones': ['Tai nghe'],
          'backpack': ['Balo'],
          'monitor': ['Màn hình'],
          'printer': ['Máy in'],
          'scanner': ['Máy scan'],
          'projector': ['Máy chiếu'],
        };

        const categoryKeywords = categoryMap[selectedCategory] || [];
        const filteredProducts = products.filter((product: Product) =>
          categoryKeywords.some((keyword) => product.name.includes(keyword))
        );
        setCategoryProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory]);

  // Cập nhật giá và hình ảnh
  useEffect(() => {
    if (!product) return;

    let priceAdjustment = 0;
    if (selectedStorage === '512GB') {
      priceAdjustment = 2000000;
    } else if (selectedStorage === '1TB') {
      priceAdjustment = 5000000;
    }
    setCurrentPrice(product.salePrice + priceAdjustment);

    const colorLower = selectedColor.toLowerCase();
    setCurrentImages([
      product.image.replace('silver', colorLower),
      `https://readdy.ai/api/search-image?query=MacBook%20Air%20M2%202022%20side%20view%2C%20${colorLower}%2C%20clean%20white%20background%2C%20professional%20photography&width=300&height=200&seq=1&orientation=landscape`,
      `https://readdy.ai/api/search-image?query=MacBook%20Air%20M2%202022%20keyboard%20view%2C%20${colorLower}%2C%20clean%20white%20background%2C%20professional%20photography&width=300&height=200&seq=2&orientation=landscape`,
    ]);
  }, [selectedColor, selectedStorage, product]);

  // Cập nhật danh sách đánh giá
  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setDisplayedReviews(allReviews.slice(start, end));
  }, [currentPage, allReviews]);

  const { addToCart } = useCart(); // Lấy hàm addToCart từ CartContext

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: product.image,
    });
  };

  const handleBuyNow = () => {
    router.push('/cart');
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      message.success('Đã sao chép liên kết sản phẩm!');
    });
  };
// Thêm vào giỏ hàng
  
  const onFinishReview = async (values: any) => {
    if (!isLoggedIn) {
      message.error('Vui lòng đăng nhập để gửi đánh giá!');
      return;
    }

    try {
      const newReview: Review = {
        _id: Date.now().toString(),
        id: allReviews.length + 1,
        product_id: product?._id || '',
        name: values.name || 'Ẩn danh',
        avatar: values.name?.charAt(0) || 'A',
        rating: values.rating || 5,
        comment: values.comment || '',
        created_at: new Date().toISOString(),
        __v: 0,
      };
      await axios.post('${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/reviews', newReview);
      const updatedReviews = [newReview, ...allReviews];
      setAllReviews(updatedReviews);
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

  // Hiển thị skeleton khi đang tải
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <div className="container mx-auto p-4 text-red-500">{error || 'Không tìm thấy sản phẩm.'}</div>;
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
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="p-4"
                    />
                  </div>
                ))}
              </Carousel>
              <div className="flex justify-center mt-4 space-x-2">
                {currentImages.map((img, index) => (
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
            <div className="text-lg font-bold text-red-600 mb-2">
              {currentPrice.toLocaleString('vi-VN')}đ
            </div>
            {currentPrice < product.price && (
              <div className="text-sm text-gray-400 line-through mb-2">
                {product.price.toLocaleString('vi-VN')}đ
              </div>
            )}
            <div className="text-sm text-gray-600 mb-2">
              Thương hiệu: <span className="font-semibold">{product.brand}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Danh mục: <span className="font-semibold">{category?.name || 'Không xác định'}</span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Tình trạng:{' '}
              <span className="font-semibold">{product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}</span>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                Màu sắc:
                <Select value={selectedColor} onChange={(value) => setSelectedColor(value)} style={{ width: 120, marginLeft: 8 }}>
                  <Option value="Silver">Silver</Option>
                  <Option value="Space Gray">Space Gray</Option>
                  <Option value="Starlight">Starlight</Option>
                </Select>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Dung lượng:
                <Select value={selectedStorage} onChange={(value) => setSelectedStorage(value)} style={{ width: 120, marginLeft: 8 }}>
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
                onClick={() => handleAddToCart(product)}
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
                MacBook Air M2 2022 là dòng laptop cao cấp mới nhất của Apple, mang đến hiệu năng vượt trội với chip M2 mạnh mẽ. Thiết kế mỏng nhẹ, sang trọng cùng màn hình Retina 13.6 inch sắc nét, đây là lựa chọn hoàn hảo cho công việc và giải trí.
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
                <p><strong>Thương hiệu:</strong> {product.brand}</p>
                <p><strong>Danh mục:</strong> {category?.name || 'Không xác định'}</p>
                <p><strong>Chip:</strong> Apple M2 (8-core CPU, 8-core GPU, 16-core Neural Engine)</p>
                <p><strong>RAM:</strong> 8GB (có thể nâng cấp lên 16GB/24GB)</p>
                <p><strong>Bộ nhớ trong:</strong> {selectedStorage} SSD (có thể nâng cấp lên 512GB/1TB/2TB)</p>
              </Col>
              <Col span={12}>
                <p><strong>Màn hình:</strong> 13.6-inch Liquid Retina, 2560 x 1664, 500 nits, True Tone</p>
                <p><strong>Pin:</strong> Lên đến 18 giờ, sạc qua MagSafe</p>
                <p><strong>Cổng kết nối:</strong> 2 Thunderbolt/USB 4, jack tai nghe 3.5mm, MagSafe 3</p>
                <p><strong>Hệ điều hành:</strong> macOS Ventura (có thể nâng cấp lên phiên bản mới nhất)</p>
                <p><strong>Trọng lượng:</strong> 1.24 kg</p>
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
                <div className="text-sm text-gray-600">
                  ({allReviews.length} đánh giá)
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
              total={allReviews.length}
              onChange={(page) => setCurrentPage(page)}
              className="mt-4 text-center"
              showSizeChanger={false}
            />
          </TabPane>
        </Tabs>

        <Divider />

        {selectedCategory && (
          <>
            <h2 className="text-xl font-bold mb-4">
              Sản phẩm theo danh mục: {selectedCategory.replace(/-/g, ' ')}
            </h2>
            {loadingCategory ? (
              <Spin />
            ) : categoryProducts.length > 0 ? (
              <Row gutter={[16, 16]}>
                {categoryProducts.map((catProduct) => (
                  <Col xs={24} sm={12} md={6} key={catProduct._id}>
                    <Link href={`/products/${catProduct.slug}`}>
                      <Card
                        hoverable
                        cover={
                          <div className="relative h-40">
                            <Image
                              src={catProduct.image}
                              alt={catProduct.name}
                              fill
                              style={{ objectFit: 'contain' }}
                              className="p-2"
                            />
                          </div>
                        }
                      >
                        <Card.Meta
                          title={catProduct.name}
                          description={
                            <div>
                              <p className="text-red-600 font-bold">
                                {catProduct.salePrice.toLocaleString('vi-VN')}đ
                              </p>
                              {catProduct.salePrice < catProduct.price && (
                                <p className="text-gray-400 line-through text-sm">
                                  {catProduct.price.toLocaleString('vi-VN')}đ
                                </p>
                              )}
                              <Rate disabled value={catProduct.rating} allowHalf className="text-sm" />
                            </div>
                          }
                        />
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="text-gray-500">Không có sản phẩm nào trong danh mục này.</p>
            )}
            <Divider />
          </>
        )}

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
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="p-2"
                      />
                    </div>
                  }
                >
                  <Card.Meta
                    title={relatedProduct.name}
                    description={
                      <div>
                        <p className="text-red-600 font-bold">
                          {relatedProduct.salePrice.toLocaleString('vi-VN')}đ
                        </p>
                        {relatedProduct.salePrice < relatedProduct.price && (
                          <p className="text-gray-400 line-through text-sm">
                            {relatedProduct.price.toLocaleString('vi-VN')}đ
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
          <p className="text-sm text-gray-600">
            Giảm thêm 50.000đ khi thanh toán qua VNPAY hoặc Momo.
          </p>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}