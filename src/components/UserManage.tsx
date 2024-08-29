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
      className="flex flex-col mb-3"
    >
      <div 
        className=" flex justify-center items-center rounded-[20px] bg-white p-4 pl-8 pr-8"
        style={{ boxShadow: '1px 1px 10px 0 rgba(0, 0, 0, 0.05)' }}
      >
        <div className="flex-grow flex flex-col items-start">
          <span className="text-black font-bold text-15px">{user.name}</span>
          <span className="text-[#AEAEB2] text-[11px]">{user.email}</span>
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
          className="px-4 py-2 bg-white text-black font-bold border border-[#E5E5EA] rounded-[24px] text-[15px]"
          style={{ width: '81px', height: '42px' }}
        >
          {user.previllege === "deny" ? "허용" : "차단"}
        </button>
      </div>
    </li>
  );
};

export default UserManage;
