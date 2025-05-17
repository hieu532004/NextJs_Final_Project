
import { FC, useEffect, useState } from "react";

// Interface cho OrderItemProps (đã cập nhật để sử dụng 'image')
interface OrderItemProps {
  name: string;
  quantity: number;
  price: number;
  image?: string; // Sử dụng 'image' thay vì 'imageUrl'
}

const OrderItem: FC<OrderItemProps> = ({ name, quantity, price, image }) => {
  const [formattedPrice, setFormattedPrice] = useState<string>("");

  useEffect(() => {
    // Đảm bảo rằng giá trị chỉ được định dạng sau khi component đã render trên client
    setFormattedPrice(price.toLocaleString("vi-VN")); // Định dạng tiền theo chuẩn Việt Nam
  }, [price]); // Re-run effect nếu giá trị price thay đổi

  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-16 h-16 flex-shrink-0">
        <img
          src={image || "/placeholder.svg"} // Sử dụng 'image'
          alt={name}
          className="w-full h-full object-cover object-top rounded-md"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-500">SL: {quantity}</p>
      </div>
      <div className="text-right">a
        <p className="font-medium">{formattedPrice} VND</p>
      </div>
    </div>
  );
};

export default OrderItem;
