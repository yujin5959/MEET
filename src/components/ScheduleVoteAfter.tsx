import React, { useEffect } from "react";
import { Schedule } from "@/types/ScheduleVote";

type ScheduleVoteAfterProps = {
  scheduleList: Schedule[],
  setIsVoted: (value: boolean) => void;
  fetchScheduleVoteItems: () => void;
};

const ScheduleVoteAfter = ({
  scheduleList,
  fetchScheduleVoteItems  
}: ScheduleVoteAfterProps) => {
  useEffect(() => {
    fetchScheduleVoteItems(); // 컴포넌트가 로드될 때 fetch 함수 호출
  }, []);

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
          <span>{`${schedule.date} ${schedule.time}`}</span>
          <span className="text-[#8E8E93] text-[13px]">{schedule.memberList.length}명</span>
        </div>
      ))}
      </div>
    </div>
  );
};

export default ScheduleVoteAfter;
