'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <Header searchValue="" setSearchValue={() => {}} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
                    Chính Sách Bảo Mật
                </h1>
                <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                        TechStore cam kết bảo vệ thông tin cá nhân của khách hàng theo các nguyên tắc sau:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-4 text-lg">
                        <li>
                            <span className="font-semibold">Thu thập thông tin cần thiết:</span> Chỉ thu thập thông tin như tên, email, số điện thoại để phục vụ giao dịch.
                        </li>
                        <li>
                            <span className="font-semibold">Bảo mật dữ liệu:</span> Không chia sẻ dữ liệu với bên thứ ba mà không có sự đồng ý của khách hàng.
                        </li>
                        <li>
                            <span className="font-semibold">Lưu trữ an toàn:</span> Dữ liệu được lưu trữ an toàn với các công nghệ mã hóa hiện đại.
                        </li>
                    </ul>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                        Khách hàng có quyền yêu cầu xóa thông tin cá nhân hoặc cập nhật dữ liệu bằng cách liên hệ qua email{' '}
                        <a href="mailto:info@techstore.vn" className="text-blue-600 hover:underline">
                            info@techstore.vn
                        </a>.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-600 italic">
                            <span className="font-semibold">Lưu ý:</span> Thông tin có thể được lưu trữ trong 5 năm theo quy định pháp luật Việt Nam.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}