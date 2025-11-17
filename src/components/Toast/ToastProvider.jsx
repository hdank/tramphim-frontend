// src/components/ToastProvider.jsx
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        theme="dark" // giao diện tối (đen)
      />
    </>
  );
};

export default ToastProvider;
