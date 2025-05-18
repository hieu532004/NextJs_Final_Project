'use client';

import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header searchValue="" setSearchValue={() => {}} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
                        Về Chúng Tôi
                    </h1>
                    <p className="text-gray-700 mb-6">
                        TechStore là đơn vị hàng đầu trong lĩnh vực cung cấp các sản phẩm công nghệ chính hãng tại Việt Nam. Với sứ mệnh mang đến trải nghiệm mua sắm hiện đại và đáng tin cậy, chúng tôi cam kết cung cấp sản phẩm chất lượng cao với giá cả cạnh tranh.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="relative w-full h-40 mb-4">
                                <Image
                                    src="https://jobsgo.vn/blog/wp-content/uploads/2022/08/su-menh-la-gi.jpg"
                                    alt="Sứ mệnh"
                                    fill
                                    className="object-cover rounded-lg"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Sứ mệnh</h2>
                            <p className="text-gray-600">Đem công nghệ tiên tiến đến mọi nhà với dịch vụ tận tâm.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="relative w-full h-40 mb-4">
                                <Image
                                    src="https://www.ellisbates.com/wp-content/uploads/2019/04/ISA-planning.png"
                                    alt="Tầm nhìn"
                                    fill
                                    className="object-cover rounded-lg"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Tầm nhìn</h2>
                            <p className="text-gray-600">Trở thành thương hiệu công nghệ hàng đầu tại khu vực Đông Nam Á.</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <a
                            href="/contact"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Liên hệ với chúng tôi
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
