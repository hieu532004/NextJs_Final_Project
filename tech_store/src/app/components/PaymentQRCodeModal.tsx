

"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from "antd";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const PaymentQRCodeModal = ({
  totalAfterDiscount,
  onCancel,
  orderData,
  onCreateOrder,
}: {
  totalAfterDiscount: number;
  onCancel: () => void;
  orderData: any;
  onCreateOrder: (orderData: any) => Promise<void>;
}) => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const simulatePaymentVerification = () => {
    setLoading(true);
    setPaymentStatusMessage("Đang xác nhận thanh toán...");
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5;
      if (isSuccess) {
        setPaymentStatusMessage("Thanh toán thành công! Đang xử lý đơn hàng...");
        onCreateOrder({ ...orderData, paymentStatus: "success" });
      } else {
        setPaymentStatusMessage("Thanh toán thất bại. Vui lòng thử lại!");
        setLoading(false);
      }
    }, 3000);
  };

  const handlePaymentFailureByTimer = () => {
    setPaymentStatusMessage("Thời gian thanh toán đã hết. Vui lòng thử lại!");
    setLoading(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            handlePaymentFailureByTimer();
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
      className="payment-modal max-w-full sm:max-w-[90%] md:max-w-[600px]"
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg max-h-[80vh] overflow-auto">
        {paymentStatusMessage && (
          <Alert
            message={paymentStatusMessage}
            type={paymentStatusMessage.includes("thành công") ? "success" : "error"}
            showIcon
            closable
            className="mb-4"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* QR CODE SECTION */}
          <div className="md:border-r md:pr-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Quét mã để thanh toán</h3>
              <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-center">
                <Image
                  src="https://readdy.ai/api/search-image?query=QR%20code%20payment%20example%20with%20modern%20design%20and%20clear%20pattern%2C%20high%20resolution%20on%20white%20background&width=200&height=200&seq=3&orientation=squarish"
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="w-full max-w-[200px] h-auto"
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

          {/* PAYMENT INFO SECTION */}
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
                <p className="font-medium">THANHTOAN</p>
              </div>
            </div>

            {/* <div className="mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Hướng dẫn thanh toán</h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                  <li>2. Quét mã QR hoặc chuyển khoản theo thông tin</li>
                  <li>3. Kiểm tra thông tin và xác nhận thanh toán</li>
                  <li>4. Nhấn "Đã thanh toán" sau khi hoàn tất</li>
                </ol>
              </div>
            </div> */}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 gap-3 mt-8">
          <Button onClick={onCancel}>Hủy bỏ</Button>
          <Button type="primary" onClick={simulatePaymentVerification} loading={loading}>
            Đã thanh toán
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentQRCodeModal;
