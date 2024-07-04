import React from "react";

type Schedule = {
  id: string;
  date: string;
};

type ScheduleVoteAfterProps = {
  meetId: string;
  votes: { [key: string]: number };
  onVoteAgainClick: () => void;
  selectedSchedules: Schedule[];
};

const ScheduleVoteAfter = ({
  meetId,
  votes,
  onVoteAgainClick,
  selectedSchedules,
}: ScheduleVoteAfterProps) => {
  // 가장 많은 투표를 받은 일정의 ID 배열 구하기
  const mostVotedScheduleIds = Object.keys(votes).filter(
    (key) => votes[key] === Math.max(...Object.values(votes))
  );

  return (
    <div className="space-y-4">
      {selectedSchedules.map((schedule) => (
        <div
          key={schedule.id}
          className={`flex items-center justify-between p-2 ${
            mostVotedScheduleIds.includes(schedule.id) ? "bg-yellow-200" : ""
          } rounded-lg`}
        >
          <span>{schedule.date}</span>
          <span className="ml-4">투표 수: {votes[schedule.id] || 0}</span>
        </div>
      ))}
      <button
        onClick={onVoteAgainClick}
        className="bg-gray-200 rounded-lg px-4 py-2 text-black w-full"
      >
        다시 투표하기
      </button>
    </div>
  );
};

export default ScheduleVoteAfter;
