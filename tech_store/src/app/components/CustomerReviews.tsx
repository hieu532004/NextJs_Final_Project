'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Rate } from 'antd';
import { Review } from '@/app/types';
import 'swiper/css';
import 'swiper/css/pagination';

interface CustomerReviewsProps {
  reviews: Review[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Khách hàng nói gì về chúng tôi</h2>
      <div className="bg-white rounded-lg shadow-sm p-8">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Pagination, Autoplay]}
          className="customer-reviews-swiper"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review._id}>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-4">
                  <Rate disabled defaultValue={review.rating} />
                </div>
                <p className="text-gray-600 mb-4">"{review.comment}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">{review.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{review.name}</h4>
                    <p className="text-sm text-gray-500">Khách hàng</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CustomerReviews;