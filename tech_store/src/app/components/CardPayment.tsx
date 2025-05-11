
"use client";
import React, { useState } from "react";
import { Modal, Form, Input, Button, Alert } from "antd";
import { useRouter } from "next/navigation";

const CardPayment: React.FC<{ totalAfterDiscount: number; onCancel: () => void }> = ({
  onCancel,
}) => {
  const [loading, setLoading] = useState(false); // Để kiểm tra trạng thái loading
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // Trạng thái thanh toán
  const [showAlert, setShowAlert] = useState(false); // Để hiển thị Alert thông báo
  const router = useRouter(); // Khởi tạo useRouter

  const [form] = Form.useForm();

  // Hàm xử lý thanh toán
  const handleCardPayment = () => {
    // Validate các trường trước khi xử lý thanh toán
    form
      .validateFields()
      .then(() => {
        setLoading(true); // Hiển thị trạng thái loading khi bắt đầu xử lý thanh toán
        setShowAlert(false); // Reset trạng thái alert khi bắt đầu thanh toán

        // Mô phỏng quá trình thanh toán (50% thành công, 50% thất bại)
        const isSuccess = Math.random() > 0.5;

        setTimeout(() => {
          setLoading(false);

          if (isSuccess) {
            setPaymentStatus("Thanh toán thành công!");
            setShowAlert(true);

            // Lưu trạng thái thanh toán vào cookie
            document.cookie = "paymentStatus=success; path=/; max-age=3600"; // Cookie hết hạn sau 1 giờ

            setTimeout(() => {
              router.push("/payment-success"); // Chuyển hướng tới trang thanh toán thành công
              onCancel();
            }, 5000); // Đóng modal sau 5 giây
          } else {
            setPaymentStatus("Thanh toán thất bại. Vui lòng thử lại.");
            setShowAlert(true);
          }
        }, 2000); // Giả lập thời gian thanh toán (2 giây)
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  return (
    <Modal title="Thanh toán bằng thẻ" open={true} onCancel={onCancel} footer={null} width={600}>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Số thẻ"
          name="cardNumber"
          rules={[{ required: true, message: "Vui lòng nhập số thẻ" }, { len: 16, message: "Số thẻ phải có 16 ký tự", whitespace: true }]}
        >
          <Input placeholder="1234 5678 9012 3456" />
        </Form.Item>
        <Form.Item
          label="Tên chủ thẻ"
          name="cardholderName"
          rules={[{ required: true, message: "Vui lòng nhập tên chủ thẻ" }]}
        >
          <Input placeholder="NGUYEN VAN A" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Ngày hết hạn" name="expiryDate" rules={[{ required: true, message: "Vui lòng nhập ngày hết hạn" }]}>
            <Input placeholder="MM/YY" />
          </Form.Item>
          <Form.Item label="CVV" name="cvv" rules={[{ required: true, message: "Vui lòng nhập CVV" }, { len: 3, message: "CVV phải có 3 ký tự" }]}>
            <Input placeholder="123" />
          </Form.Item>
        </div>
      </Form>

      {showAlert && (
        <Alert
          message={paymentStatus}
          type={paymentStatus?.includes("thành công") ? "success" : "error"}
          showIcon
          closable
        />
      )}

      <div className="flex justify-end space-x-4 mt-8">
        <Button onClick={onCancel} className="!rounded-button">
          Hủy bỏ
        </Button>
        <Button
          type="primary"
          onClick={handleCardPayment}
          className="!rounded-button bg-blue-500"
          loading={loading}
        >
          Thanh toán
        </Button>
      </div>
    </Modal>
  );
};

export default CardPayment;
