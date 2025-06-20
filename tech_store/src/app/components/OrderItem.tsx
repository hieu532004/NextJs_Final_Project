import { FC, useEffect, useState } from "react";
import Image from "next/image";

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
      <div className="w-16 h-16 flex-shrink-0 relative">
        <Image
          src={image || "/placeholder.svg"} // Fallback if image is undefined
          alt={name}
          layout="fill"
          style={{ objectFit: "cover", objectPosition: "top" }} // Replace object-cover and object-top
          className="rounded-md" // Keep rounded corners
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-500">SL: {quantity}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{formattedPrice} VND</p>
      </div>
    </div>
  );
};

export default OrderItem;
