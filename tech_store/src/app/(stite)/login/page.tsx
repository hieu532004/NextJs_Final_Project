"use client"

import Link from "next/link"
import { Button, Form, Input, Card } from "antd"
import Footer from '@/app/components/Footer';

export default function LoginForm() {
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
            <Card title="Đăng nhập" style={{ width: 400, justifyContent: "center", alignItems: "center", margin: "auto" }}>
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item label="Email" name="email" rules={[{ required: true, message: "Hãy nhập e-mail" }]}>
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
              <div className="text-center">
                <Link href="/signup">Tạo tài khoản mới</Link>
              </div>
            </Card>
          </div>
        </main>
      <Footer />
    </div>
  )
}
