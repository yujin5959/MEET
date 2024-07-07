import React, { useEffect } from "react";
import { Schedule } from "@/types/ScheduleVote";

type ScheduleVoteAfterProps = {
  scheduleList: Schedule[],
  setIsVoted: (value: boolean) => void;
  fetchScheduleVoteItems: () => Promise<void>;
};

const ScheduleVoteAfter = ({
  scheduleList,
  setIsVoted,
  fetchScheduleVoteItems  
}: ScheduleVoteAfterProps) => {
  useEffect(() => {
    fetchScheduleVoteItems(); // 컴포넌트가 로드될 때 fetch 함수 호출
  }, []);

  var mostVotedScheduleIds: string[] = [];
  // 가장 많은 투표를 받은 일정의 ID 배열 구하기
  const findSchedulesWithLongestMemberList = (schedules: Schedule[]): string[] => {
    if (schedules.length === 0) return [];
    
    // Find the maximum member list length
    const maxLength = schedules.reduce((max, schedule) => {
      return Math.max(max, schedule.memberList.length);
    }, 0);
  
    // Filter schedules that have the maximum member list length
    return schedules.filter(schedule => schedule.memberList.length === maxLength)
                    .map(schedule => schedule.id);;
  };

  //다시 투표하기 눌렀을 때
  const handleButtonClick = () => {
    setIsVoted(false);
  };

  mostVotedScheduleIds = findSchedulesWithLongestMemberList(scheduleList);

  return (
    <div className="space-y-4">
      {scheduleList.map((schedule) => (
        <div
          key={schedule.id}
          className={`flex items-center justify-between p-2 ${
            mostVotedScheduleIds.includes(schedule.id) ? "bg-yellow-200" : ""
          } rounded-lg`}
        >
          <span>{schedule.date}</span>
          <span className="ml-4">투표 수: {schedule.memberList.length}</span>
        </div>
      ))}
      <button
        onClick={handleButtonClick}
        className="bg-gray-200 rounded-lg px-4 py-2 text-black w-full"
      >
        다시 투표하기
      </button>
    </div>
  );
};

export default ScheduleVoteAfter;
