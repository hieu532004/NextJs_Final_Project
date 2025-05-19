import PaymentSuccess from "@/app/components/PaymentSuccess";
import { Suspense } from "react";

export default function page() {
  return (
    <div>
       <Suspense fallback={<p>Đang tải...</p>}>
        <PaymentSuccess />
      </Suspense>
    </div>
  )
}
