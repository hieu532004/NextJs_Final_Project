import ProductList from "@/app/components/Products";
import { Suspense } from "react";

export default function page() {
  return (
    <div>
       <Suspense fallback={<p>Đang tải...</p>}>
        <ProductList />
      </Suspense>
    </div>
  )
}
