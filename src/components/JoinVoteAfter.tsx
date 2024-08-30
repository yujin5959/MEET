import React from "react";
import { voteItem } from "@/types/JoinVote";

const JoinVoteAfter = ({
  votedItemId,
  setIsVoted,
  itemList
}: {
  votedItemId: string;
  setIsVoted: React.Dispatch<React.SetStateAction<boolean>>
  itemList: voteItem[]
}) => {
  // 다시 투표하기 눌렀을 때
  const handleButtonClick = () => {
    setIsVoted(false);
  };
  
  return (
    <div className="space-y-4">
      {/* 선택된 항목 강조 표시 */}
      <div className="w-full bg-white p-6 rounded-[24px] space-y-2">
        {itemList.map((item) => (
            <div
            className={`flex items-center justify-between p-4 rounded-lg ${
              votedItemId === item.id ? "bg-blue-200" : "bg-white"
            }`}
          >
            <span className="font-semibold text-lg">{item.name}</span>
            <span className="text-md">{item.memberList.length}</span>
          </div>
        ))}
      </div>
      {/* 다시 투표하기 버튼 */}
      <button
        onClick={handleButtonClick}
        className="bg-[#FFE607] p-3 rounded-[24px] text-lg w-full font-bold"
      >
        다시 투표하기
      </button>
    </div>
  );
};

export default JoinVoteAfter;
