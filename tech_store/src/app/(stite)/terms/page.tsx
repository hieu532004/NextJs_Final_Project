'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <Header searchValue="" setSearchValue={() => {}} />
            <main className="flex-grow container mx-auto px-6 py-12">
                <h1 className="text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
                    Điều Khoản Sử Dụng
                </h1>
                <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <p className="text-gray-800 text-lg mb-6 leading-relaxed">
                        Chào mừng bạn đến với TechStore! Khi sử dụng website của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây. Vui lòng đọc kỹ để đảm bảo bạn hiểu rõ quyền và trách nhiệm của mình.
                    </p>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">1. Quyền và Trách Nhiệm Người Dùng</h2>
                    <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-3">
                        <li>Sử dụng tài khoản cá nhân đúng mục đích, không vi phạm pháp luật hoặc đạo đức xã hội.</li>
                        <li>Không sao chép, tái sử dụng nội dung hoặc hình ảnh trên website mà không có sự cho phép bằng văn bản từ TechStore.</li>
                        <li>Chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.</li>
                    </ul>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">2. Quyền Hạn của TechStore</h2>
                    <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-3">
                        <li>TechStore có quyền tạm ngưng hoặc chấm dứt tài khoản nếu phát hiện hành vi gian lận hoặc vi phạm điều khoản.</li>
                        <li>Chúng tôi có quyền thay đổi, cập nhật nội dung website mà không cần thông báo trước.</li>
                        <li>TechStore không chịu trách nhiệm cho các thiệt hại phát sinh từ việc sử dụng dịch vụ không đúng cách.</li>
                    </ul>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">3. Chính Sách Bảo Mật</h2>
                    <p className="text-gray-700 mb-6">
                        Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Mọi thông tin thu thập sẽ được sử dụng theo chính sách bảo mật của TechStore.
                    </p>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">4. Thay Đổi Điều Khoản</h2>
                    <p className="text-gray-700 mb-6">
                        Các điều khoản này có thể thay đổi mà không cần thông báo trước. Vui lòng kiểm tra định kỳ để cập nhật thông tin mới nhất.
                    </p>
                    <p className="text-gray-600 italic text-center">
                        Lưu ý: Việc vi phạm các điều khoản có thể dẫn đến chấm dứt quyền sử dụng dịch vụ mà không hoàn lại bất kỳ khoản phí nào.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}