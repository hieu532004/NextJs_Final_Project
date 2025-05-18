"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from "antd";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const PaymentQRCodeModal = ({
  totalAfterDiscount,
  onCancel,
  orderId,
}: {
  totalAfterDiscount: number;
  onCancel: () => void;
  orderId: string | undefined | null;
}) => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handlePaymentSuccess = () => {
    setPaymentStatus("Thanh toán thành công!");
    setLoading(false);

    setTimeout(() => {
      document.cookie = "paymentStatus=success; path=/; max-age=3600";
      if (orderId) {
        router.push(`/payment-success?orderId=${orderId}`);
      } else {
        router.push("/payment-success");
        console.warn("Không có orderId để chuyển hướng.");
      }
      onCancel();
    }, 5000);
  };

  const handlePaymentFailure = () => {
    setPaymentStatus("Thanh toán thất bại. Vui lòng thử lại!");
    setLoading(false);
  };

  const handlePayment = () => {
    setLoading(true);
    setPaymentStatus("");
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5;
      if (isSuccess) {
        handlePaymentSuccess();
      } else {
        handlePaymentFailure();
      }
    }, 5000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            handlePaymentFailure();
          }
          setMinutes((prevMinutes) => prevMinutes - 1);
          return 59;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  return (
    <Modal
      title="Thanh toán qua QR"
      open={true}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="payment-modal"
    >
      <div className="bg-white p-6 rounded-lg">
        {paymentStatus && (
          <Alert
            message={paymentStatus}
            type={paymentStatus.includes("thành công") ? "success" : "error"}
            showIcon
            closable
          />
        )}
        <div className="grid grid-cols-2 gap-8">
          <div className="border-r pr-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Quét mã để thanh toán</h3>
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
  <Image
    src="https://readdy.ai/api/search-image?query=QR%20code%20payment%20example%20with%20modern%20design%20and%20clear%20pattern%2C%20high%20resolution%20on%20white%20background&width=200&height=200&seq=3&orientation=squarish"
    alt="QR Code"
    width={200} // Matches URL query
    height={200} // Matches URL query
    className="w-48 h-48 mx-auto" // 192x192 pixels
  />
</div>
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <i className="fas fa-clock"></i>
                <span className="font-medium">
                  {minutes < 10 ? "0" + minutes : minutes}:
                  {seconds < 10 ? "0" + seconds : seconds} phút
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-1">Số tài khoản</p>
                <p className="font-medium">19035678912345</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Chủ tài khoản</p>
                <p className="font-medium">NGUYEN VAN A</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Ngân hàng</p>
                <p className="font-medium">Techcombank</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Số tiền</p>
                <p className="font-medium text-red-600">
                  {totalAfterDiscount.toLocaleString()} VND
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Nội dung chuyển khoản</p>
                <p className="font-medium">THANHTOAN 123456</p>
              </div>
            </div>
            <div className="mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Hướng dẫn thanh toán</h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                  <li>2. Quét mã QR hoặc chuyển khoản theo thông tin</li>
                  <li>3. Kiểm tra thông tin và xác nhận thanh toán</li>
                  <li>4. Nhấn "Đã thanh toán" sau khi hoàn tất</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            onClick={onCancel}
            icon={<i className="fas fa-times mr-2"></i>}
            className="!rounded-button"
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            onClick={handlePayment}
            icon={<i className="fas fa-check mr-2"></i>}
            className="!rounded-button bg-blue-500"
            loading={loading}
          >
            Đã thanh toán
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentQRCodeModal;