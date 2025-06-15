
"use client"
import React, { useState, useEffect } from 'react';
import { Button, Divider, Modal, Steps } from 'antd';
import { CheckCircleFilled, HomeOutlined, ShoppingOutlined, UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Order } from '@/app/types';
import '@ant-design/v5-patch-for-react-19';
import Header from './Header';
const { Step } = Steps;

const PaymentSuccess: React.FC = () => {
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderIdFromQuery = searchParams.get('orderId');
    if (orderIdFromQuery) {
      setOrderId(orderIdFromQuery);
    } else {
      console.error("Không tìm thấy orderId trên URL.");
      setError("Không tìm thấy mã đơn hàng.");
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (orderId) {
      console.log("Fetching order with ID:", orderId);
      setLoading(true);
      setError(null);
      fetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/orders/${orderId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setOrderData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch order details:", error);
          setError("Không thể tải thông tin đơn hàng.");
          setLoading(false);
        });
    }
  }, [orderId]);

  const showTrackingModal = () => {
    setIsTrackingModalOpen(true);
  };

  const handleTrackingModalClose = () => {
    setIsTrackingModalOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Đang tải thông tin đơn hàng...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;
  }

  if (!orderData) {
    return <div className="flex justify-center items-center h-full">Không tìm thấy thông tin đơn hàng.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header searchValue="" setSearchValue={() => { }} />

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <CheckCircleFilled className="text-6xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Thanh toán thành công</h2>
            <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua hàng tại TechStore</p>
            <p className="text-gray-600 mt-1">Mã đơn hàng: <span className="font-semibold">#{orderData.id}</span></p>
          </div>

          <Divider className="my-6" />

          {/* Order Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h3>
            <div className="space-y-4">
              {orderData.orderItems && orderData.orderItems.map((item: any) => (
                <div key={item.productId} className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
                    <Image
                      src={item.imageUrl || `https://via.placeholder.com/100x100?text=Product+${item.productId}`} // Sử dụng item.imageUrl, fallback nếu không có
                      alt={`Sản phẩm ${item.productId}`}
                      width={100}
                      height={100}
                      className="object-cover object-top w-full h-full"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="font-medium"> {item.name}</h4> {/* Bạn có thể cần tên sản phẩm từ API */}
                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{parseFloat(item.pricePerUnit).toLocaleString('vi-VN')} VND</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 ">Tổng tiền hàng:</span>
                <span>
                  {(orderData.totalAmount + orderData.discountAmount).toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Giảm giá:</span>
                <span>{orderData.discountAmount.toLocaleString('vi-VN')} VND</span>
              </div>
              <Divider className="my-3" />
              <div className="flex justify-between font-bold">
                <span>Tổng thanh toán:</span>
                <span className="text-red-600 text-lg sm:text-xl md:text-2xl font-semibold ">
                  {orderData.totalAmount.toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className="text-right text-xs text-gray-500">(Đã bao gồm VAT)</div>
            </div>
          </div>

          <Divider className="my-6" />

          {/* Shipping Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Họ tên:</p>
                <p className="font-medium">{orderData.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Số điện thoại:</p>
                <p className="font-medium">{orderData.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1 ">Email:</p>
                <p className="font-medium  break-words whitespace-normal max-w-[250px] sm:max-w-none">{orderData.email}</p>
              </div>

              {orderData.userfullname && ( // Kiểm tra nếu userId tồn tại
                <div>
                  <p className="text-gray-600 mb-1">Tên khách hàng:</p>
                  <p className="font-medium">{orderData.userfullname}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-gray-600 mb-1">Địa chỉ giao hàng:</p>
                <p className="font-medium">
                  {orderData.detailAddress}, {orderData.commune_name}, {orderData.district_name}, {orderData.city_name}
                </p>
              </div>
            </div>
          </div>

          <Divider className="my-6" />

          {/* Payment Method */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg w-fit">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {orderData.paymentMethod === 'ewallet' ? <i className="fas fa-wallet text-blue-600"></i> : <i className="fas fa-credit-card text-blue-600"></i>} {/* Thêm icon phù hợp */}
              </div>
              <span className="ml-3 font-medium">
                {orderData.paymentMethod === 'card' ? 'Thẻ tín dụng/ghi nợ' :
                  orderData.paymentMethod === 'ewallet' ? 'Ví điện tử' :
                    orderData.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' :
                      orderData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' :
                        'Phương thức khác'}
              </span>
              {/* <span className="ml-3 font-medium">{orderData.paymentMethod === 'ewallet' ? 'Ví điện tử' : 'Phương thức khác'}</span> Hiển thị tên phương thức */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              type="primary"
              size="large"
              className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 min-w-[180px] cursor-pointer"
              icon={<i className="fas fa-truck-fast mr-2"></i>}
              onClick={showTrackingModal}
            >
              Theo dõi đơn hàng
            </Button>
            <Button
              size="large"
              className="!rounded-button whitespace-nowrap min-w-[180px] cursor-pointer"
              icon={<ShoppingOutlined className="mr-2" />}
              onClick={() => router.push('/')}
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              size="large"
              className="!rounded-button whitespace-nowrap min-w-[180px] cursor-pointer"
              icon={<HomeOutlined className="mr-2" />}
              onClick={() => router.push('/')}
            >
              Về trang chủ
            </Button>
          </div>

          {/* Order Tracking Modal */}
          <Modal
            title={<div className="text-xl font-semibold">Theo dõi đơn hàng #{orderData.id}</div>}
            open={isTrackingModalOpen}
            onCancel={handleTrackingModalClose}
            footer={null}
            width={800}
          >
            <div className="py-6">
              <Steps
                current={0} // Cần logic để cập nhật trạng thái theo dõi
                progressDot
                className="custom-steps mb-8"
              >
                <Step title="Đặt hàng thành công" />
                <Step title="Đã xác nhận" />
                <Step title="Đang chuẩn bị hàng" />
                <Step title="Đang giao hàng" />
                <Step title="Đã giao hàng" />
              </Steps>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Thông tin vận chuyển</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Đơn vị vận chuyển:</span> <span className="font-medium">Express</span></p> {/* Lấy từ API nếu có */}
                  <p><span className="text-gray-600">Mã vận đơn:</span> <span className="font-medium">743511</span></p> {/* Lấy từ API nếu có */}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <i className="fas fa-info-circle text-blue-600 mt-1"></i>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">Đơn hàng của bạn đã được thanh toán thành công và đang được xử lý.</p>
                    <p className="text-sm text-blue-600 mt-2">Bạn có thể theo dõi đơn hàng ở trên.</p>
                  </div>
                </div>
              </div>
            </div>
          </Modal>

        </div>
      </main>
      {/* Footer */}

      {/* Add custom styles */}
      <style jsx>{`
        .custom-steps .ant-steps-item-tail {
          padding: 3.5px 0;
        }
        .custom-steps .ant-steps-item-content {
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;