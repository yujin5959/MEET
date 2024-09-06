import React from "react";
import FooterNav from "../components/FooterNav";

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
