import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ScheduleVoteBefore from "@/components/ScheduleVoteBefore";
import ScheduleVoteAfter from "@/components/ScheduleVoteAfter";

type Schedule = {
  id: string;
  date: string;
  userId: string;
};

type MeetSchedule = {
  meetTitle: string;
  endDate: string;
  existingSchedules: Schedule[]; // 기존 일정 목록
  votes: { [key: string]: number }; // 각 일정에 대한 투표 수
};

const ScheduleVotePage = () => {
  const { meetId } = useParams<{ meetId: string }>();
  const [meetSchedule, setMeetSchedule] = useState<MeetSchedule | null>(null);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const currentUserId = "currentUserId";

  useEffect(() => {
    const fetchMeetSchedule = async () => {
      try {
        const response = await axios.get(
          `http://54.180.29.36/meet/schedule/${meetId}`
        );
        const { meetTitle, endDate, existingSchedules, votes } = response.data;
        setMeetSchedule({ meetTitle, endDate, existingSchedules, votes });
      } catch (error) {
        console.error("Meet Schedule 가져오기 실패:", error);
      }
    };

    if (meetId) {
      fetchMeetSchedule();
    }
  }, [meetId]);

  // 투표하기 버튼 눌렀을 때
  const handleVoteClick = async (date: string) => {
    try {
      const response = await axios.post(
        `http://54.180.29.36/meet/schedule/item`,
        {
          meetId,
          date,
          userId: currentUserId,
        }
      );
      console.log("투표 추가 성공:", response.data);
      setIsVoted(true);
    } catch (error) {
      console.error("투표 추가 실패:", error);
    }
  };

  // 다시 투표하기 버튼 눌렀을 때
  const handleVoteAgainClick = () => {
    setIsVoted(false);
  };

  return (
    <div className="bg-white p-8 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">
          {meetSchedule ? meetSchedule.meetTitle : "모임 제목"}
        </h1>
        <p className="text-sm">
          {meetSchedule ? `마감 기한: ${meetSchedule.endDate}` : "마감 기한"}
        </p>
      </div>
      <div className="p-4">
        {isVoted ? (
          <ScheduleVoteAfter
            meetId={meetId!}
            votes={meetSchedule ? meetSchedule.votes : {}} // 투표 수 데이터 전달
            onVoteAgainClick={handleVoteAgainClick}
            selectedSchedules={
              meetSchedule ? meetSchedule.existingSchedules : []
            } // 선택된 일정 목록 전달
          />
        ) : (
          <ScheduleVoteBefore
            meetId={meetId!}
            existingSchedules={
              meetSchedule ? meetSchedule.existingSchedules : []
            } // 기존 일정 목록 전달
            isVoted={isVoted}
            onVoteClick={handleVoteClick}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  );
};

export default ScheduleVotePage;
