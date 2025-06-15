

import { useState } from "react";
import { Radio, Select } from "antd";
import { RadioChangeEvent } from "antd/es/radio"; // Đảm bảo import đúng type

const { Option } = Select;

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ paymentMethod, setPaymentMethod }) => {
  const [paymentType, setPaymentType] = useState<string>("oneTime");
  const [installmentDuration, setInstallmentDuration] = useState<string>("3");
  // Thêm state cho ngân hàng trả góp
  const [installmentBank, setInstallmentBank] = useState<string | undefined>(undefined);

  const handlePaymentMethodChange = (e: RadioChangeEvent) => {
    setPaymentMethod(e.target.value);
  };

  const handlePaymentTypeChange = (e: RadioChangeEvent) => {
    setPaymentType(e.target.value);
    // Khi chuyển đổi loại thanh toán, reset các lựa chọn trả góp
    if (e.target.value === "oneTime") {
      setInstallmentDuration("3"); // Reset về giá trị mặc định hoặc rỗng
      setInstallmentBank(undefined); // Reset ngân hàng
    } else { // Khi chuyển sang trả góp, chọn mặc định thanh toán qua thẻ
      setPaymentMethod("card");
    }
  };

  // Hàm xử lý thay đổi kỳ hạn trả góp (dùng cho Radio.Group)
  const handleInstallmentDurationChange = (e: RadioChangeEvent) => {
    setInstallmentDuration(e.target.value);
  };

  // HÀM MỚI: Xử lý thay đổi ngân hàng trả góp (dùng cho Select)
  const handleInstallmentBankChange = (value: string) => { // Ant Design Select truyền trực tiếp giá trị
    setInstallmentBank(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Phương thức Thanh toán</h2>

      {/* Phương thức thanh toán (Thanh toán một lần hoặc trả góp) */}
      <div className="mb-4">
        <Radio.Group value={paymentType} onChange={handlePaymentTypeChange} className="w-full">
          <Radio value="oneTime" className="mr-4">Thanh toán một lần</Radio>
          <Radio value="installment" className="mr-4">Thanh toán trả góp</Radio>
        </Radio.Group>
      </div>

      {/* Phương thức thanh toán một lần */}
      {paymentType === "oneTime" && (
        <Radio.Group
          onChange={handlePaymentMethodChange}
          value={paymentMethod}
          className="w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thẻ tín dụng/ghi nợ */}
            <div className={`border rounded-lg p-4 ${paymentMethod === "card" ? "border-blue-500" : "border-gray-200"}`}>
              <Radio value="card" className="w-full">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-credit-card text-blue-500"></i>
                  </div>
                  <div>
                    <p className="font-medium">Thẻ tín dụng/ghi nợ</p>
                    <p className="text-gray-500 text-sm">Visa, Mastercard, JCB</p>
                  </div>
                </div>
              </Radio>
            </div>

            {/* Ví điện tử */}
            <div className={`border rounded-lg p-4 ${paymentMethod === "ewallet" ? "border-blue-500" : "border-gray-200"}`}>
              <Radio value="ewallet" className="w-full">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-wallet text-purple-500"></i>
                  </div>
                  <div>
                    <p className="font-medium">Ví điện tử</p>
                    <p className="text-gray-500 text-sm">MoMo, ZaloPay, VNPay</p>
                  </div>
                </div>
              </Radio>
            </div>

            {/* Chuyển khoản ngân hàng */}
            <div className={`border rounded-lg p-4 ${paymentMethod === "bank" ? "border-blue-500" : "border-gray-200"}`}>
              <Radio value="bank" className="w-full">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-university text-green-500"></i>
                  </div>
                  <div>
                    <p className="font-medium">Chuyển khoản ngân hàng</p>
                    <p className="text-gray-500 text-sm">Vietcombank, Techcombank, BIDV</p>
                  </div>
                </div>
              </Radio>
            </div>

            {/* Thanh toán khi nhận hàng */}
            <div className={`border rounded-lg p-4 ${paymentMethod === "cod" ? "border-blue-500" : "border-gray-200"}`}>
              <Radio value="cod" className="w-full">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-truck text-orange-500"></i>
                  </div>
                  <div>
                    <p className="font-medium">Thanh toán khi nhận hàng</p>
                    <p className="text-gray-500 text-sm">Tiền mặt, Quẹt thẻ</p>
                  </div>
                </div>
              </Radio>
            </div>
          </div>
        </Radio.Group>
      )}

      {/* Phương thức thanh toán trả góp */}
      {paymentType === "installment" && (
        <>
          <div className="mb-4">
            <label className="block text-lg font-medium">Chọn ngân hàng</label>
            <Select
              placeholder="Chọn ngân hàng"
              style={{ width: "100%" }}
              onChange={handleInstallmentBankChange} // ĐÃ SỬA: Dùng hàm mới cho Select
              value={installmentBank} // Gắn giá trị vào state mới
            >
              <Option value="bank1">Vietcombank</Option>
              <Option value="bank2">Techcombank</Option>
              <Option value="bank3">BIDV</Option>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">Kỳ hạn trả góp</label>
            <Radio.Group onChange={handleInstallmentDurationChange} value={installmentDuration} className="w-full">
              <Radio value="3">3 tháng</Radio>
              <Radio value="6">6 tháng</Radio>
              <Radio value="12">12 tháng</Radio>
            </Radio.Group>
          </div>

          {/* Bảng tính trả góp */}
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-3">Bảng tính Trả góp</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Kỳ hạn</th>
                  <th className="px-4 py-2 text-right">Trả trước</th>
                  <th className="px-4 py-2 text-right">Góp mỗi tháng</th>
                  <th className="px-4 py-2 text-right">Lãi suất</th>
                  <th className="px-4 py-2 text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">3 tháng</td>
                  <td className="px-4 py-2 text-right">6.598.000</td>
                  <td className="px-4 py-2 text-right">8.863.313</td>
                  <td className="px-4 py-2 text-right">1.12%</td>
                  <td className="px-4 py-2 text-right">33.000.000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">6 tháng</td>
                  <td className="px-4 py-2 text-right">6.598.000</td>
                  <td className="px-4 py-2 text-right">4.531.657</td>
                  <td className="px-4 py-2 text-right">1.2%</td>
                  <td className="px-4 py-2 text-right">33.000.000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">12 tháng</td>
                  <td className="px-4 py-2 text-right">6.598.000</td>
                  <td className="px-4 py-2 text-right">2.365.283</td>
                  <td className="px-4 py-2 text-right">1.8%</td>
                  <td className="px-4 py-2 text-right">34.000.000</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">
              * Lãi suất và số tiền góp hàng tháng có thể thay đổi tùy theo chính sách của ngân hàng<br />
              * Số tiền trả trước tối thiểu 20% giá trị sản phẩm
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentMethod;