


"use client";

import { useState } from "react";
import { Modal, Button, Alert } from "antd"; // Sử dụng Alert để thông báo
import { useRouter } from 'next/navigation' // Import useRouter từ next/router

const CODPayment: React.FC<{
  totalAfterDiscount: number;
  onCancel: () => void;
  orderData: any; // Nhận dữ liệu đơn hàng từ component cha
  onCreateOrder: (orderData: any) => Promise<void>; // Callback để gọi khi thanh toán thành công
}> = ({
  totalAfterDiscount,
  onCancel,
  orderData,
  onCreateOrder,
}) => {
    const [loading, setLoading] = useState(false);  // Trạng thái loading
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // Trạng thái thanh toán
    const [showAlert, setShowAlert] = useState(false); // Quản lý việc hiển thị Alert
    const router = useRouter();  // Khởi tạo useRouter

    const handleCODPayment = async () => {
      setLoading(true);
      setShowAlert(false);

      // Giả lập quá trình thanh toán COD thành công ở frontend
      setPaymentStatus("Đặt hàng thành công!");
      setShowAlert(true);

      // Gọi callback onCreateOrder để tạo đơn hàng thực tế ở backend
      // và chuyển hướng đến trang thành công
      try {
        await onCreateOrder({ ...orderData, paymentStatus: "cod" });
        // Chuyển hướng sẽ được xử lý ở component cha sau khi onCreateOrder thành công
      } catch (error: any) {
        console.error("Lỗi khi tạo đơn hàng COD:", error.message);
        setPaymentStatus("Đặt hàng thất bại. Vui lòng thử lại.");
        setShowAlert(true);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Modal
        title="Xác nhận đặt hàng COD"
        open={true}
        onCancel={onCancel}
        footer={null}
        width={600} // Kích thước cố định
      >
        <div className="p-4">
          <p className="mb-2">
            Bạn sẽ thanh toán số tiền{" "}
            <span className="font-semibold">{totalAfterDiscount.toLocaleString()} VND</span> khi nhận hàng.
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
            message={paymentStatus}  // Hiển thị thông báo thành công hoặc thất bại
            type={paymentStatus?.includes("thành công") ? "success" : "error"}
            showIcon
            closable
            className="mb-4"
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