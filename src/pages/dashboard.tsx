import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";

const adminUrl = "/admin";
const handleAdmin = () => {
  server
    .get("/member/previllege")
    .then((response) => {
      console.log(response.data);
      if (response.code === "200" && response.data.previllege === "admin") {
        window.location.href = adminUrl;
      }
    })
    .catch((error) => {
      console.error("권한 정보를 가져오는 중 오류 발생:", error);
    });
};

export const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    server
      .get("/member/previllege")
      .then((response) => {
        if (response.code === "200" && response.data.previllege === "admin") {
          setIsAdmin(true);
        }
      })
      .catch((error) => {
        console.error("권한 정보를 가져오는 중 오류 발생:", error);
      });
  }, []);

  return (
    <>
      {/* 상단 div 박스 */}
      <div className="fixed top-0 left-0 w-full bg-blue-500 text-white shadow-md rounded-b-3xl" style={{ height: '200px', zIndex: 10 }}>
        <div className="flex flex-col items-start justify-center h-full px-6">
          <h1 className="text-4xl font-bold mb-4">안녕하세요, 유진님!</h1>
          <p className="text-1xl text-left max-w-lg mx-4 mt-6">
            약속을 만들러 가볼까요?
          </p>
        </div>
        {/* 관리자 버튼 */}
        {isAdmin && (
          <button
            className="bg-blue-900 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg absolute right-4 bottom-4"
            onClick={handleAdmin}
            style={{ width: '100px', height: '40px', padding: '0' }}
          >
            관리자
          </button>
        )}
      </div>
     {/* 임시로 버튼 */}
        <button
          className="bg-white text-gray-800 font-bold py-4 px-4 rounded-lg shadow-lg absolute left-4 bottom-[calc(480px)] hover:bg-gray-100"
          style={{ width: '150px', height: '150px' }}
        >
          모임
        </button>

      {/* 네비게이션 바 */}
      <nav className="fixed bottom-0 w-full bg-blue-500 text-white font-bold py-5">
        <div className="flex justify-around">
          <a onClick={() => navigate("/meet")} className="text-white hover:text-gray-400 cursor-pointer font-bold">모임</a>
          <a href="#about" className="text-white hover:text-gray-400 font-bold">홈</a>
          <a href="#contact" className="text-white hover:text-gray-400 font-bold">사용자</a>
        </div>
      </nav>
    </>
  );
};
