import React, { useEffect, useState  } from "react";
import { Schedule } from "@/types/ScheduleVote";
import VotedMemberList from "./popUp/VotedMemberList";

type ScheduleVoteAfterProps = {
  scheduleList: Schedule[],
  setIsVoted: (value: boolean) => void;
  fetchScheduleVoteItems: () => void;
};


const ScheduleVoteAfter = ({
  scheduleList,
  fetchScheduleVoteItems  
}: ScheduleVoteAfterProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    fetchScheduleVoteItems(); 
  }, []);

  // 팝업 열기/닫기 토글 함수, 스케줄을 설정
  const openPopupWithSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);  // 선택된 스케줄을 상태에 저장
    setIsPopupOpen(true);  // 팝업 열기
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedSchedule(null);  // 팝업을 닫을 때 스케줄 초기화
  };

  var mostVotedScheduleIds: string[] = [];

  // 가장 많은 투표를 받은 일정의 ID 배열 구하기
  const findSchedulesWithLongestMemberList = (schedules: Schedule[]): string[] => {
    if (schedules.length === 0) return [];

    const maxLength = schedules.reduce((max, schedule) => {
      return Math.max(max, schedule.memberList.length);
    }, 0);

    return schedules
      .filter(schedule => schedule.memberList.length === maxLength)
      .map(schedule => schedule.id);;
  };

  mostVotedScheduleIds = findSchedulesWithLongestMemberList(scheduleList);

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-grow">
      {scheduleList.map((schedule) => (
        <div
          key={schedule.id}
          className={`flex items-center justify-between pr-2 my-2 ${
            mostVotedScheduleIds.includes(schedule.id) ? "border-b-[5px] border-[#FFE607] my-1" : ""
          }`}
        >
          <div className="flex items-center">
            {schedule.isVote === "true" && (
              <i className="fa-solid fa-check text-[black] mr-2"></i>
            )}
            <span>{`${schedule.date} ${schedule.time}`}</span>
          </div>
          <span className="text-[#8E8E93] text-[13px]" onClick={() => openPopupWithSchedule(schedule)}>{schedule.memberList.length}명</span>
        </div>
      ))}
      </div>

      {/* 팝업 열림 상태라면 멤버 리스트 보여주기 */}
      {isPopupOpen && selectedSchedule && (
        <VotedMemberList selectedItem={selectedSchedule} closePopup={closePopup} />
      )}
    </div>
  );
};

export default ScheduleVoteAfter;
