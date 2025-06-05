import {
  ClockCircleOutlined,
  SyncOutlined,
  CarOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { Order } from "@/app/types";

export function mapPaymentMethod(method: Order["paymentMethod"]) {
  switch (method) {
    case "card":
      return "Thẻ tín dụng";
    case "ewallet":
      return "Ví điện tử";
    case "bank":
      return "Chuyển khoản ngân hàng";
    case "cod":
      return "Thanh toán khi nhận hàng";
    default:
      return "Không xác định";
  }
}

export function getStatusColor(status?: Order["status"]) {
  switch (status) {
    case "placed":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case "confirmed":
    case "preparing":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "shipping":
      return "bg-purple-50 text-purple-600 border-purple-200";
    case "delivered":
      return "bg-green-50 text-green-600 border-green-200";
    default:
      return "bg-gray-50 text-gray-500 border-gray-200";
  }
}

export function getStatusIcon(status?: Order["status"]) {
  switch (status) {
    case "placed":
      return <ClockCircleOutlined className="mr-1" />;
    case "confirmed":
    case "preparing":
      return <SyncOutlined spin className="mr-1" />;
    case "shipping":
      return <CarOutlined className="mr-1" />;
    case "delivered":
      return <CheckCircleOutlined className="mr-1" />;
    default:
      return <QuestionCircleOutlined className="mr-1" />;
  }
}

export function getStatusText(status?: Order["status"]) {
  switch (status) {
    case "placed":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "preparing":
      return "Đang chuẩn bị";
    case "shipping":
      return "Đang giao hàng";
    case "delivered":
      return "Đã giao hàng";
    default:
      return "Không xác định";
  }
}
