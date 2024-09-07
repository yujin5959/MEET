import React from "react";
import { useNavigate } from "react-router-dom";
import error from "../../assets/img/error.png"

export const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex flex-col justify-center"
      style={{ backgroundColor: "#F2F2F7" }}
    >
      <div className="h-[300px] flex flex-col justify-between mx-6">
        <div className="flex flex-col items-center justify-center">
          <img src={error} className="w-[70px] pb-5"></img>
          <p className="font-bold text-[20px] text-center text-black ">
            접근 권한이 없습니다. <br/> 관리자에게 문의하세요.
          </p>
        </div>
        <button
          onClick={() => navigate("/auth/login")}
          className="w-full h-[55px] bg-[#FFE607] hover:bg-[#FFE607] rounded-[30px] text-black font-bold text-[16px] flex justify-center items-center"
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
};
