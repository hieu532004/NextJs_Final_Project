
// "use client";

// import React, { useState, useEffect } from "react";
// import { Modal, Button, Alert } from "antd"; // Import thêm Alert
// import { useRouter } from 'next/navigation'

// const PaymentQRCodeModal = ({
//   totalAfterDiscount,
//   onCancel, // Hàm này để đóng modal
// }: {
//   totalAfterDiscount: number;
//   onCancel: () => void; // Hàm onCancel đóng modal
// }) => {
//   const [minutes, setMinutes] = useState(5); // Thời gian phút bắt đầu từ 5 phút
//   const [seconds, setSeconds] = useState(0); // Thời gian giây bắt đầu từ 0
//   const [paymentStatus, setPaymentStatus] = useState<string>(""); // Trạng thái thanh toán
//   const [loading, setLoading] = useState<boolean>(false); // Quản lý trạng thái loading
//   const router = useRouter();  // Khởi tạo useRouter

//   // Hàm xử lý thanh toán thành công
//   const handlePaymentSuccess = () => {
//     setPaymentStatus("Thanh toán thành công!");
//     setLoading(false); // Dừng loading sau khi thanh toán thành công

//     // Tự động đóng modal sau 5 giây khi thanh toán thành công
//     setTimeout(() => {
//       document.cookie = "paymentStatus=success; path=/; max-age=3600";
//       router.push("/payment-success");
//       onCancel();

//     }, 5000); // Đóng modal sau 5 giây
//   };

//   // Hàm xử lý thanh toán thất bại
//   const handlePaymentFailure = () => {
//     setPaymentStatus("Thanh toán thất bại. Vui lòng thử lại!");
//     setLoading(false); // Dừng loading sau khi thanh toán thất bại
//   };

//   // Mô phỏng quá trình thanh toán và hiển thị kết quả sau 5 giây
//   const handlePayment = () => {
//     setLoading(true); // Bắt đầu loading
//     setPaymentStatus(""); // Reset trạng thái thanh toán
//     setTimeout(() => {
//       // Mô phỏng quá trình thanh toán sau 5 giây
//       const isSuccess = Math.random() > 0.5; // Giả sử 50% thành công, 50% thất bại
//       if (isSuccess) {
//         handlePaymentSuccess();
//       } else {
//         handlePaymentFailure();
//       }
//     }, 5000); // Thời gian chờ 5 giây
//   };

