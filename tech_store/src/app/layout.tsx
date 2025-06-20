import { Inter } from 'next/font/google';
import SupportWidget from './components/SupportWidget';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/authContext';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'TechStore - Mua sắm công nghệ',
  description: 'Cửa hàng công nghệ với sản phẩm chất lượng cao.',
};

export const generateViewport = () => ({
  width: 'device-width',
  initialScale: 1,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <CartProvider>
        <AuthProvider>
          
            {children}
            <SupportWidget />
          
        </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}