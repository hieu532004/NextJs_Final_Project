import { Inter } from 'next/font/google';
import SupportWidget from './components/SupportWidget';
import { CartProvider } from './contexts/CartContext';
import './styles/globals.css';

// Tích hợp font Inter (hoặc font khác nếu bạn muốn)
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'TechStore - Mua sắm công nghệ',
  description: 'Cửa hàng công nghệ với sản phẩm chất lượng cao.',
  viewport: 'width=device-width, initial-scale=1', // Thêm viewport cho responsive
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        {/* Đảm bảo meta tag viewport được thêm nếu metadata không tự động xử lý */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
          <SupportWidget />
        </CartProvider>
      </body>
    </html>
  );
}