import React from "react";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#242424" }}
    >
      <div
        className="p-8 rounded-lg shadow-md w-full max-w-md mx-4"
        style={{ backgroundColor: "#3f3f3f" }}
      >
        <p className="text-2xl font-bold mb-6 text-center text-white">
          <i
            className="fa-solid fa-triangle-exclamation"
            style={{ fontSize: "48px" }}
          ></i>
        </p>
        <p className="text-center text-white mb-4">
          접근 권한이 없습니다. 관리자에게 문의하세요.
        </p>
        <button
          onClick={() => navigate("/auth/login")}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
};
