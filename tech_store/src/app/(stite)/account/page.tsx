

'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, Tabs, Form, Input, Button } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    ShoppingOutlined,
    HeartOutlined,
    BellOutlined,
    CalendarOutlined,
    HomeOutlined,
    ManOutlined,
    WomanOutlined,
} from '@ant-design/icons';
import Header from '@/app/components/Header';
import { useAuth } from '@/app/contexts/authContext';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';
import { Order, OrderItem, User } from '@/app/types';

const { TabPane } = Tabs;

const UserAccount = () => {
    const [activeTab, setActiveTab] = useState<string>('profile');
    const [profileForm] = Form.useForm();
    const [searchValue, setSearchValue] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const { user: loggedInUser, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loggedInUser) {
            router.push('/');
        } else {
            profileForm.setFieldsValue({
                name: loggedInUser.name,
                email: loggedInUser.email,
                phone: loggedInUser.phone,
                address: loggedInUser.address,
                birthDate: loggedInUser.birthDate,
                gender: loggedInUser.gender,
            });

            const fetchOrders = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/orders?userid=${loggedInUser.id}`);
                    const data = await response.json();
                    setOrders(data);
                } catch (error) {
                    console.error('Lỗi khi lấy đơn hàng:', error);
                }
            };

            fetchOrders();
        }
    }, [loggedInUser, router, profileForm]);

    if (!loggedInUser) {
        return <div>Đang chuyển hướng...</div>;
    }

    const onFinishProfile = (values: User) => {
        console.log('Cập nhật thông tin:', values);
        // TODO: Gửi API cập nhật thông tin người dùng nếu cần
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <Header searchValue={searchValue} setSearchValue={setSearchValue} />

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center space-x-6">
                    <Avatar
                        size={100}
                        src={
                            loggedInUser?.avatar ||
                            'https://anhdep.edu.vn/upload/2024/05/top-99-avatar-anh-gai-xinh-xan-cho-moi-mang-xa-hoi-3.webp'
                        }
                    />
                    <div className="p-4">
                        <h2 className="text-2xl font-bold text-gray-800">{loggedInUser?.name}</h2>
                        <p className="text-gray-600">{loggedInUser?.email}</p>
                        {loggedInUser?.phone && <p className="text-gray-600">{loggedInUser?.phone}</p>}
                        <Button onClick={handleLogout} className="mt-2">Đăng xuất</Button>
                    </div>
                </div>
            </div>

<Tabs
  activeKey={activeTab}
  onChange={setActiveTab}
  className="bg-white rounded-lg shadow-md"
  items={[
    {
      key: "profile",
      label: (
        <span>
          <UserOutlined className="mr-2" />
          Thông tin cá nhân
        </span>
      ),
      children: (
        <div className="p-6">
          <Form layout="vertical" form={profileForm} onFinish={onFinishProfile}>
            <Form.Item label="Họ và tên" name="name">
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input prefix={<MailOutlined />} disabled />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone">
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <Input prefix={<HomeOutlined />} />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="birthDate">
              <Input prefix={<CalendarOutlined />} placeholder="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender">
              <Input
                prefix={
                  loggedInUser?.gender === "male" ? (
                    <ManOutlined />
                  ) : (
                    <WomanOutlined />
                  )
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "orders",
      label: (
        <span>
          <ShoppingOutlined className="mr-2" />
          Đơn hàng của tôi
        </span>
      ),
      children: (
        <div className="p-6">
          {orders.length === 0 ? (
            <p>Không có đơn hàng nào.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order: Order) => (
                <li key={order.id} className="border p-4 rounded-lg shadow-sm">
                  <p>
                    <strong>Mã đơn hàng:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Người nhận:</strong> {order.fullName}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {order.detailAddress}
                  </p>
                  <p>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {order.paymentMethod}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {order.totalAmount ? order.totalAmount.toLocaleString() : "0"}
                    đ
                  </p>
                  <p>
                    <strong>Sản phẩm:</strong>
                  </p>
                  <ul className="pl-4 list-disc">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item: OrderItem, idx: number) => (
                        <li key={idx}>
                          {item.name} x {item.quantity} (
                          {item.pricePerUnit.toLocaleString()}đ)
                        </li>
                      ))
                    ) : (
                      <li>Không có sản phẩm nào trong đơn hàng.</li>
                    )}
                  </ul>
                  {order.orderDate && (
                    <p className="text-gray-500 mt-2">
                      <strong>Ngày đặt hàng:</strong>{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  )}
                  {order.status && (
                    <p className="text-blue-500 mt-1">
                      <strong>Trạng thái:</strong> {order.status}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    {
      key: "wishlist",
      label: (
        <span>
          <HeartOutlined className="mr-2" />
          Sản phẩm yêu thích
        </span>
      ),
      children: (
        <div className="p-6">
          <p>Chức năng sản phẩm yêu thích sẽ được phát triển sau.</p>
        </div>
      ),
    },
    {
      key: "notifications",
      label: (
        <span>
          <BellOutlined className="mr-2" />
          Thông báo
        </span>
      ),
      children: (
        <div className="p-6">
          <p>Chức năng thông báo sẽ được phát triển sau.</p>
        </div>
      ),
    },
  ]}
/>

            <Footer />
        </div>
    );
};

export default UserAccount;