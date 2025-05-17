import { FC } from "react";

interface PaymentTotalProps {
  totalAfterDiscount: number;
}

const PaymentTotal: FC<PaymentTotalProps> = ({ totalAfterDiscount }) => (
  <div className="py-4">
    <div className="flex justify-between items-center">
      <p className="font-bold text-lg">Tổng thanh toán:</p>
      <p className="font-bold text-xl text-red-600">
        {totalAfterDiscount.toLocaleString()} VND
      </p>
    </div>
    <p className="text-gray-500 text-sm text-right">(Đã bao gồm VAT)</p>
  </div>
);

export default PaymentTotal;
