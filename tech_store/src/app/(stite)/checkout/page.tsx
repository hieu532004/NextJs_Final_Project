

"use client";
import { useState, useEffect } from "react";
import { Button, Form, message } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import PaymentMethod from "@/app/components/PaymentMethod";
import ShippingInfo from "@/app/components/ShippingInfo";
import OrderSummary from "@/app/components/OrderSummary";
import PaymentQRCodeModal from "@/app/components/PaymentQRCodeModal";
import CardPayment from "@/app/components/CardPayment";
import CODPayment from "@/app/components/CODPayment";
import Header from "@/app/components/Header";
import { useCart } from "@/app/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/authContext";

const App: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [form] = Form.useForm();
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showCODPayment, setShowCODPayment] = useState(false);
  const { cart, clearCart } = useCart();
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const [orderIdFromServer, setOrderIdFromServer] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const applyDiscount = () => {
    if (discountCode.trim() !== "") {
      setDiscountAmount(100000);
      setDiscountApplied(true);
    }
  };

  const handleFinish = async (values: any) => {
    console.log("Success:", values);
    const orderData = {
      ...values,
      userid: user?.id,
      userfullname: user?.name,
      paymentMethod: paymentMethod,
      orderItems: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        pricePerUnit: item.price,
        name: item.name, // Lấy trực tiếp từ cart
        imageUrl: item.image, // Lấy trực tiếp từ cart (đảm bảo tên trường backend tương ứng)
      })),
      totalAmount: totalAfterDiscount,
      discountAmount: discountAmount,
      
    };

    try {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Order created:", data);
        message.success("Đặt hàng thành công!");
        setOrderIdFromServer(data.id);
        clearCart();
        document.cookie = "paymentStatus=success; max-age=3600; path=/";
        if (paymentMethod === "ewallet" || paymentMethod === "bank") {
          setShowQRCodeModal(true);
        } else {
          router.push(`/payment-success?orderId=${data.id}`);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to create order:", errorData);
        message.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("Error creating order:", error.message);
      message.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        handleFinish(values);
        if (paymentMethod === "card") {
          setShowCardPayment(true);
        } else if (paymentMethod === "cod") {
          setShowCODPayment(true);
        }
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const originalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = 30000;
  const totalBeforeDiscount = originalPrice + shippingFee;
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="container mx-auto px-4 py-8">
        <Form form={form} layout="vertical">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-2/3 px-4 mb-8">
              <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
              <ShippingInfo />
            </div>
            <div className="w-full lg:w-1/3 px-4">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <OrderSummary
                  orderItems={cart}
                  originalPrice={originalPrice}
                  shippingFee={shippingFee}
                  discountCode={discountCode}
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
                  onClick={handleSubmit}
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
      {showQRCodeModal && orderIdFromServer && (
        <PaymentQRCodeModal
          totalAfterDiscount={totalAfterDiscount}
          onCancel={() => setShowQRCodeModal(false)}
          orderId={orderIdFromServer}
        />
      )}
      {showCardPayment && (
        <CardPayment
          totalAfterDiscount={totalAfterDiscount}
          onCancel={() => setShowCardPayment(false)}
        />
      )}
      {showCODPayment && (
        <CODPayment
          totalAfterDiscount={totalAfterDiscount}
          onCancel={() => setShowCODPayment(false)}
        />
      )}
    </div>
  );
};

export default App;