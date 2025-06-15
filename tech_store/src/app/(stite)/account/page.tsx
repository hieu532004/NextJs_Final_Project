

'use client';

import { useState, useEffect } from 'react';
import { Tabs, Form, Input, Button, Empty } from 'antd';
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
  ShoppingCartOutlined,
  DollarOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import Header from '@/app/components/Header';
import { useAuth } from '@/app/contexts/authContext';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';
import { Order, User } from '@/app/types';
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
  mapPaymentMethod,
} from "@/app/components/OrderUltils";

import '@ant-design/v5-patch-for-react-19';



const UserAccount = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [profileForm] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const { user: loggedInUser, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;


  const sortedOrders = [...orders].sort((a, b) =>
    new Date(b.orderDate ?? 0).getTime() - new Date(a.orderDate ?? 0).getTime()
  );
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(orders.length / pageSize);


  const router = useRouter();

  useEffect(() => {
    if (!loggedInUser || !loggedInUser.id) return; // 🛑 Chặn nếu chưa có ID

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/orders?userid=${loggedInUser.id}`
        );
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
      }
    };

    fetchOrders();
  }, [loggedInUser, profileForm]);


  if (!loggedInUser) {
    return <div>Đang chuyển hướng... bạn phải đăng nhập trước</div>;
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
    <div>
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-3 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mr-8 ring-4 ring-blue-50">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20portrait%20photo%20of%20a%20young%20Asian%20woman%20with%20shoulder-length%20black%20hair%2C%20neutral%20expression%2C%20clean%20background%2C%20high%20quality%20professional%20headshot%2C%20soft%20lighting%2C%20modern%20style%2C%20professional%20appearance&width=200&height=200&seq=5&orientation=squarish"
                  alt="Avatar"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {loggedInUser?.name}
                </h1>
                <p className="text-gray-600 flex items-center">
                  <i className="fas fa-envelope mr-2"></i>{loggedInUser?.email}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  <i className="fas fa-phone mr-2"></i>{loggedInUser?.phone}
                </p>
              </div>
            </div>
            <div
              className="!rounded-button whitespace-nowrap cursor-pointer text-red-500 hover:bg-red-100 hover:text-red-700 border-red-100"
            >

              <button onClick={handleLogout}> <i className="fas fa-sign-out-alt mr-2"></i>Đăng xuất</button>
            </div>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="bg-white rounded-lg shadow-md "
          items={[
            {
              key: "profile",
              label: (
                <span>
                  <UserOutlined className="mr-2 ml-2" />
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
              children: (() => {


                return (
                  <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <ShoppingOutlined className="text-blue-500 mr-3" />
                        Đơn hàng của tôi
                      </h2>
                    </div>

                    {sortedOrders.length > 0 ? (
                      <div className="space-y-4">
                        {paginatedOrders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="p-2 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center flex-wrap gap-4">
                                  <span className="font-medium text-gray-700">
                                    Mã đơn hàng: <span className="text-gray-900">{order.id}</span>
                                  </span>
                                  <span className="text-gray-400">|</span>
                                  <span className="text-gray-600">
                                    {order.orderDate
                                      ? new Date(order.orderDate).toLocaleString("vi-VN", {
                                        timeZone: "Asia/Ho_Chi_Minh"
                                      })
                                      : "N/A"}
                                  </span>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}
                                >
                                  {getStatusIcon(order.status)}
                                  {getStatusText(order.status)}
                                </span>
                              </div>
                            </div>

                            <div className="p-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="mb-3 flex items-start">
                                    <UserOutlined className="text-gray-500 mt-1 mr-2" />
                                    <div>
                                      <p className="text-gray-600 font-medium">Người nhận:</p>
                                      <p className="text-gray-800">{order.fullName}</p>
                                      <p className="text-gray-600 font-medium mt-2">SĐT: {order.phone}</p>
                                      <p className="text-gray-600">Email: {order.email}</p>
                                    </div>
                                  </div>
                                  <div className=" flex items-start">
                                    <EnvironmentOutlined className="text-gray-500 mt-1 mr-2" />
                                    <div>
                                      <p className="text-gray-600 font-medium">Địa chỉ:</p>
                                      <p className="text-gray-800">
                                        {order.detailAddress}, {order.commune_name}, {order.district_name}, {order.city_name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="mb-3 flex items-start">
                                    <CreditCardOutlined className="text-blue-500 mt-1 mr-2" />
                                    <div>
                                      <p className="text-gray-600 font-medium">Phương thức thanh toán:</p>
                                      <p className="text-gray-800">{mapPaymentMethod(order.paymentMethod)}</p>
                                    </div>
                                  </div>
                                  <div className="mb-3 flex items-start">
                                    <DollarOutlined className="text-D-500 mt-1 mr-2" />
                                    <div>
                                      <p className="text-gray-600 font-medium">Tổng tiền:</p>
                                      <p className="text-gray-800 font-semibold">
                                        {(order.totalAmount || 0).toLocaleString()}đ
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Sản phẩm */}
                              <div className="mt-4 pt-2 border-t border-gray-200">
                                <h3 className="text-gray-700 font-medium mb-3 flex items-center">
                                  {/* <ShoppingCartOutlined className="mr-2" /> */}
                                  <ShoppingCartOutlined className="text-blue-00 mr-2 text-lg" />
                                  Sản phẩm:
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {order.orderItems.map((item, idx) => (
                                    <div
                                      key={item.productId || idx}
                                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                                        <img
                                          src={item.imageUrl || "/placeholder.png"}
                                          alt={item.name}
                                          className="w-full h-full object-cover object-top"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-gray-800 font-medium">{item.name}</h4>
                                        <div className="flex items-center justify-between mt-2">
                                          <span className="text-gray-600">Số lượng: {item.quantity}</span>
                                          <span className="text-red-600 font-semibold">
                                            {(item.pricePerUnit || 0).toLocaleString()}đ
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Empty
                        description="Không có đơn hàng nào"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    )}


                    {orders.length > pageSize && (
                      <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`w-9 h-9 rounded-md text-sm font-medium ${currentPage === index + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                              }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })()
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


      </div>
      <Footer />
    </div>
  );
};

export default UserAccount;