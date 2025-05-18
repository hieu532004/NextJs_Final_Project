'use client';

import { Card, Row, Col, Rate, Spin } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/types';

interface RelatedProductsProps {
  selectedCategory: string | null;
  loadingCategory: boolean;
  categoryProducts: Product[];
  relatedProducts: Product[]; // Fixed typo: changed 'relatedProducts pulp' to 'relatedProducts'
}

export default function RelatedProducts({
  selectedCategory,
  loadingCategory,
  categoryProducts,
  relatedProducts,
}: RelatedProductsProps) {
  return (
    <>
      {selectedCategory && (
        <>
          <h2 className="text-xl font-bold mb-4">
            Sản phẩm theo danh mục: {selectedCategory.replace(/-/g, ' ')}
          </h2>
          {loadingCategory ? (
            <Spin />
          ) : categoryProducts.length > 0 ? (
            <Row gutter={[16, 16]}>
              {categoryProducts.map((catProduct) => (
                <Col xs={24} sm={12} md={6} key={catProduct._id}>
                  <Link href={`/products/${catProduct.slug}`}>
                    <Card
                      hoverable
                      cover={
                        <div className="relative h-40">
                          <Image
                            src={catProduct.image}
                            alt={catProduct.name}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="p-2"
                          />
                        </div>
                      }
                    >
                      <Card.Meta
                        title={catProduct.name}
                        description={
                          <div>
                            <p className="text-red-600 font-bold">
                              {catProduct.salePrice.toLocaleString('vi-VN')}đ
                            </p>
                            {catProduct.salePrice < catProduct.price && (
                              <p className="text-gray-400 line-through text-sm">
                                {catProduct.price.toLocaleString('vi-VN')}đ
                              </p>
                            )}
                            <Rate disabled value={catProduct.rating} allowHalf className="text-sm" />
                          </div>
                        }
                      />
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-gray-500">Không có sản phẩm nào trong danh mục này.</p>
          )}
        </>
      )}
      <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
      <Row gutter={[16, 16]}>
        {relatedProducts.map((relatedProduct) => (
          <Col xs={24} sm={12} md={6} key={relatedProduct._id}>
            <Link href={`/products/${relatedProduct.slug}`}>
              <Card
                hoverable
                cover={
                  <div className="relative h-40">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="p-2"
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={relatedProduct.name}
                  description={
                    <div>
                      <p className="text-red-600 font-bold">
                        {relatedProduct.salePrice.toLocaleString('vi-VN')}đ
                      </p>
                      {relatedProduct.salePrice < relatedProduct.price && (
                        <p className="text-gray-400 line-through text-sm">
                          {relatedProduct.price.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                      <Rate disabled value={relatedProduct.rating} allowHalf className="text-sm" />
                    </div>
                  }
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}