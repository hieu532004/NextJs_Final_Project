

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

const { TabPane } = Tabs;



const UserAccount = () => {
    const [activeTab, setActiveTab] = useState<string>('profile');
    const [profileForm] = Form.useForm();
    const [searchValue, setSearchValue] = useState('');
    const { user: loggedInUser, logout } = useAuth(); // Lấy hàm updateUser
    const router = useRouter();

    useEffect(() => {
        if (!loggedInUser) {
            router.push('/'); // Redirect to login page if not logged in
        } else {
            // Set initial values for the form if loggedInUser exists
            profileForm.setFieldsValue({
                name: loggedInUser.name,
                email: loggedInUser.email,
                phone: loggedInUser.phone,
                address: loggedInUser.address,
                birthDate: loggedInUser.birthDate,
                gender: loggedInUser.gender,
                // Đặt các giá trị ban đầu khác nếu cần
            });
        }
    }, [loggedInUser, router, profileForm]);

    if (!loggedInUser) {
        return <div>Đang chuyển hướng...</div>;
    }

    const onFinishProfile = (values: any) => {
        console.log('Cập nhật thông tin:', values);

    };

    const handleLogout = () => {
        logout();
        router.push('/'); // Redirect to home page after logout
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
                    <div className='p-4'>
                        <h2 className="text-2xl font-bold text-gray-800">{loggedInUser?.name}</h2>
                        <p className="text-gray-600">{loggedInUser?.email}</p>
                        {loggedInUser?.phone && <p className="text-gray-600">{loggedInUser?.phone}</p>}
                        <Button onClick={handleLogout} className="mt-2">
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab} className="bg-white rounded-lg shadow-md">
                <TabPane tab={<span><UserOutlined className="mr-2" />Thông tin cá nhân</span>} key="profile">
                    <div className="p-6">
                        <Form
                            layout="vertical"
                            form={profileForm}
                            initialValues={loggedInUser} // Giá trị ban đầu được set trong useEffect
                            onFinish={onFinishProfile}
                        >
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
                                <Input prefix={loggedInUser?.gender === 'male' ? <ManOutlined /> : <WomanOutlined />} />
                            </Form.Item>
                            {/* Thêm các Form.Item khác cho các trường bạn muốn người dùng có thể cập nhật */}
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-blue-600 hover:bg-blue-700 !rounded-button"
                                >
                                    Cập nhật thông tin
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </TabPane>
                <TabPane tab={<span><ShoppingOutlined className="mr-2" />Đơn hàng của tôi</span>} key="orders">
                    <div className="p-6">
                        {/* Nội dung tab đơn hàng */}
                        <p>Chức năng đơn hàng sẽ được phát triển sau.</p>
                    </div>
                </TabPane>
                <TabPane tab={<span><HeartOutlined className="mr-2" />Sản phẩm yêu thích</span>} key="wishlist">
                    <div className="p-6">
                        {/* Nội dung tab sản phẩm yêu thích */}
                        <p>Chức năng sản phẩm yêu thích sẽ được phát triển sau.</p>
                    </div>
                </TabPane>
                <TabPane tab={<span><BellOutlined className="mr-2" />Thông báo</span>} key="notifications">
                    <div className="p-6">
                        {/* Nội dung tab thông báo */}
                        <p>Chức năng thông báo sẽ được phát triển sau.</p>
                    </div>
                </TabPane>
            </Tabs>
            <Footer />
        </div>
    );
};

export default UserAccount;