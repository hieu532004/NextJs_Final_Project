
"use client";
import React, { useState } from "react";
import { Modal, Form, Input, Button, Alert } from "antd";
import { useRouter } from "next/navigation";

const CardPayment: React.FC<{
  totalAfterDiscount: number;
  onCancel: () => void;
  orderData: any;
  onCreateOrder: (orderData: any) => Promise<void>;
}> = ({
  onCancel,
  orderData,
  onCreateOrder,
}) => {
    const [loading, setLoading] = useState(false); // Để kiểm tra trạng thái loading
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // Trạng thái thanh toán
    const [showAlert, setShowAlert] = useState(false); // Để hiển thị Alert thông báo
    const router = useRouter(); // Khởi tạo useRouter
    const [form] = Form.useForm();

    // Hàm xử lý thanh toán
    const handleCardPayment = async () => {
      // Validate các trường trước khi xử lý thanh toán
      form
        .validateFields()
        .then(async (values) => {
          setLoading(true); // Hiển thị trạng thái loading khi bắt đầu xử lý thanh toán
          setShowAlert(false); // Reset trạng thái alert khi bắt đầu thanh toán

          // Mô phỏng quá trình thanh toán thành công ở frontend
          setPaymentStatus("Thanh toán thành công!");
          setShowAlert(true);

          // Gọi callback onCreateOrder để tạo đơn hàng thực tế ở backend
          // và chuyển hướng đến trang thành công
          try {
            await onCreateOrder({ ...orderData, paymentStatus: "card", paymentDetails: values });
            // Chuyển hướng sẽ được xử lý ở component cha sau khi onCreateOrder thành công
          } catch (error: any) {
            console.error("Lỗi khi tạo đơn hàng bằng thẻ:", error.message);
            setPaymentStatus("Thanh toán thất bại. Vui lòng thử lại.");
            setShowAlert(true);
            setLoading(false);
          } finally {
            setLoading(false);
          }
        })
        .catch((errorInfo) => {
          console.log("Validation Failed:", errorInfo);
        });
    };

    return (
      <Modal
        title="Thanh toán bằng thẻ"
        open={true}
        onCancel={onCancel}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Số thẻ"
            name="cardNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số thẻ" },
              { len: 16, message: "Số thẻ phải có 16 ký tự", whitespace: true },
            ]}
          >
            <Input placeholder="1234 5678 9012 3456" />
          </Form.Item>
          <Form.Item
            label="Tên chủ thẻ"
            name="cardholderName"
            rules={[
              { required: true, message: "Vui lòng nhập tên chủ thẻ" },
              {
                pattern: /^[A-Z\s]+$/,
                message: "Tên chỉ được chứa chữ in hoa và khoảng trắng",
              },
            ]}
          >
            <Input placeholder="NGUYEN VAN A" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Ngày hết hạn"
              name="expiryDate"
              rules={[
                { required: true, message: "Vui lòng nhập ngày hết hạn" },
                {
                  pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: "Định dạng phải là MM/YY",
                },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const [month, year] = value.split('/').map(Number);
                    const now = new Date();
                    const currentMonth = now.getMonth() + 1;
                    const currentYear = now.getFullYear() % 100;
                    if (year < currentYear || (year === currentYear && month < currentMonth)) {
                      return Promise.reject("Thẻ đã hết hạn");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="MM/YY" />
            </Form.Item>
            <Form.Item
              label="CVV"
              name="cvv"
              rules={[
                { required: true, message: "Vui lòng nhập CVV" },
                {
                  pattern: /^\d{3}$/,
                  message: "CVV phải gồm 3 chữ số",
                },
              ]}
            >
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
            className="mt-4"
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