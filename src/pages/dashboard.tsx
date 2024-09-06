import React from "react";
import { server } from "@/utils/axios";
import FooterNav from "../components/FooterNav";

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
  window.location.href = '/meet/list'
  return (
    <div 
      className="className=min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#F2F2F7", paddingBottom: "80px" }}
    > 
      <FooterNav />
    </div>
  );
};
