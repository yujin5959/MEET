import React from "react";

const UserManage = ({
  user,
  handlePermissionChange,
}: {
  user: any;
  handlePermissionChange: (
    memberId: string,
    currentPrivilege: string,
    uuid: string,
    isFirst: string
  ) => void;
}) => {
  return (
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
            handlePermissionChange(
              user.id,
              user.previllege,
              user.uuid,
              user.isFirst
            )
          }
          className={`px-4 py-2 rounded-md bg-gray-400 text-white`}
        >
          {user.previllege === "deny" ? "허용" : "차단"}
        </button>
      </div>
    </li>
  );
};

export default UserManage;
