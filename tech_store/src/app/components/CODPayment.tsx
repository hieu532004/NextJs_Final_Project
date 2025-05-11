
"use client";  // Đảm bảo khai báo này ở đầu file

import { useState } from "react";
import { Modal, Button, Alert } from "antd"; // Sử dụng Alert để thông báo
import { useRouter } from 'next/navigation' // Import useRouter từ next/router

const CODPayment: React.FC<{ totalAfterDiscount: number; onCancel: () => void }> = ({
  totalAfterDiscount,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);  // Trạng thái loading
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // Trạng thái thanh toán
  const [showAlert, setShowAlert] = useState(false); // Quản lý việc hiển thị Alert
  const router = useRouter();  // Khởi tạo useRouter

  const handleCODPayment = () => {
    setLoading(true);
    setShowAlert(false);

    // Giả lập quá trình thanh toán
    const isSuccess = Math.random() > 0.5;

    setTimeout(() => {
      setLoading(false);
      if (isSuccess) {
        setPaymentStatus("Đặt hàng thành công!");
        setShowAlert(true);
        setTimeout(() => {
          document.cookie = "paymentStatus=success; path=/; max-age=3600";
          router.push("/payment-success");  // Chuyển hướng sau khi thanh toán thành công
          onCancel();  // Đóng modal sau 5 giây
        }, 5000);
      } else {
        setPaymentStatus("Đặt hàng thất bại. Vui lòng thử lại.");
        setShowAlert(true);
      }
    }, 2000); // Giả lập thời gian thanh toán
  };

  return (
    <Modal
      title="Xác nhận đặt hàng COD"
      open={true}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <div>
        <p>
          Bạn sẽ thanh toán số tiền{" "}
          {totalAfterDiscount.toLocaleString()} VND khi nhận hàng.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          * Vui lòng chuẩn bị đúng số tiền khi nhận hàng
        </p>
        <p className="text-sm text-gray-500">
          * Đơn hàng sẽ được giao trong vòng 2-3 ngày làm việc
        </p>
      </div>

      {showAlert && (
        <Alert
          message={paymentStatus}  // Hiển thị thông báo thành công hoặc thất bại
          type={paymentStatus?.includes("thành công") ? "success" : "error"}
          showIcon
          closable
        />
      )}

      <div className="flex justify-end space-x-4 mt-8">
        <Button onClick={onCancel} className="!rounded-button">Hủy bỏ</Button>
        <Button
          type="primary"
          onClick={handleCODPayment}
          className="!rounded-button bg-blue-500"
          loading={loading}
        >
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default CODPayment;
