'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Drawer, Spin } from 'antd';
import { CustomerServiceOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

interface Product {
  _id: string;
  id: number;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  slug: string;
  discount: number;
  isNew: boolean;
}

const SupportWidget: React.FC = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; link?: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState<number | string>(400); // State for drawer width

  // Set drawer width based on window size (client-side only)
  useEffect(() => {
    const updateDrawerWidth = () => {
      setDrawerWidth(window.innerWidth < 640 ? '100%' : 400);
    };

    // Set initial width
    updateDrawerWidth();

    // Update width on resize
    window.addEventListener('resize', updateDrawerWidth);
    return () => window.removeEventListener('resize', updateDrawerWidth);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`);
        setProducts(response.data.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Chatbot logic
  const chatbotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let link: string | undefined;

    if (lowerMessage.includes('tìm') || lowerMessage.includes('sản phẩm')) {
      const searchTerm = lowerMessage.replace(/tìm|sản phẩm/gi, '').trim();
      const foundProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
      if (foundProducts.length > 0) {
        response = `Dưới đây là sản phẩm phù hợp:\n`;
        foundProducts.slice(0, 3).forEach((product) => {
          response += `- ${product.name} - ${product.salePrice.toLocaleString('vi-VN')}đ `;
          link = `/products/${product.slug}`;
        });
      } else {
        response = 'Rất tiếc, mình không tìm thấy sản phẩm nào. Bạn có thể thử từ khóa khác hoặc xem tất cả sản phẩm tại ';
        link = '/products';
      }
    } else if (lowerMessage.includes('giá') || lowerMessage.includes('bao nhiêu')) {
      const searchTerm = lowerMessage.replace(/giá|bao nhiêu/gi, '').trim();
      const product = products.find((p) => p.name.toLowerCase().includes(searchTerm));
      if (product) {
        response = `${product.name} có giá ${product.salePrice.toLocaleString('vi-VN')}đ. Xem chi tiết tại: `;
        link = `/products/${product.slug}`;
      } else {
        response = 'Vui lòng cung cấp tên sản phẩm để mình kiểm tra giá. Hoặc xem tại ';
        link = '/products';
      }
    } else if (lowerMessage.includes('giao hàng') || lowerMessage.includes('vận chuyển')) {
      response = 'Giao hàng miễn phí cho đơn từ 2 triệu VNĐ trong nội thành Đà Nẵng, phí 20.000 VNĐ - 50.000 VNĐ tùy khu vực. Xem chi tiết tại 8 tại ';
      link = '/shipping';
    } else if (lowerMessage.includes('bảo hành')) {
      response = 'Sản phẩm được bảo hành 12-24 tháng. Xem chi tiết tại ';
      link = '/warranty';
    } else if (lowerMessage.includes('đổi trả')) {
      response = 'Chính sách đổi trả trong 7 ngày nếu còn nguyên seal. Xem chi tiết tại ';
      link = '/return';
    } else if (lowerMessage.includes('khuyến mãi')) {
      response = 'Khám phá các ưu đãi tại ';
      link = '/promotions';
    } else if (lowerMessage.includes('liên hệ')) {
      response = 'Liên hệ qua hotline 1900 1234 hoặc email info@techstore.vn. Hoặc nhắn trực tiếp tại ';
      link = '/contact';
    } else if (lowerMessage.includes('chào') || lowerMessage.includes('hi')) {
      response = 'Chào bạn! Mình là chatbot của TechStore. Bạn cần hỗ trợ gì? (Tìm sản phẩm, giá, vận chuyển, v.v.)';
    } else {
      response = 'Mình chưa hiểu rõ. Bạn có thể hỏi: "Tìm sản phẩm X", "Giá sản phẩm Y", hoặc "Chính sách vận chuyển"? Hoặc kết nối nhân viên tại ';
      link = '/contact';
    }

    return { text: response, link };
  };

  const toggleChat = () => {
    setChatVisible(!chatVisible);
    if (!chatVisible && messages.length === 0) {
      setMessages([{ sender: 'bot', text: 'Chào bạn! Mình là chatbot của TechStore. Bạn cần hỗ trợ gì?' }]);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages([...messages, { sender: 'user', text: inputMessage }]);

    setTimeout(() => {
      const { text, link } = chatbotResponse(inputMessage);
      setMessages((prev) => [...prev, { sender: 'bot', text, link }]);
    }, 500);

    setInputMessage('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
        <Button
          type="primary"
          shape="circle"
          icon={<CustomerServiceOutlined />}
          size="large"
          className="bg-blue-600 hover:bg-blue-700 w-14 h-14 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110"
          onClick={toggleChat}
        />

        <a
          href="https://zalo.me/0347854097"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110"
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
            alt="Zalo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </a>

        {isScrolled && (
          <Button
            shape="circle"
            icon={<ArrowUpOutlined />}
            size="large"
            className="bg-gray-700 text-white hover:bg-gray-800 w-14 h-14 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110"
            onClick={scrollToTop}
          />
        )}
      </div>

      <Drawer
        title="Chat với TechStore"
        placement="right"
        onClose={toggleChat}
        open={chatVisible}
        width={drawerWidth} // Use state variable
        className="sm:!rounded-l-lg"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg mb-4 space-y-3">
            {loading ? (
              <div className="flex justify-center">
                <Spin size="large" />
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    {msg.text}
                    {msg.link && (
                      <Link href={msg.link} className="text-blue-500 hover:underline ml-1">
                        (Xem thêm)
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Nhập tin nhắn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onPressEnter={sendMessage}
              className="flex-1 rounded-lg"
              disabled={loading}
            />
            <Button
              type="primary"
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg"
              disabled={loading}
            >
              Gửi
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default SupportWidget;