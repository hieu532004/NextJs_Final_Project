"use client";

import React, { useState } from "react";
import { Modal, Button, Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface RedirectLoginModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const RedirectLoginModal: React.FC<RedirectLoginModalProps> = ({
  isVisible,
  onCancel,
  onShowLogin,
  onShowRegister,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span className="text-xl font-medium">Thông báo</span>
          <CloseOutlined
            onClick={onCancel}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          />
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      className="max-w-md w-full mx-auto"
      maskClosable={true}
      centered
    >
      <Form
        form={form}
        name="login_form"
        layout="vertical"
        autoComplete="off"
        className="mt-4"
      >
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-gray-600">
            Vui lòng đăng nhập tài khoản để xem ưu đãi và thanh toán dễ dàng hơn.
          </p>
        </div>
        <div className="flex justify-between items-center my-2 mx-20">
          <Form.Item>
            <Button
              type="primary"
              className=" w-[100px] bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap cursor-pointer"
              onClick={onShowRegister}
            >
              Đăng ký
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className="w-[100px] bg-blue-600 hover:bg-blue-700 !rounded-button whitespace-nowrap cursor-pointer"
              onClick={onShowLogin}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default RedirectLoginModal;
