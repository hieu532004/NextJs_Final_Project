import React, { useState } from "react";
import { useAuth } from "@/app/contexts/authContext";
import LoginModal from "./LoginModal";
import { useCart } from "@/app/contexts/CartContext";
import { Button, message } from "antd";
import { Product } from "@/app/types";
import { ShoppingCartOutlined } from "@ant-design/icons";
import RegisterModal from './RegisterModal';
import RedirectLoginModal from "./RedirectLoginModal";

interface AddToCartProps {
  product: Product;
}

const AddToCart: React.FC<AddToCartProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { user: loggedInUser } = useAuth();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isRedirectLoginModalVisible, setIsRedirectLoginModalVisible] = useState(false);

  const handleAddToCart = () => {
    if (!loggedInUser) {
      setIsRedirectLoginModalVisible(true);
      return;
    }
    addToCart({
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: product.image,
      slug: product.slug,
    });
    message.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <>
      <Button
        type="primary"
        block
        icon={<ShoppingCartOutlined />}
        onClick={handleAddToCart}
        className="bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap"
      >
        Thêm vào giỏ
      </Button>
      <RedirectLoginModal
      isVisible={isRedirectLoginModalVisible}
      onCancel={() => setIsRedirectLoginModalVisible(false)}
      onShowLogin={() => {
        setIsRedirectLoginModalVisible(false);
        setIsLoginModalVisible(true);
      }}
      onShowRegister={() => {
        setIsRedirectLoginModalVisible(false);
        setIsRegisterModalVisible(true);
      }}
    />
      <LoginModal
        isVisible={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        onShowRegister={() => {
          setIsLoginModalVisible(false);
          setIsRegisterModalVisible(true);
        }}
      />

      <RegisterModal
        isVisible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        onRegisterSuccess={() => console.log('Registered successfully')}
        onShowLogin={() => {
          setIsRegisterModalVisible(false);
          setIsLoginModalVisible(true);
        }} 
         />
    </>
  );
};

export default AddToCart;
