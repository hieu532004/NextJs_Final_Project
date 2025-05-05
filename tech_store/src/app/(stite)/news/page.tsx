'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function NewsPage() {
    const articles = [
        {
            title: 'AI Thay Đổi Thế Giới',
            description: 'Khám phá cách trí tuệ nhân tạo đang định hình tương lai công nghệ.',
            image: 'https://th.bing.com/th/id/R.6e2c1b6b1b5933cf5df7ae2068917a34?rik=l8JoxJKSllqS4g&pid=ImgRaw&r=0',
            link: '#',
        },
        {
            title: 'Công Nghệ 5G',
            description: 'Tìm hiểu về mạng 5G và cách nó thay đổi cách chúng ta kết nối.',
            image: 'https://mega.com.vn/media/news/2605_hinh-nen-cong-nghe-pc23.jpg',
            link: '#',
        },
        {
            title: 'Blockchain và Tương Lai',
            description: 'Blockchain không chỉ là tiền điện tử, mà còn là tương lai của bảo mật.',
            image: 'https://urbancrypto.com/wp-content/uploads/2017/05/bigstock-155864759.jpg',
            link: '#',
        },
        // Thêm các bài viết khác
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header searchValue="" setSearchValue={() => {}} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
                    Tin Tức Công Nghệ
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                                {article.title}
                            </h2>
                            <p className="text-gray-600 mb-4">{article.description}</p>
                            <a
                                href={article.link}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Đọc thêm
                            </a>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}