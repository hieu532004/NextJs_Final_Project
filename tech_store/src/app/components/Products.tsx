// src/app/Products.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Menu,
  Slider,
  Checkbox,
  Select,
  Rate,
  Tag,
  Button,
  Space,
  Pagination,
  Modal,
  notification,
  Skeleton,
} from "antd";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import type { Product, Category } from "@/app/types";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { useCart } from "@/app/contexts/CartContext";

const { Option } = Select;

const categoryMap: { [key: string]: string } = {
  laptop: "Laptop",
  chuot: "Chuột",
  "ban-phim": "Bàn phím",
  "tai-nghe": "Tai nghe",
  "cap-sac": "Cáp sạc",
  "balo-laptop": "Balo laptop",
  "man-hinh": "Màn hình",
  "phu-kien-khac": "Phụ kiện khác",
};

export default function ProductList() {
  const { setCartCount, addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryCategory = searchParams.get("category");
  const queryBrand = searchParams.get("brand");
  const querySearch = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000,
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>(querySearch || "");
  const pageSize = 6;

  useEffect(() => {
    if (queryCategory) {
      const matchedCategoryName = categoryMap[queryCategory];
      if (matchedCategoryName) {
        const matchedCategory = categories.find(
          (cat) => cat.name === matchedCategoryName
        );
        setSelectedCategory(matchedCategory ? matchedCategory._id : "all");
      } else {
        setSelectedCategory("all");
      }
    } else {
      setSelectedCategory("all");
    }
  }, [queryCategory, categories]);

  useEffect(() => {
    if (queryBrand) {
      const matchedBrand = products.find(
        (product) => product.brand.toLowerCase() === queryBrand.toLowerCase()
      )?.brand;
      if (matchedBrand) {
        setSelectedBrands([matchedBrand]);
      } else {
        setSelectedBrands([]);
      }
    } else {
      setSelectedBrands([]);
    }
  }, [queryBrand, products]);

  useEffect(() => {
    if (querySearch) {
      setSearchQuery(querySearch);
    } else {
      setSearchQuery("");
    }
  }, [querySearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`),
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/categories`),
        ]);
        const productsData = productsResponse.data.data.products;
        const categoriesData = categoriesResponse.data.data.categories;

        if (!Array.isArray(productsData)) {
          throw new Error("Dữ liệu sản phẩm không đúng định dạng.");
        }
        if (!Array.isArray(categoriesData)) {
          throw new Error("Dữ liệu danh mục không đúng định dạng.");
        }

        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);

        const prices = productsData.map((p: Product) => p.salePrice);
        const maxPrice = Math.max(...prices, 100000000);
        setPriceRange([0, maxPrice]);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const brands = useMemo(
    () => Array.from(new Set(products.map((product) => product.brand))),
    [products]
  );

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);

    const selectedCat = categories.find((cat) => cat._id === categoryId);
    const categorySlug = selectedCat
      ? Object.keys(categoryMap).find(
          (key) => categoryMap[key] === selectedCat.name
        ) || "all"
      : "all";

    const params = new URLSearchParams();
    if (categoryId !== "all") {
      params.set("category", categorySlug);
    }
    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands[0].toLowerCase());
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleBrandChange = (checkedValues: string[]) => {
    setSelectedBrands(checkedValues);
    setCurrentPage(1);

    const params = new URLSearchParams();
    if (selectedCategory !== "all") {
      const selectedCat = categories.find(
        (cat) => cat._id === selectedCategory
      );
      const categorySlug = selectedCat
        ? Object.keys(categoryMap).find(
            (key) => categoryMap[key] === selectedCat.name
          ) || "all"
        : "all";
      params.set("category", categorySlug);
    }
    if (checkedValues.length > 0) {
      params.set("brand", checkedValues[0].toLowerCase());
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleRatingChange = (value: number) => {
    setMinRating(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  let filteredProducts = products.filter((product) => {
    const inCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;
    const inPriceRange =
      product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1];
    const inBrands =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const aboveMinRating = product.rating >= minRating;
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return (
      inCategory && inPriceRange && inBrands && aboveMinRating && matchesSearch
    );
  });

  if (sortOrder === "priceAsc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.salePrice - b.salePrice
    );
  } else if (sortOrder === "priceDesc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.salePrice - a.salePrice
    );
  } else if (sortOrder === "ratingDesc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating
    );
  }

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const selectedCategoryName =
    selectedCategory === "all"
      ? "Tất cả sản phẩm"
      : categories.find((cat) => cat._id === selectedCategory)?.name ||
        "Không xác định";

  const selectedBrandName =
    selectedBrands.length > 0 ? selectedBrands.join(", ") : "";

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: product.image,
    });
    setCartCount((prev) => prev + 1);
    notification.success({
      message: "Thêm vào giỏ hàng thành công!",
      description: `${product.name} đã được thêm vào giỏ hàng.`,
      duration: 2,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header searchValue={searchQuery} setSearchValue={setSearchQuery} />
        <main className="flex-grow container mx-auto p-4">
          <Skeleton active paragraph={{ rows: 2 }} className="mb-4" />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Card className="shadow-sm" style={{ minHeight: "600px" }}>
                <Skeleton active paragraph={{ rows: 10 }} />
              </Card>
            </Col>
            <Col xs={24} md={18}>
              <div className="mb-4 flex justify-between items-center">
                <Skeleton.Input active style={{ width: 200 }} />
                <Skeleton.Input active style={{ width: 200 }} />
              </div>
              <Row gutter={[16, 16]}>
                {[...Array(6)].map((_, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <Card className="shadow-md">
                      <Skeleton.Image
                        active
                        style={{ width: "100%", height: 192 }}
                      />
                      <Skeleton active paragraph={{ rows: 3 }} />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header searchValue={searchQuery} setSearchValue={setSearchQuery} />
        <main className="flex-grow container mx-auto p-4">
          <p className="text-red-500">{error}</p>
          <Button type="primary" onClick={() => fetchData()} className="mt-4">
            Thử lại
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchValue={searchQuery} setSearchValue={setSearchQuery} />
      <main className="flex-grow container mx-auto p-4">
        <div className="mb-4 text-sm">
          <Link href="/">Trang chủ</Link> / <span>Sản phẩm</span>
          {selectedCategory !== "all" && (
            <>
              {" "}
              / <span>{selectedCategoryName}</span>
            </>
          )}
          {selectedBrandName && (
            <>
              {" "}
              / <span>{selectedBrandName}</span>
            </>
          )}
          {searchQuery && (
            <>
              <span> / </span>
              <span>Kết quả tìm kiếm: '{searchQuery}'</span>
            </>
          )}
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {searchQuery
              ? `Kết quả tìm kiếm cho "${searchQuery}"`
              : selectedBrandName
              ? `Sản phẩm thương hiệu ${selectedBrandName}`
              : selectedCategoryName}
          </h1>
          <p className="text-sm text-gray-600">
            Tìm thấy {filteredProducts.length} sản phẩm
          </p>
        </div>

        <Row gutter={[16, 16]} style={{ minHeight: "600px" }}>
          <Col xs={24} md={6}>
            <Card
              title="Bộ lọc sản phẩm"
              className="shadow-sm"
              style={{ minHeight: "100%", paddingBottom: "16px" }}
            >
              <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
              <Menu
                mode="vertical"
                selectedKeys={selectedCategory ? [selectedCategory] : ["all"]}
                onClick={({ key }) => handleCategorySelect(key)}
                items={[
                  {
                    key: "all",
                    label: "Tất cả sản phẩm",
                  },
                  ...categories.map((category) => ({
                    key: category._id,
                    label: category.name,
                  })),
                ]}
              />

              <h3 className="text-lg font-semibold mt-4 mb-2">Khoảng giá</h3>
              <Slider
                range
                min={0}
                max={Math.max(...products.map((p) => p.salePrice), 100000000)}
                value={priceRange}
                onChange={(value) => {
                  if (Array.isArray(value) && value.length === 2) {
                    handlePriceRangeChange(value as [number, number]);
                  }
                }}
                step={100000}
                tooltip={{
                  formatter: (value) => `${value?.toLocaleString("vi-VN")}đ`,
                }}
              />
              <p className="text-sm text-gray-600">
                {priceRange[0].toLocaleString("vi-VN")}đ -{" "}
                {priceRange[1].toLocaleString("vi-VN")}đ
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Thương hiệu</h3>
              <Checkbox.Group
                options={brands.map((brand) => ({
                  label: brand,
                  value: brand,
                }))}
                value={selectedBrands}
                onChange={handleBrandChange}
                className="flex flex-col space-y-2"
              />

              <h3 className="text-lg font-semibold mt-4 mb-2">
                Đánh giá tối thiểu
              </h3>
              <Rate
                value={minRating}
                onChange={handleRatingChange}
                className="text-sm"
              />
            </Card>
          </Col>

          <Col xs={24} md={18}>
            <Card
              className="shadow-sm"
              style={{ minHeight: "100%", paddingBottom: "16px" }}
            >
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Hiển thị {paginatedProducts.length} trong số{" "}
                  {filteredProducts.length} sản phẩm
                </span>
                <div>
                  <label className="mr-2 font-semibold">Sắp xếp:</label>
                  <Select
                    value={sortOrder}
                    onChange={handleSortChange}
                    style={{ width: 200 }}
                    placeholder="Sắp xếp"
                  >
                    <Option value="default">Mặc định</Option>
                    <Option value="priceAsc">Giá: Thấp đến cao</Option>
                    <Option value="priceDesc">Giá: Cao đến thấp</Option>
                    <Option value="ratingDesc">Đánh giá: Cao đến thấp</Option>
                  </Select>
                </div>
              </div>

              <Row gutter={[16, 16]}>
                {paginatedProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} key={product._id}>
                    <Card
                      cover={
                        <Link
                          href={`/products/${product.slug}`}
                          aria-label={`Xem chi tiết ${product.name}`}
                        >
                          <div className="relative h-48">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              style={{ objectFit: "contain" }}
                              className="p-2 transition-transform duration-300 hover:scale-105"
                            />
                            {product.isNew && (
                              <Tag
                                color="green"
                                className="absolute top-2 left-2"
                              >
                                Mới
                              </Tag>
                            )}
                            {product.discount > 0 && (
                              <Tag color="red" className="absolute top-2 right-2">
                                -{product.discount}%
                              </Tag>
                            )}
                          </div>
                        </Link>
                      }
                      actions={[
                        <Button
                          key="add-to-cart"
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Thêm vào giỏ
                        </Button>,
                        <Button
                          key="quick-view"
                          icon={<EyeOutlined />}
                          onClick={() => setQuickViewProduct(product)}
                        >
                          Xem nhanh
                        </Button>,
                      ]}
                      className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
                      styles={{
                        body: {
                          flex: "1",
                          display: "flex",
                          flexDirection: "column",
                        },
                      }}
                    >
                      <Card.Meta
                        title={
                          <Link
                            href={`/products/${product.slug}`}
                            aria-label={`Xem chi tiết ${product.name}`}
                          >
                            <div className="text-lg font-semibold line-clamp-2 h-12">
                              {product.name}
                            </div>
                          </Link>
                        }
                        description={
                          <div className="flex flex-col flex-grow">
                            <div className="flex items-center mb-1">
                              <span className="text-red-500 font-bold mr-2">
                                {product.salePrice.toLocaleString("vi-VN")}đ
                              </span>
                              {product.discount > 0 && (
                                <span className="text-gray-500 line-through text-sm">
                                  {product.price.toLocaleString("vi-VN")}đ
                                </span>
                              )}
                            </div>
                            <Rate
                              disabled
                              value={product.rating}
                              allowHalf
                              className="text-sm mb-1"
                            />
                            <p className="text-gray-600 text-sm">
                              Thương hiệu: {product.brand}
                            </p>
                            {product.installment_available && (
                              <p className="text-green-600 text-sm">
                                Hỗ trợ trả góp
                              </p>
                            )}
                            <p className="text-gray-500 text-sm mt-auto">
                              Còn {product.stock} sản phẩm
                            </p>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="mt-12 text-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredProducts.length}
                  onChange={handlePageChange}
                  className="text-center"
                  showSizeChanger={false}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {quickViewProduct && (
          <Modal
            title={quickViewProduct.name}
            open={!!quickViewProduct}
            onCancel={() => setQuickViewProduct(null)}
            footer={null}
            width={800}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className="relative h-64">
                  <Image
                    src={quickViewProduct.image || "/placeholder.svg"}
                    alt={quickViewProduct.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="p-2"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <h2 className="text-xl font-bold">{quickViewProduct.name}</h2>
                <div className="flex items-center mb-2">
                  <Rate
                    disabled
                    value={quickViewProduct.rating}
                    allowHalf
                    className="text-sm mr-2"
                  />
                  <span className="text-sm text-gray-500">
                    ({Math.round(quickViewProduct.rating * 20)} đánh giá)
                  </span>
                </div>
                <p className="text-red-500 font-bold text-lg mb-2">
                  {quickViewProduct.salePrice.toLocaleString("vi-VN")}đ
                </p>
                {quickViewProduct.salePrice < quickViewProduct.price && (
                  <p className="text-gray-500 line-through text-sm mb-2">
                    {quickViewProduct.price.toLocaleString("vi-VN")}đ
                  </p>
                )}
                <p className="text-gray-600 mb-2">
                  Thương hiệu: {quickViewProduct.brand}
                </p>
                <p className="text-gray-600 mb-4">
                  Tình trạng:{" "}
                  {quickViewProduct.stock > 0
                    ? `Còn ${quickViewProduct.stock} sản phẩm`
                    : "Hết hàng"}
                </p>
                <Space>
                  <Link href={`/products/${quickViewProduct.slug}`}>
                    <Button onClick={() => setQuickViewProduct(null)}>
                      Xem chi tiết
                    </Button>
                  </Link>
                </Space>
              </Col>
            </Row>
          </Modal>
        )}
      </main>

      <Footer />
    </div>
  );

  function fetchData() {
    const fetchDataAsync = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/products`),
          axios.get(`${process.env.NEXT_PUBLIC_JSON_SERVER_URL}/categories`),
        ]);
        const productsData = productsResponse.data.data.products;
        const categoriesData = categoriesResponse.data.data.categories;

        if (!Array.isArray(productsData)) {
          throw new Error("Dữ liệu sản phẩm không đúng định dạng.");
        }
        if (!Array.isArray(categoriesData)) {
          throw new Error("Dữ liệu danh mục không đúng định dạng.");
        }

        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);

        const prices = productsData.map((p: Product) => p.salePrice);
        const maxPrice = Math.max(...prices, 100000000);
        setPriceRange([0, maxPrice]);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
  }
}