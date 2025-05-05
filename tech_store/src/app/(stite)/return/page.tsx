'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function ReturnPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Header searchValue="" setSearchValue={() => {}} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent text-center">
                    Chính Sách Đổi Trả
                </h1>
                <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <p className="text-gray-800 text-lg mb-6 leading-relaxed">
                        Tại <span className="font-semibold text-blue-600">TechStore</span>, chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng. Chính sách đổi trả của chúng tôi được thiết kế để đảm bảo quyền lợi của bạn trong các trường hợp cần thiết.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Điều kiện đổi trả:</h2>
                    <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-3">
                        <li>Sản phẩm còn nguyên seal, chưa qua sử dụng.</li>
                        <li>Có đầy đủ hóa đơn mua hàng và phiếu bảo hành.</li>
                        <li>Lỗi do nhà sản xuất (không áp dụng cho lỗi do người dùng).</li>
                    </ul>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Quy trình đổi trả:</h2>
                    <ol className="list-decimal pl-6 text-gray-700 mb-6 space-y-3">
                        <li>Liên hệ với bộ phận chăm sóc khách hàng qua hotline hoặc email.</li>
                        <li>Cung cấp thông tin sản phẩm và lý do đổi trả.</li>
                        <li>Gửi sản phẩm về địa chỉ được cung cấp sau khi xác nhận.</li>
                        <li>Chờ xử lý trong vòng 3-5 ngày làm việc.</li>
                    </ol>
                    <p className="text-gray-700 mb-6">
                        Phí vận chuyển đổi trả sẽ do khách hàng chịu nếu lỗi phát sinh từ phía người dùng. Nếu lỗi thuộc về nhà sản xuất, chúng tôi sẽ hỗ trợ toàn bộ chi phí.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <p className="text-gray-600 italic">
                            <strong>Lưu ý:</strong> Sản phẩm đã mở seal hoặc hết thời gian 7 ngày kể từ ngày nhận hàng sẽ không được đổi trả.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}