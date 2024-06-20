import React, { useState, useEffect } from "react";
import axios from "axios";

const List = ({ users }: { users: any[] }) => {
  const [userStates, setUserStates] = useState(users);

  useEffect(() => {
    setUserStates(users);
  }, [users]);

  // 유저 권한 변경
  const handlePermissionChange = async (
    memberId: string,
    currentPrivilege: string,
    uuid: string
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      let newPrivilege =
        currentPrivilege === "accept" || currentPrivilege === "admin"
          ? "deny"
          : "accept";
      console.log(
        `Changing privilege from ${currentPrivilege} to ${newPrivilege}`
      );
      const response = await axios.put(
        "http://54.180.29.36/member/previllege",
        {
          memberId: memberId,
          option: newPrivilege, // 새 권한을 서버로 전송
          uuid: uuid,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        setUserStates((prevState) =>
          prevState.map((user) =>
            user.id === memberId ? { ...user, previllege: newPrivilege } : user
          )
        );
      } else if (response.status === 403) {
        console.error("관리자 권한이 없습니다. 권한을 변경할 수 없습니다.");
      } else if (response.status === 404) {
        console.error("존재하지 않는 멤버입니다. 권한을 변경할 수 없습니다.");
      }
    } catch (error) {
      console.error("유저 권한을 업데이트하는 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <ul className="max-w-full divide-y divide-gray-700">
      {userStates.map((user) => (
        <li
          key={user.id}
          className="p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center"
        >
          <div className="w-full bg-white rounded-lg p-2 sm:p-4 flex justify-center sm:justify-end items-center gap-2">
            <div className="flex-grow flex flex-col items-center sm:items-start">
              <span className="text-black">{user.name}</span>
              <span className="text-gray-500 text-sm">{user.email}</span>
            </div>
            <button
              onClick={() =>
                handlePermissionChange(user.id, user.previllege, user.uuid)
              }
              className={`px-4 py-2 rounded-md bg-gray-400 text-white`}
            >
              {user.previllege === "deny" ? "허용" : "차단"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default List;
