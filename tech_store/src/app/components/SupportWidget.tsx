"use client"

import { useEffect, useState } from "react"
import { Button, Drawer, Form, Input, Select } from "antd"
import { MessageOutlined } from "@ant-design/icons"

const { Option } = Select
const { TextArea } = Input

const SupportWidget = () => {
  const [isClient, setIsClient] = useState(false)
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  // Sử dụng useEffect để đảm bảo code chỉ chạy ở phía client
  useEffect(() => {
    setIsClient(true)
    // Bất kỳ code nào sử dụng window đều nên đặt trong useEffect
    const handleBeforeUnload = () => {
      // Xử lý trước khi người dùng rời trang (nếu cần)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const onFinish = (values: any) => {
    console.log("Form values:", values)
    // Xử lý gửi form hỗ trợ
    form.resetFields()
    setVisible(false)
  }

  // Nếu không phải client, không render gì cả hoặc render placeholder
  if (!isClient) {
    return null // hoặc return một placeholder loading
  }

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        size="large"
        onClick={showDrawer}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          width: "60px",
          height: "60px",
        }}
      />
      <Drawer title="Hỗ trợ khách hàng" placement="right" onClose={onClose} open={visible} width={400}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
            <Input placeholder="Nhập họ và tên của bạn" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại của bạn" />
          </Form.Item>
          <Form.Item name="issue" label="Vấn đề" rules={[{ required: true, message: "Vui lòng chọn vấn đề!" }]}>
            <Select placeholder="Chọn vấn đề của bạn">
              <Option value="order">Đơn hàng</Option>
              <Option value="product">Sản phẩm</Option>
              <Option value="shipping">Vận chuyển</Option>
              <Option value="payment">Thanh toán</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item name="message" label="Nội dung" rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}>
            <TextArea rows={4} placeholder="Mô tả chi tiết vấn đề của bạn" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default SupportWidget
