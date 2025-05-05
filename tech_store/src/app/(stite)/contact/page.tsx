'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Button, Input } from 'antd';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
            <Header searchValue="" setSearchValue={() => {}} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8 bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
                    Liên Hệ Với Chúng Tôi
                </h1>
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-xl">
                        <p className="text-lg text-gray-700 mb-6 text-center">
                            Nếu bạn có bất kỳ câu hỏi nào, hãy để lại tin nhắn. Chúng tôi sẽ phản hồi sớm nhất có thể!
                        </p>
                        <form className="space-y-6">
                            <Input
                                size="large"
                                placeholder="Họ và tên"
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Input
                                size="large"
                                placeholder="Email"
                                type="email"
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Input.TextArea
                                rows={5}
                                placeholder="Tin nhắn của bạn"
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Button
                                type="primary"
                                size="large"
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                            >
                                Gửi Tin Nhắn
                            </Button>
                        </form>
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-gray-700 text-lg mb-2">
                            Hoặc liên hệ trực tiếp qua:
                        </p>
                        <p className="text-gray-900 text-lg flex items-center justify-center gap-2">
                            <MailOutlined className="text-blue-500" />
                            <a
                                href="mailto:info@techstore.vn"
                                className="text-blue-600 hover:underline"
                            >
                                info@techstore.vn
                            </a>
                        </p>
                        <p className="text-gray-900 text-lg flex items-center justify-center gap-2 mt-2">
                            <PhoneOutlined className="text-blue-500" />
                            <span>Hotline: 1900 1234</span>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}