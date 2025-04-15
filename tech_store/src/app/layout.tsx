// app/layout.tsx

import './styles/globals.css';
export const metadata = {
  title: 'TechStore - Mua sắm công nghệ',
  description: 'Cửa hàng công nghệ với sản phẩm chất lượng cao.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}