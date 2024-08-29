import React from "react";

const JoinVoteAfter = ({
  votedStatus,
  setIsVoted,
}: {
  votedStatus: string;
  setIsVoted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // 하드코딩된 인원 수
  const participationCounts = {
    참여: 10, // 예시: 참여 인원 수
    불참여: 5, // 예시: 불참여 인원 수
  };

  // 다시 투표하기 눌렀을 때
  const handleButtonClick = () => {
    setIsVoted(false);
  };

  return (
    <div className="space-y-4">
      {/* 선택된 항목 강조 표시 */}
      <div className="w-full bg-white p-6 rounded-[24px] space-y-2">
        <div
          className={`flex items-center justify-between p-4 rounded-lg ${
            votedStatus === "참여" ? "bg-blue-200" : "bg-white"
          }`}
        >
          <span className="font-semibold text-lg">참여</span>
          <span className="text-md">{participationCounts.참여}</span>
        </div>
        <div
          className={`flex items-center justify-between p-4 rounded-lg ${
            votedStatus === "불참여" ? "bg-blue-200" : "bg-white"
          }`}
        >
          <span className="font-semibold text-lg">불참여</span>
          <span className="text-md">{participationCounts.불참여}</span>
        </div>
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
