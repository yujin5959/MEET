import React from "react";
import { useNavigate } from "react-router-dom";

const FooterNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 w-full bg-blue-500 text-white font-bold py-5" style={{ zIndex: 20 }}>
      <div className="flex justify-around">
        <a
          onClick={() => navigate("/meet/list")}
          className="text-white hover:text-gray-400 cursor-pointer font-bold"
        >
          모임
        </a>
        <a
          onClick={() => navigate("/")}
          className="text-white hover:text-gray-400 font-bold"
        >
          홈
        </a>
        <a
          href="#contact"
          className="text-white hover:text-gray-400 font-bold"
        >
          사용자
        </a>
      </div>
    </nav>
  );
};

export default FooterNav;
