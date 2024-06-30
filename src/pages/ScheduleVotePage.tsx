import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ScheduleVoteBefore from "@/components/ScheduleVoteBefore";
import ScheduleVoteAfter from "@/components/ScheduleVoteAfter";

type MeetSchedule = {
  meetTitle: string;
  endDate: string;
};

const ScheduleVotePage = () => {
  const { meetId } = useParams<{ meetId: string }>();
  const [meetSchedule, setMeetSchedule] = useState<MeetSchedule | null>(null);
  const [isVoted, setIsVoted] = useState<boolean>(false);

  useEffect(() => {
    if (meetId) {
      axios
        .get(`http://54.180.29.36/meet/schedule/${meetId}`)
        .then((response) => {
          const { meetTitle, endDate } = response.data;
          setMeetSchedule({ meetTitle, endDate });
        })
        .catch((error) => console.error("Meet Schedule 가져오기 실패:", error));
    }
  }, [meetId]);

  const handleButtonClick = () => {
    setIsVoted((prevIsVoted) => !prevIsVoted);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#242424" }}
    >
      <div
        className=" p-6 rounded-lg shadow-lg max-w-md mx-4"
        style={{ backgroundColor: "#3f3f3f" }}
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-white">
          {meetSchedule ? meetSchedule.meetTitle : "모임 제목"}
        </h1>
        <p className="text-center text-white mb-2">
          {meetSchedule ? `마감 기한: ${meetSchedule.endDate}` : "마감 기한"}
        </p>
        <div className="mt-4 p-2">
          {isVoted ? (
            <ScheduleVoteBefore meetId={meetId!} />
          ) : (
            <ScheduleVoteAfter meetId={meetId!} />
          )}
        </div>
        <div className="bottom-0 left-0 w-full pt-4 flex justify-center">
          <button
            onClick={handleButtonClick}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            {isVoted ? "투표 완료" : "다시 투표하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleVotePage;
