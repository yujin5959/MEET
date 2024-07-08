import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type MeetInfo = {
  title: string;
  content: string;
  type: string;
  date: string;
  place: string;
  participantsNum: string;
  participants: string[];
};

const MeetDetail: React.FC = () => {
  const { meetId } = useParams<{ meetId: string }>();

  const [meetInfo, setMeetInfo] = useState<MeetInfo>({
    title: "",
    content: "",
    type: "",
    date: "",
    place: "",
    participantsNum: "",
    participants: [],
  });

  useEffect(() => {
    const fetchMeetDetail = async () => {
      try {
        // const response = await fetch(`http://54.180.29.36/meet/${meetId}`);
        // const data = await response.json();
        // setMeetInfo(data);
      } catch (error) {
        console.error("모임 상세 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchMeetDetail();
  }, [meetId]);

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
