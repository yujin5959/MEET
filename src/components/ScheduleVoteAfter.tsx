import React from "react";

const ScheduleVoteAfter = ({ meetId }: { meetId: string }) => {
  const schedule = "";

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-4 p-2 text-white ">
        {schedule ? schedule : "결과가 없습니다."}
      </div>
    </div>
  );
};

export default ScheduleVoteAfter;
