import React, {useState} from "react";
import { voteItem } from "@/types/JoinVote";
import VotedMemberList from "./popUp/VotedMemberList";

const JoinVoteAfter = ({
  votedItemId,
  setIsVoted,
  itemList
}: {
  votedItemId: string;
  setIsVoted: React.Dispatch<React.SetStateAction<boolean>>
  itemList: voteItem[]
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedVoteItem, setSelectedVoteItem] = useState<voteItem | null>(null);

  // 다시 투표하기 눌렀을 때
  const handleButtonClick = () => {
    setIsVoted(false);
  };

  // 팝업 열기/닫기 토글 함수, 스케줄을 설정
  const openPopup = (item: voteItem) => {
    setSelectedVoteItem(item);  // 선택된 스케줄을 상태에 저장
    setIsPopupOpen(true);  // 팝업 열기
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedVoteItem(null);  // 팝업을 닫을 때 스케줄 초기화
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
            <span className="text-md" onClick={() => openPopup(item)}>{item.memberList.length}</span>
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

      {/* 팝업 열림 상태라면 멤버 리스트 보여주기 */}
      {isPopupOpen && selectedVoteItem && (
        <VotedMemberList selectedItem={selectedVoteItem} closePopup={closePopup} />
      )}
    </div>
  );
};

export default JoinVoteAfter;
