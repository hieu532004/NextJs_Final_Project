
'use client';

import React, { useState } from 'react';
import { Modal, Button, Form, Input, Checkbox, Divider } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, CloseOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Notification from '../components/Notification';
import { useAuth } from '../contexts/authContext';

interface LoginModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onShowRegister: () => void;
    onLoginSuccess?: () => void; // Thêm dòng này
}

const LoginModal: React.FC<LoginModalProps> = ({ isVisible, onCancel, onShowRegister, onLoginSuccess }) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [notificationData, setNotificationData] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    } | null>(null);
    const { login } = useAuth();

    const handleFinish = async (values: any) => {
        setLoading(true);
        setNotificationData(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/users`);
            if (!response.ok) {
                let errorMessage = `Lỗi HTTP! Trạng thái: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (parseError) {
                    console.error('Lỗi khi parse lỗi JSON:', parseError);
                }
                setNotificationData({ message: errorMessage, type: 'error' });
                return;
            }
            const users = await response.json();

            const loggedInUser = users.find(
                (user: any) =>
                    (user.email === values.email || user.phone === values.email) &&
                    user.password === values.password
            );

            if (loggedInUser) {
                setNotificationData({ message: 'Đăng nhập thành công! ', type: 'success' });
                login(loggedInUser);
                form.resetFields();
                setTimeout(() => {
                    onCancel();
                    if (onLoginSuccess) onLoginSuccess(); // Gọi callback nếu có
                }, 1500); 
            } else {
                const userExistsByEmailOrPhone = users.some(
                    (user: any) => user.email === values.email || user.phone === values.email
                );

                if (userExistsByEmailOrPhone) {
                    setNotificationData({ message: 'Mật khẩu không đúng. Vui lòng thử lại.', type: 'error' });
                } else {
                    setNotificationData({ message: 'Email/Số điện thoại không tồn tại trong hệ thống.', type: 'error' });
                }
            }
        } catch (error: any) {
            console.error('Lỗi đăng nhập:', error);
            setNotificationData({ message: 'Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseNotification = () => {
        setNotificationData(null);
    };

    return (
        <Modal
            title={
                <div className="flex justify-between items-center">
                    <span className="text-xl font-medium">Đăng nhập</span>
                    <CloseOutlined
                        onClick={onCancel}
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                    />
                </div>
            }
            open={isVisible}
            onCancel={onCancel}
            footer={null}
            closable={false}
            className="max-w-md w-full mx-auto"
            maskClosable={true}
            centered
        >
            <Form
                form={form}
                name="login_form"
                layout="vertical"
                onFinish={handleFinish}
                autoComplete="off"
                className="mt-4"
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email hoặc số điện thoại!',
                        },
                        {
                            type: 'email',
                            message: 'Định dạng email không hợp lệ!',
                        },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined className="site-form-item-icon text-gray-400 mr-2" />}
                        placeholder="Email hoặc số điện thoại"
                        size="large"
                        className="rounded-md"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon text-gray-400 mr-2" />}
                        placeholder="Mật khẩu"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        size="large"
                        className="rounded-md"
                    />
                </Form.Item>

                <div className="flex justify-between items-center mb-4">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <a className="text-blue-600 hover:text-blue-800 text-sm">Quên mật khẩu?</a>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        className="bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap cursor-pointer"
                        loading={loading}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>

                {notificationData && (
                    <div className="mt-2">
                        <Notification
                            message={notificationData.message}
                            type={notificationData.type || 'info'}
                            onClose={handleCloseNotification}
                            isInline={true}
                        />
                    </div>
                )}
            </Form>

            <Divider plain>hoặc</Divider>
            <div className="text-center">
                Chưa có tài khoản?{' '}
                <a className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={onShowRegister}>
                    Đăng ký ngay!
                </a>
            </div>
        </Modal>
    );
};

export default LoginModal;