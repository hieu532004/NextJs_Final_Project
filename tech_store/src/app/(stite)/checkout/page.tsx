
"use client";
import { useState, useEffect } from "react";
import { Button, Form } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import PaymentMethod from "@/app/components/PaymentMethod";
import ShippingInfo from "@/app/components/ShippingInfo";
import OrderSummary from "@/app/components/OrderSummary";
import PaymentQRCodeModal from "@/app/components/PaymentQRCodeModal";
import Footer from "@/app/components/Footer";
import CardPayment from "@/app/components/CardPayment"; // Modal thanh toán thẻ
import CODPayment from "@/app/components/CODPayment";

const App: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("card"); // Phương thức thanh toán
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [showQRCodeModal, setShowQRCodeModal] = useState(false); // Modal QR code
  const [showCardPayment, setShowCardPayment] = useState(false); // Modal thanh toán thẻ tín dụng
  const [showCODPayment, setShowCODPayment] = useState(false); // Modal thanh toán thẻ tín dụng

  useEffect(() => {
    setIsClient(true);
  }, []);

  const applyDiscount = () => {
    if (discountCode.trim() !== "") {
      setDiscountAmount(100000);
      setDiscountApplied(true);
    }
  };

  const handleFinish = (values: any) => {
    console.log("Success:", values);
    // Gửi đơn hàng
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        handleFinish(values);
        // Mở modal QR code hoặc thẻ tín dụng tùy vào phương thức thanh toán
        if (paymentMethod === "ewallet") {
          setShowQRCodeModal(true); // Hiển thị modal QR code
        } else if (paymentMethod === "card") {
          setShowCardPayment(true); // Hiển thị modal thanh toán thẻ
        }
        else if (paymentMethod === "bank") {
          setShowQRCodeModal(true); // Hiển thị modal thanh toán thẻ
        }
        else if (paymentMethod === "cod") {
          setShowCODPayment(true); // Hiển thị modal thanh toán thẻ
        }
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };
  

  const originalPrice = 32990000;
  const shippingFee = 30000;
  const totalBeforeDiscount = originalPrice + shippingFee;
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Form form={form} layout="vertical">
          <div className="flex flex-wrap -mx-4">
            {/* Left Column */}
            <div className="w-full lg:w-2/3 px-4 mb-8">
              <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
              <ShippingInfo />
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/3 px-4">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <OrderSummary
                  orderItems={[{ name: "iPhone 15 Pro Max", quantity: 1, price: 10000, imageUrl: "https://readdy.ai/api/search-image?query=Apple%20iPhone%2015%20Pro%20Max" }]}
                  originalPrice={32990000}
                  shippingFee={30000}
                  discountCode="SUMMER2023"
                  applyDiscount={applyDiscount}
                  setDiscountCode={(value: string) => setDiscountCode(value)}
                  discountApplied={discountApplied}
                  discountAmount={discountAmount}
                  totalAfterDiscount={totalAfterDiscount}
                />
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  type="primary"
                  size="large"
                  className="!rounded-button bg-blue-500 h-12 whitespace-nowrap"
                  icon={<CheckCircleOutlined />}
                  onClick={handleSubmit} // Gọi handleSubmit khi người dùng nhấn "Hoàn tất thanh toán"
                >
                  Hoàn tất thanh toán
                </Button>
                <Button
                  type="default"
                  size="large"
                  className="!rounded-button whitespace-nowrap"
                  icon={<ArrowLeftOutlined />}
                >
                  Quay lại
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>

      {/* Modal QR code khi thanh toán ví điện tử */}
      {showQRCodeModal && (
        <PaymentQRCodeModal
          totalAfterDiscount={totalAfterDiscount}
          onCancel={() => setShowQRCodeModal(false)} // Đóng modal khi nhấn hủy
        />
      )}

      {/* Modal thanh toán thẻ tín dụng */}
      {showCardPayment && (
        <CardPayment
          totalAfterDiscount={totalAfterDiscount}
          onCancel={() => setShowCardPayment(false)} // Đóng modal khi nhấn hủy
        />
      )}
      {showCODPayment && (
        <CODPayment
          totalAfterDiscount={totalAfterDiscount}
          onCancel={() => setShowCODPayment(false)} // Đóng modal khi nhấn hủy
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
