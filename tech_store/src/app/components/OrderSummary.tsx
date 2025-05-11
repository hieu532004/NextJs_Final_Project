import { FC } from "react";
import OrderItem from "./OrderItem";
import DiscountCode from "./DiscountCode";
import PaymentTotal from "./PaymentTotal";


interface OrderSummaryProps {
  orderItems: { name: string; quantity: number; price: number; imageUrl: string }[];
  originalPrice: number;
  shippingFee: number;
  discountCode: string;
  applyDiscount: () => void;
  setDiscountCode: (value: string) => void;
  discountApplied: boolean;
  discountAmount: number;
  totalAfterDiscount: number;
}

const OrderSummary: FC<OrderSummaryProps> = ({
  orderItems,
  originalPrice,
  shippingFee,
  discountCode,
  applyDiscount,
  setDiscountCode,
  discountApplied,
  discountAmount,
  totalAfterDiscount,
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Thông tin Đơn hàng</h2>

    {/* List order items */}
    {orderItems.map((item, index) => (
      <OrderItem
        key={index}
        name={item.name}
        quantity={item.quantity}
        price={item.price}
        imageUrl={item.imageUrl}
      />
    ))}

    {/* Order totals */}
    <div className="py-4 space-y-3 border-b">
      <div className="flex justify-between">
        <p className="text-gray-600">Tổng tiền hàng:</p>
        <p className="font-medium">{originalPrice.toLocaleString()} VND</p>
      </div>
      <div className="flex justify-between">
        <p className="text-gray-600">Phí vận chuyển:</p>
        <p className="font-medium">{shippingFee.toLocaleString()} VND</p>
      </div>
      <DiscountCode
        discountCode={discountCode}
        applyDiscount={applyDiscount}
        setDiscountCode={setDiscountCode}
        discountApplied={discountApplied}
        discountAmount={discountAmount}
      />
    </div>

    {/* Total payment */}
    <PaymentTotal totalAfterDiscount={totalAfterDiscount} />
  </div>
);

export default OrderSummary;
