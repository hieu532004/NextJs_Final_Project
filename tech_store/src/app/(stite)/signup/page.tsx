"use client"

import Link from "next/link"
import { Button, Form, Input, Card } from "antd"
import Footer from '@/app/components/Footer';

export default function SignupForm() {
  const onFinish = (values: any) => {
    console.log("Success:", values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <Card title="Đăng ký" style={{ width: 400, justifyContent: "", alignItems: "center", margin: "auto"}}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    label="Tên đang nhập"
                    name="username"
                    rules={[{ required: true, message: "Please input your username!" }]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập e-mail!" }]}>
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu!" }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Đăng ký
                    </Button>
                    </Form.Item>
                </Form>
                <div className="text-center">
                    <Link href="/login">Đã có tài khoản?</Link>
                </div>
                </Card>
            </div>
        </main>
        <Footer />
    </div>
  )
}
