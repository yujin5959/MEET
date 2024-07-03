import React from "react";
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
  return (
    <>
      <button className="bg-white	" onClick={handleAdmin}>
        관리자
      </button>
    </>
  );
};
