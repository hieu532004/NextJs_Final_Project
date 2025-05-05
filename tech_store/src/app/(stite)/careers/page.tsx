'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function CareersPage() {
    const jobPositions = [
        {
            title: 'Nhân Viên Kinh Doanh',
            experience: '1-2 năm',
            salary: '15-20 triệu VNĐ/tháng',
            description: 'Chịu trách nhiệm phát triển khách hàng, tư vấn sản phẩm và dịch vụ.',
            link: '/contact',
        },
        {
            title: 'Nhân Viên Marketing',
            experience: '2-3 năm',
            salary: '20-25 triệu VNĐ/tháng',
            description: 'Lên kế hoạch và triển khai các chiến dịch marketing.',
            link: '/contact',
        },
        {
            title: 'Nhân Viên Kỹ Thuật',
            experience: '1-2 năm',
            salary: '18-22 triệu VNĐ/tháng',
            description: 'Hỗ trợ kỹ thuật và bảo trì hệ thống.',
            link: '/contact',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header searchValue="" setSearchValue={() => {}} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                    Tuyển Dụng
                </h1>
                <p className="text-lg text-gray-700 mb-8 text-center">
                    Chào mừng bạn đến với trang tuyển dụng của chúng tôi! Hãy tham gia cùng chúng tôi để phát triển sự nghiệp của bạn.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobPositions.map((job, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
                            <p className="text-gray-600 mb-2">
                                <strong>Kinh nghiệm:</strong> {job.experience}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>Lương:</strong> {job.salary}
                            </p>
                            <p className="text-gray-600 mb-4">{job.description}</p>
                            <a
                                href={job.link}
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Ứng tuyển ngay
                            </a>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}