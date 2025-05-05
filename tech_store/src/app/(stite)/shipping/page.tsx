'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function ShippingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Header searchValue="" setSearchValue={() => {}} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
                    Chính Sách Vận Chuyển
                </h1>
                <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        Tại TechStore, chúng tôi cam kết mang đến dịch vụ vận chuyển nhanh chóng, an toàn và tiện lợi nhất cho khách hàng trên toàn quốc. Dưới đây là các thông tin chi tiết về chính sách vận chuyển:
                    </p>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Phí Vận Chuyển</h2>
                        <ul className="list-disc pl-6 text-gray-700 space-y-3">
                            <li>Giao hàng miễn phí cho đơn hàng từ <strong>2 triệu VNĐ</strong> trong nội thành Đà Nẵng.</li>
                            <li>Phí vận chuyển từ <strong>20.000 VNĐ</strong> đến <strong>50.000 VNĐ</strong> tùy khu vực (xem chi tiết tại bước thanh toán).</li>
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Thời Gian Giao Hàng</h2>
                        <ul className="list-disc pl-6 text-gray-700 space-y-3">
                            <li><strong>1-3 ngày làm việc</strong> đối với khu vực nội thành.</li>
                            <li><strong>3-7 ngày làm việc</strong> đối với khu vực ngoại tỉnh.</li>
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Theo Dõi Đơn Hàng</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Sau khi đặt hàng, bạn sẽ nhận được mã vận đơn qua email hoặc tin nhắn. Sử dụng mã này để theo dõi trạng thái đơn hàng của bạn trên hệ thống của các đơn vị vận chuyển đối tác như <strong>GHTK</strong> và <strong>Viettel Post</strong>.
                        </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-600 italic">
                            <strong>Lưu ý:</strong> Thời gian giao hàng có thể thay đổi do các yếu tố khách quan như thời tiết, thiên tai, hoặc khu vực khó tiếp cận. Chúng tôi sẽ thông báo sớm nhất nếu có sự cố xảy ra.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}