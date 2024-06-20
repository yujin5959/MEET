import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "@/components/list";

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  // 서버에서 유저 목록 가져오기
  const fetchUserList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }
      const response = await axios.get("http://54.180.29.36/member/list", {
        headers: {
          Authorization: `${token}`,
        },
      });
      const transformedUsers = response.data.data.map((user: any) => {
        if (user.previllege === "accepted") {
          user.previllege = "accept";
        } else if (user.previllege === "denied") {
          user.previllege = "deny";
        }
        return user;
      });
      setUsers(transformedUsers);
    } catch (error) {
      console.error("유저 목록을 불러오는 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#242424" }}
    >
      <div
        className="p-8 rounded-lg shadow-md w-full max-w-md mx-4"
        style={{ backgroundColor: "#3f3f3f" }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          User List
        </h1>
        <List users={users} />
      </div>
    </div>
  );
};

export default Admin;
