


import { Form, Input } from "antd";
import AddressSelector from "./AddressSelector";


const { TextArea } = Input;

const ShippingInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Thông tin Giao hàng</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Form.Item
          label={<span className="flex items-center"><span className="text-red-500 mr-1">*</span> Họ tên</span>}
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nguyễn Văn A" prefix={<i className="fas fa-user text-gray-400 mr-2" />} className="rounded-lg" />
        </Form.Item>

        <Form.Item
          label={<span className="flex items-center"><span className="text-red-500 mr-1">*</span> Số điện thoại</span>}
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="0912345678" prefix={<i className="fas fa-phone text-gray-400 mr-2" />} className="rounded-lg" />
        </Form.Item>
      </div>

      <div className="mb-4">
        <Form.Item
          label={<span className="flex items-center"><span className="text-red-500 mr-1">*</span> Email</span>}
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
          ]}
        >
          <Input placeholder="example@gmail.com" prefix={<i className="fas fa-envelope text-gray-400 mr-2" />} className="rounded-lg" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <AddressSelector />
      </div>

      <div className="mb-4">
        <Form.Item
          label={<span className="flex items-center"><span className="text-red-500 mr-1">*</span> Địa chỉ chi tiết</span>}
          name="detailAddress"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
        >
          <Input placeholder="Số nhà, tên đường" prefix={<i className="fas fa-home text-gray-400 mr-2" />} className="rounded-lg" />
        </Form.Item>
      </div>

      <div className="mb-4">
        <Form.Item label="Ghi chú đơn hàng" name="note">
          <TextArea placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn." rows={4} className="rounded-lg" />
        </Form.Item>
      </div>
    </div>
  );
};

export default ShippingInfo;
