import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type MeetInfo = {
  id: string;
  title: string;
  content: string;
  type: string;
  date: string;
  place: string;
  participantsNum: string;
  participants: string[];
};

const meetData: MeetInfo = {
  id: "1",
  title: "2024 3분기 정기모임",
  content: "정기 모임 입니다.",
  type: "Routine",
  date: "2024-07-05",
  place: "강남역",
  participantsNum: "2",
  participants: ["김지훈", "장지연"],
};

const MeetDetail: React.FC = () => {
  const { meetId } = useParams<{ meetId: string }>();

  const [meetInfo, setMeetInfo] = useState<MeetInfo | null>(null);

  useEffect(() => {
    if (meetId === meetData.id) {
      setMeetInfo(meetData);
    }
  }, [meetId]);

  if (!meetInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-start m-8 space-y-4">
      <h1 className="text-lg font-bold">{meetInfo.title || "모임 제목"}</h1>
      <p>
        <i className="fa-solid fa-calendar-days"></i> {meetInfo.date}
      </p>
      <hr className="w-full border-gray-300" />
      <p>
        <i className="fa-solid fa-location-dot"></i> {meetInfo.place}
      </p>
      <hr className="w-full border-gray-300" />
      <p>
        <i className="fa-solid fa-user-group"></i>{" "}
        {meetInfo.participants.join(", ")}
      </p>
      <hr className="w-full border-gray-300" />
      <p>
        <i className="fa-solid fa-pen"></i> {meetInfo.content}
      </p>
    </div>
  );
};

export default MeetDetail;
