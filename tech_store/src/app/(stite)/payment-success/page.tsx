"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Lấy hook router
import { Button, Card, Divider, Tag, message } from "antd";
import { CheckCircleFilled, PhoneOutlined, MailOutlined, ClockCircleOutlined, HomeOutlined } from "@ant-design/icons";
import Footer from "@/app/components/Footer";

// Component cho trang thanh toán thành công
const PaymentSuccess: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Kiểm tra nếu người dùng hợp lệ
  const router = useRouter();

  // Hàm để kiểm tra cookie hoặc session
  useEffect(() => {
    const paymentStatus = document.cookie.split("; ").find(row => row.startsWith("paymentStatus="));
    
    if (paymentStatus && paymentStatus.split("=")[1] === "success") {
      setIsAuthenticated(true); // Nếu thanh toán thành công, cho phép truy cập trang
    } else {
      router.push("/"); // Nếu không có trạng thái thanh toán thành công, chuyển hướng về trang chủ
    }
  }, [router]);

  // Tiến trình tải hóa đơn PDF
  const handleDownloadInvoice = () => {
    message.success("Đang tải hóa đơn PDF...");
  };

  const handleContinueShopping = () => {
    message.success("Chuyển hướng đến trang mua sắm...");
    // Chuyển hướng đến trang mua sắm
    router.push("/");
  };

  if (!isAuthenticated) {
    return null; // Trả về null nếu không được phép truy cập trang
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Thành công header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <CheckCircleFilled className="text-6xl text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">Thanh toán thành công</h1>
          <p className="text-gray-600 mb-2">Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi</p>
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-gray-600">Mã đơn hàng:</span>
            <span className="font-bold text-gray-800">#ORD123456789</span>
          </div>
          <div className="flex justify-center items-center gap-2">
            <ClockCircleOutlined className="text-gray-500" />
            <span className="text-gray-600">Ngày đặt hàng: 02/05/2025 - 14:30</span>
          </div>
        </div>

        {/* Chi tiết đơn hàng, thông tin khách hàng, giao hàng, thanh toán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="h-full shadow-sm" title="Thông tin khách hàng">
              <div className="space-y-4">
                <div><p className="text-gray-500 text-sm mb-1">Họ tên</p><p className="font-medium">Nguyễn Văn A</p></div>
                <div><p className="text-gray-500 text-sm mb-1">Số điện thoại</p><p className="font-medium">0912345678</p></div>
                <div><p className="text-gray-500 text-sm mb-1">Email</p><p className="font-medium">example@gmail.com</p></div>
              </div>
            </Card>
          </div>

          {/* Thông tin giao hàng */}
          <div className="md:col-span-1">
            <Card className="h-full shadow-sm" title="Thông tin giao hàng">
              <div className="space-y-4">
                <div><p className="text-gray-500 text-sm mb-1">Địa chỉ giao hàng</p><p className="font-medium">123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh</p></div>
                <div><p className="text-gray-500 text-sm mb-1">Phương thức vận chuyển</p><p className="font-medium">Giao hàng tiêu chuẩn</p></div>
                <div><p className="text-gray-500 text-sm mb-1">Thời gian dự kiến</p><p className="font-medium">05/05/2025 - 07/05/2025</p></div>
              </div>
            </Card>
          </div>

          {/* Thông tin thanh toán */}
          <div className="md:col-span-1">
            <Card className="h-full shadow-sm" title="Thông tin thanh toán">
              <div className="space-y-4">
                <div><p className="text-gray-500 text-sm mb-1">Phương thức thanh toán</p><div className="flex items-center gap-2"><i className="fas fa-credit-card text-blue-500"></i><p className="font-medium">Thẻ tín dụng/ghi nợ</p></div></div>
                <div><p className="text-gray-500 text-sm mb-1">Tình trạng thanh toán</p><Tag color="green" className="!rounded-button">Đã thanh toán</Tag></div>
                <div><p className="text-gray-500 text-sm mb-1">Mã giảm giá</p><p className="font-medium">SUMMER2023</p></div>
              </div>
            </Card>
          </div>
        </div>

        {/* Các nút */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Button type="primary" size="large" icon={<i className="fas fa-file-invoice mr-2"></i>} className="!rounded-button whitespace-nowrap cursor-pointer" onClick={handleDownloadInvoice}>Tải hóa đơn PDF</Button>
          <Button size="large" icon={<i className="fas fa-shopping-cart mr-2"></i>} className="!rounded-button whitespace-nowrap cursor-pointer" onClick={handleContinueShopping}>Tiếp tục mua sắm</Button>
        </div>

        {/* Hỗ trợ khách hàng */}
        <div className="mt-10 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Hỗ trợ khách hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"><PhoneOutlined className="text-blue-500" /></div>
              <div><p className="font-medium">Hotline</p><p className="text-blue-500">1900 1234</p><p className="text-sm text-gray-500">8:00 - 21:00, Thứ 2 - Chủ Nhật</p></div>
            </div>
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"><MailOutlined className="text-blue-500" /></div>
              <div><p className="font-medium">Email hỗ trợ</p><p className="text-blue-500">support@example.com</p><p className="text-sm text-gray-500">Phản hồi trong vòng 24h</p></div>
            </div>
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"><HomeOutlined className="text-blue-500" /></div>
              <div><p className="font-medium">Cửa hàng</p><p className="text-gray-700">123 Đường ABC, Quận 1</p><p className="text-sm text-gray-500">8:00 - 21:00, Thứ 2 - Chủ Nhật</p></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
