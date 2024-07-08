import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type MeetInfo = {
  id: string;
  title: string;
  date: string;
  place: string;
};

const meetList: MeetInfo[] = [
  {
    id: "1",
    title: "2024 3분기 정기모임",
    date: "2024-07-05",
    place: "강남역",
  },
  {
    id: "2",
    title: "2024 4분기 정기모임",
    date: "2024-11-05",
    place: "강남역",
  },
];

const MeetList: React.FC = () => {
  //   const [meetList, setMeetList] = useState<MeetInfo[]>([]);

  //   useEffect(() => {
  //     const fetchMeetList = async () => {
  //       try {
  //       } catch (error) {
  //         console.error("모임 리스트를 가져오는 중 오류 발생:", error);
  //       }
  //     };

  //     fetchMeetList();
  //   }, []);

  return (
    <div className="flex flex-col items-center m-8 space-y-4">
      {meetList.map((meet) => (
        <Link
          to={`/meet/${meet.id}`}
          key={meet.id}
          className="w-full p-4 bg-white shadow rounded-md hover:bg-gray-100 text-black text-left"
        >
          <h2 className="text-xl font-bold">{meet.title}</h2>
          <p>
            <i className="fa-solid fa-calendar-days"></i> {meet.date}
          </p>
          <p>
            <i className="fa-solid fa-location-dot"></i> {meet.place}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default MeetList;
