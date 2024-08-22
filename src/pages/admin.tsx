import React, { useEffect, useState } from "react";
import UserManage from "@/components/UserManage";
import { server } from "@/utils/axios";
import axios from "axios";

type User = {
  id: string;
  name: string;
  email: string;
  previllege: string;
  uuid: string;
  isFirst: string;
};

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  // UUID 가져오기
  const fetchUUID = async ():Promise<string[]> => {
    try {
      const tokenResponse = await server.get("/auth/admin/accessToken");
      const adminAccessToken = tokenResponse.data.adminAccessToken;

      const response = await axios.get(
        "https://kapi.kakao.com/v1/api/talk/friends",
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );

      const friends = response.data.elements;
      const uuids = friends.map((friend: { uuid: string }) => friend.uuid);
      console.log("가져온 UUID 목록:", uuids);
      return uuids;
    } catch (error) {
      console.error("UUID를 가져오는 중 오류가 발생했습니다:", error);
      return [];
    }
  };

  // 서버에서 유저 목록 가져오기
  const fetchUserList = async () => {
    server
      .get("/member/list")
      .then((response) => {
        if (response && response.data && Array.isArray(response.data)) {
          const transformedUsers = response.data.map((user: any) => {
            if (user.previllege === "accepted") {
              user.previllege = "accept";
            } else if (user.previllege === "denied") {
              user.previllege = "deny";
            }
            return user;
          });
          setUsers(transformedUsers);
        } else {
          console.error("예상치 못한 응답 구조:", response);
        }
      })
      .catch ((error) => {
      console.error("유저 목록을 불러오는 중 오류가 발생했습니다:", error);
    });
  };

  // 유저 권한 변경
  const handlePermissionChange = (
    memberId: string,
    currentPrivilege: string,
    uuid: string,
    isFirst: string
  ) => {
    const newPrivilege = 
      currentPrivilege === "accept" || currentPrivilege === "admin" 
        ? "deny" 
        : "accept";
    
    const updatePrivilege = (fetchedUUID: string | null) => {
      const requestData = {
        memberId,
        option: newPrivilege,
        uuid: fetchedUUID,
      };

      server
        .put("/member/previllege", { data: requestData })
        .then(() => {
          setUsers((prevState) =>
            prevState.map((user) =>
              user.id === memberId ? { ...user, previllege: newPrivilege } : user
            )
          );
        })
        .catch((error) => {
          console.error("유저 권한을 업데이트하는 중 오류가 발생했습니다:", error);
        });
    };

    if (isFirst === "true") {
      fetchUUID()
        .then((uuids) => {
          if (uuids && uuids.length > 0) {
            const fetchedUUID = uuids[0];
            updatePrivilege(fetchedUUID);
          } else {
            console.error("UUID를 가져오지 못했습니다. 권한 변경이 실패했습니다.");
          }
        }).catch((error) => {
          console.error("UUID를 가져오는 중 오류가 발생했습니다:", error);
        });
    } else {
      updatePrivilege(uuid);
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
        <ul className="max-w-full divide-y divide-gray-700">
          {users.map((user) => (
            <UserManage
              key={user.id}
              user={user}
              handlePermissionChange={handlePermissionChange}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
