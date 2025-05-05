'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { FaCheckCircle, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function WarrantyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <Header searchValue="" setSearchValue={() => {}} />
            <main className="flex-grow container mx-auto px-6 py-12">
                <h1 className="text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
                    Chính Sách Bảo Hành
                </h1>
                <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <p className="text-gray-700 text-lg mb-6">
                        Tại <span className="font-semibold text-blue-600">TechStore</span>, chúng tôi cam kết mang đến cho khách hàng dịch vụ bảo hành tốt nhất. Tất cả sản phẩm đều được bảo hành chính hãng từ <span className="font-semibold">12 đến 24 tháng</span>, tùy thuộc vào thương hiệu và loại sản phẩm.
                    </p>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cam Kết Bảo Hành</h2>
                        <ul className="list-none space-y-4">
                            <li className="flex items-start">
                                <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                                <span className="text-gray-700">
                                    Bảo hành tại các trung tâm được ủy quyền bởi nhà sản xuất.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                                <span className="text-gray-700">
                                    Thay thế linh kiện miễn phí nếu lỗi từ nhà sản xuất trong thời gian bảo hành.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                                <span className="text-gray-700">
                                    Hỗ trợ kỹ thuật 24/7 qua hotline hoặc email.
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hỗ Trợ Liên Hệ</h2>
                        <div className="flex items-center mb-3">
                            <FaPhoneAlt className="text-blue-600 mr-3" />
                            <span className="text-gray-700">Hotline: <span className="font-semibold">1900 1234</span></span>
                        </div>
                        <div className="flex items-center">
                            <FaEnvelope className="text-blue-600 mr-3" />
                            <span className="text-gray-700">Email: <span className="font-semibold">info@techstore.vn</span></span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Điều Kiện Bảo Hành</h2>
                        <p className="text-gray-700 mb-4">
                            Để được bảo hành, khách hàng cần giữ hóa đơn mua hàng và phiếu bảo hành đi kèm. Thời gian xử lý bảo hành thường từ <span className="font-semibold">3-7 ngày làm việc</span>, tùy thuộc vào tình trạng sản phẩm.
                        </p>
                        <p className="text-gray-600 italic">
                            Lưu ý: Sản phẩm bị hư hỏng do người dùng hoặc sử dụng không đúng cách sẽ không được bảo hành.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}