//   // Đếm ngược phút và giây
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setSeconds((prevSeconds) => {
//         if (prevSeconds === 0) {
//           if (minutes === 0) {
//             // Khi hết thời gian (đếm ngược xong), dừng timer và xử lý kết quả
//             clearInterval(timer);
//             handlePaymentFailure(); // Hoặc handlePaymentSuccess() tùy tình huống
//           }
//           setMinutes((prevMinutes) => prevMinutes - 1);
//           return 59; // Đặt lại giây về 59 khi chuyển sang phút mới
//         }
//         return prevSeconds - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer); // Dọn dẹp timer khi component bị unmount
//   }, [minutes, seconds]);

//   return (
//     <Modal
//       title="Thanh toán qua QR"
//       open={true} // Modal mở khi được điều khiển qua prop `open`
//       onCancel={onCancel} // Gọi onCancel khi nhấn hủy
//       footer={null}
//       width={600}
//       className="payment-modal"
//     >
//       <div className="bg-white p-6 rounded-lg">
//         {paymentStatus && (
//           <Alert
//             message={paymentStatus}
//             type={paymentStatus.includes("thành công") ? "success" : "error"}
//             showIcon
//             closable
//           />
//         )}
//         <div className="grid grid-cols-2 gap-8">
//           <div className="border-r pr-8">
//             <div className="text-center">
//               <h3 className="text-lg font-semibold mb-4">Quét mã để thanh toán</h3>
//               {/* QR Code Example */}
//               <div className="bg-white p-4 rounded-lg shadow-md mb-4">
//                 <img
//                   src="https://readdy.ai/api/search-image?query=QR%20code%20payment%20example%20with%20modern%20design%20and%20clear%20pattern%2C%20high%20resolution%20on%20white%20background&width=200&height=200&seq=3&orientation=squarish"
//                   alt="QR Code"
//                   className="w-48 h-48 mx-auto"
//                 />
//               </div>
//               <div className="flex items-center justify-center space-x-2 text-blue-600">
//                 <i className="fas fa-clock"></i>
//                 <span className="font-medium">
//                   {minutes < 10 ? "0" + minutes : minutes}:
//                   {seconds < 10 ? "0" + seconds : seconds} phút
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-gray-600 mb-1">Số tài khoản</p>
//                 <p className="font-medium">19035678912345</p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-1">Chủ tài khoản</p>
//                 <p className="font-medium">NGUYEN VAN A</p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-1">Ngân hàng</p>
//                 <p className="font-medium">Techcombank</p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-1">Số tiền</p>
//                 <p className="font-medium text-red-600">
//                   {totalAfterDiscount.toLocaleString()} VND
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-1">Nội dung chuyển khoản</p>
//                 <p className="font-medium">THANHTOAN 123456</p>
//               </div>
//             </div>
//             <div className="mt-8">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h4 className="font-medium mb-2">Hướng dẫn thanh toán</h4>
//                 <ol className="text-sm text-gray-600 space-y-2">
//                   <li>1. Mở ứng dụng ngân hàng hoặc ví điện tử</li>
//                   <li>2. Quét mã QR hoặc chuyển khoản theo thông tin</li>
//                   <li>3. Kiểm tra thông tin và xác nhận thanh toán</li>
//                   <li>4. Nhấn "Đã thanh toán" sau khi hoàn tất</li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-end space-x-4 mt-8">
//           <Button
//             onClick={onCancel} // Đóng modal khi nhấn hủy
//             icon={<i className="fas fa-times mr-2"></i>}
//             className="!rounded-button"
//           >
//             Hủy bỏ
//           </Button>
//           <Button
//             type="primary"
//             onClick={handlePayment} // Xử lý thanh toán
//             icon={<i className="fas fa-check mr-2"></i>}
//             className="!rounded-button bg-blue-500"
//             loading={loading} // Hiển thị loading khi đang xử lý thanh toán
//           >
//             Đã thanh toán
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default PaymentQRCodeModal;

"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from "antd";
import { useRouter } from 'next/navigation';

const PaymentQRCodeModal = ({
  totalAfterDiscount,
  onCancel,
  orderId,
}: {
  totalAfterDiscount: number;
  onCancel: () => void;
  orderId: string | undefined | null;
}) => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handlePaymentSuccess = () => {
    setPaymentStatus("Thanh toán thành công!");
    setLoading(false);

    setTimeout(() => {
      document.cookie = "paymentStatus=success; path=/; max-age=3600";
      if (orderId) {
        router.push(`/payment-success?orderId=${orderId}`);
      } else {
        router.push("/payment-success");
        console.warn("Không có orderId để chuyển hướng.");
      }
      onCancel();
    }, 5000);
  };

  const handlePaymentFailure = () => {
    setPaymentStatus("Thanh toán thất bại. Vui lòng thử lại!");
    setLoading(false);
  };

  const handlePayment = () => {
    setLoading(true);
    setPaymentStatus("");
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5;
      if (isSuccess) {
        handlePaymentSuccess();
      } else {
        handlePaymentFailure();
      }
    }, 5000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            handlePaymentFailure();
          }
          setMinutes((prevMinutes) => prevMinutes - 1);
          return 59;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  return (
    <Modal
      title="Thanh toán qua QR"
      open={true}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="payment-modal"
    >
      <div className="bg-white p-6 rounded-lg">
        {paymentStatus && (
          <Alert
            message={paymentStatus}
            type={paymentStatus.includes("thành công") ? "success" : "error"}
            showIcon
            closable
          />
        )}
        <div className="grid grid-cols-2 gap-8">
          <div className="border-r pr-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Quét mã để thanh toán</h3>
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <img
                  src="https://readdy.ai/api/search-image?query=QR%20code%20payment%20example%20with%20modern%20design%20and%20clear%20pattern%2C%20high%20resolution%20on%20white%20background&width=200&height=200&seq=3&orientation=squarish"
                  alt="QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <i className="fas fa-clock"></i>
                <span className="font-medium">
                  {minutes < 10 ? "0" + minutes : minutes}:
                  {seconds < 10 ? "0" + seconds : seconds} phút
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-1">Số tài khoản</p>
                <p className="font-medium">19035678912345</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Chủ tài khoản</p>
                <p className="font-medium">NGUYEN VAN A</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Ngân hàng</p>
                <p className="font-medium">Techcombank</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Số tiền</p>
                <p className="font-medium text-red-600">
                  {totalAfterDiscount.toLocaleString()} VND
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Nội dung chuyển khoản</p>
                <p className="font-medium">THANHTOAN 123456</p>
              </div>
            </div>
            <div className="mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Hướng dẫn thanh toán</h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                  <li>2. Quét mã QR hoặc chuyển khoản theo thông tin</li>
                  <li>3. Kiểm tra thông tin và xác nhận thanh toán</li>
                  <li>4. Nhấn "Đã thanh toán" sau khi hoàn tất</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            onClick={onCancel}
            icon={<i className="fas fa-times mr-2"></i>}
            className="!rounded-button"
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            onClick={handlePayment}
            icon={<i className="fas fa-check mr-2"></i>}
            className="!rounded-button bg-blue-500"
            loading={loading}
          >
            Đã thanh toán
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentQRCodeModal;