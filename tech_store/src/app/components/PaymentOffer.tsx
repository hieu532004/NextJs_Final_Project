'use client';

import { Card } from 'antd';

export default function PaymentOffer() {
  return (
    <Card className="border shadow-sm">
      <h2 className="text-xl font-bold mb-4">Ưu đãi thanh toán Online</h2>
      <p className="text-sm text-gray-600">
        Giảm thêm 50.000đ khi thanh toán qua VNPAY hoặc Momo.
      </p>
    </Card>
  );
}