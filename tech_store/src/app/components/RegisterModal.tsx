'use client';

import React from 'react';
import { Modal, Button, Form, Input, Checkbox, message } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  CloseOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/app/contexts/authContext';
import { useRouter } from 'next/navigation';
import { User } from '@/app/types'; // Import User type

interface RegisterModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onRegisterSuccess: () => void;
  onShowLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isVisible,
  onCancel,
  onRegisterSuccess,
  onShowLogin,
}) => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const router = useRouter();

  const handleFinish = async (values: any) => {
    try {
      // 1. Lấy danh sách người dùng hiện có (GET /users)
      const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/users`, {
        method: 'GET',
      });

      if (!usersResponse.ok) {
        const errorData = await usersResponse.json();
        const errorMessage = errorData?.message || 'Không thể lấy danh sách người dùng để kiểm tra trùng lặp.';
        message.error(errorMessage);
        return;
      }

      const existingUsers: User[] = await usersResponse.json();

      // 2. Kiểm tra trùng lặp
      const isEmailOrPhoneTaken = existingUsers.some(
        (user) => user.email === values.email || user.phone === values.phone
      );
      const isUsernameTaken = existingUsers.some((user) => user.username === values.username);

      if (isEmailOrPhoneTaken) {
        form.setFields([
          { name: 'email', errors: ['Email hoặc số điện thoại đã tồn tại. Vui lòng sử dụng email hoặc số điện thoại khác.'] },
          { name: 'phone', errors: ['Email hoặc số điện thoại đã tồn tại. Vui lòng sử dụng email hoặc số điện thoại khác.'] },
        ]);
        return;
      }

      if (isUsernameTaken) {
        form.setFields([
          { name: 'username', errors: ['Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.'] },
        ]);
        return;
      }

      // 3. Tạo người dùng mới (POST /users)
      const response = await fetch(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password, // Note: In a real app, hash the password server-side
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || 'Đăng ký thất bại. Vui lòng thử lại sau.';
        message.error(errorMessage);
        return;
      }

      const newUser: User = await response.json(); // Lấy dữ liệu người dùng mới từ response

      login(newUser);
      message.success('Đăng ký thành công!');
      onRegisterSuccess();
      form.resetFields();
      setTimeout(() => {
        router.push('/account');
      }, 1500);
    } catch (error: any) {
      console.error('Lỗi trong quá trình đăng ký:', error);
      message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span className="text-xl font-medium">Đăng ký</span>
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
      className="max-w-md mx-auto"
      maskClosable={true}
      centered
    >
      <Form
        form={form}
        name="register_form"
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
        className="mt-4"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon text-gray-400 mr-2" />}
            placeholder="Tên đăng nhập"
            size="large"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên đầy đủ!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon text-gray-400 mr-2" />}
            placeholder="Họ tên đầy đủ"
            size="large"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon text-gray-400 mr-2" />}
            placeholder="Email"
            size="large"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            {
              pattern: /^[0-9]{10}$/,
              message: 'Số điện thoại không hợp lệ!',
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined className="site-form-item-icon text-gray-400 mr-2" />}
            placeholder="Số điện thoại"
            size="large"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon text-gray-400 mr-2" />}
            placeholder="Mật khẩu"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            size="large"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon text-gray-400 mr-2" />}
            placeholder="Nhập lại mật khẩu"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            size="large"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Vui lòng đồng ý với điều khoản sử dụng!')),
            },
          ]}
        >
          <Checkbox>
            Tôi đồng ý với{' '}
            <a className="text-blue-600 hover:text-blue-800" href="/terms">
              điều khoản sử dụng
            </a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <p className="text-gray-600">
          Đã có tài khoản?{' '}
          <a
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            onClick={onShowLogin}
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </Modal>
  );
};

export default RegisterModal;