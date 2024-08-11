import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";
import FooterNav from "../components/FooterNav";

type MeetInfo = {
  id: string;
  title: string;
  date: string | null;
  place: string | null;
};

const MeetList: React.FC = () => {
  const [meetList, setMeetList] = useState<MeetInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetList = () => {
      setLoading(true);
      
      server.get(`/meet/list`)
        .then((response) => {
          console.log("Response data:", response.data);
          setMeetList(response.data);
        })
        .catch(() => {
          navigate("/not-found");
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    fetchMeetList();
  }, [navigate]);

  return (
    <div className="relative min-h-screen pb-20 bg-gray-100"> {/* 콘텐츠에 하단 여백 추가 */}
    <div className="fixed top-0 left-0 w-full bg-blue-500 text-white shadow-lg rounded-b-3xl" style={{ height: "120px", zIndex: 10 }}>
      <div className="flex flex-col items-center justify-center h-full px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 leading-tight">
          지금 참여할 모임을 찾아보세요!
        </h1>
        <p className="text-base md:text-lg max-w-xl mx-auto mt-2 md:mt-4 leading-relaxed">
          시간과 장소를 보고 자신에게 맞는 모임을 찾아보세요. <br />
          즐거운 시간을 보낼 기회를 놓치지 마세요!
        </p>
      </div>
    </div>
      {/* 메인 콘텐츠 */}
      <div className="pt-20 bg-gray-100"> {/* 패딩을 줄여서 헤더와의 간격을 조정 */}
        <div className="pt-4 flex flex-col items-center m-8 space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : meetList.length > 0 ? (
            meetList.map((meet) => (
              <Link
                to={`/meet/${meet.id}`}
                key={meet.id}
                className="w-full p-4 bg-white shadow rounded-md hover:bg-gray-100 text-black text-left"
              >
                <h2 className="text-xl font-bold">{meet.title}</h2>
                <p>
                  <i className="fa-solid fa-calendar-days"></i>{" "}
                  {meet.date ? meet.date : "날짜 미정"}
                </p>
                <p>
                  <i className="fa-solid fa-location-dot"></i>{" "}
                  {meet.place ? meet.place : "장소 미정"}
                </p>
              </Link>
            ))
          ) : (
            <div>No meetings found.</div>
          )}
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <FooterNav />
    </div>
  );
};

export default MeetList;
