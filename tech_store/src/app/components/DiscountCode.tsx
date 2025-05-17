import { FC } from "react";
import { Input, Button } from "antd";

interface DiscountCodeProps {
  discountCode: string;
  applyDiscount: () => void;
  setDiscountCode: (value: string) => void;
  discountApplied: boolean;
  discountAmount: number;
}

const DiscountCode: FC<DiscountCodeProps> = ({
  discountCode,
  applyDiscount,
  setDiscountCode,
  discountApplied,
  discountAmount,
}) => (
  <div className="pt-2">
    <p className="text-gray-600 mb-2">Mã giảm giá:</p>
    <div className="flex">
      <Input
        placeholder="Nhập mã giảm giá"
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value)}
        className="rounded-l-lg border-r-0"
      />
      <Button
        type="primary"
        onClick={applyDiscount}
        className="!rounded-button rounded-r-lg bg-blue-500 whitespace-nowrap"
      >
        Áp dụng
      </Button>
    </div>
    {discountApplied && (
      <div className="flex justify-between mt-2 text-green-600">
        <p>Giảm giá:</p>
        <p>-{discountAmount.toLocaleString()} VND</p>
      </div>
    )}
  </div>
);

export default DiscountCode;
