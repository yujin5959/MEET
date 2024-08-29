import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";
import FooterNav from "../components/FooterNav";
import magnifier from "../assets/img/magnifier.png";
import calender from "../assets/img/calender.png"

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
  }, []);

  return (
    <div 
      className="className=min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#F2F2F7", paddingBottom: "80px" }}
    > 
    <div className="m-8">
      <div className="flex flex-col items-center justify-center h-[194px] bg-white rounded-[23px] space-y-2">
        <img src={magnifier} className="w-[69px] h-[69px]"></img>
        <h1 className="text-[20px] font-bold text-black">
          지금 참여할 모임을 찾아보세요
        </h1>
        <p className="text-[12px] text-[#8E8E93]">
          즐거운 시간을 보낼 기회를 놓치지 마세요!
        </p>
      </div>
    
      {/* 메인 콘텐츠 */}
      <div> 
      <p className="flex flex-row-reverse text-[12px] text-[#AEAEB2] mt-6 mb-2 mr-4">날짜순</p>
        <div className="flex flex-col items-center space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : meetList.length > 0 ? (
            meetList.map((meet) => (
              <Link
                to={`/meet?meetId=${meet.id}`}
                key={meet.id}
                className="w-full h-[86px] flex flex-row justify-around items-center bg-white rounded-[20px] p-3"
                style={{ boxShadow: "1px 1px 10px 0 rgba(0, 0, 0, 0.05)" }}
              >
                <img src={calender} className="w-[28.3px] h-[25px]"></img>
                <div className="w-[170px] flex flex-col items-start">
                  <h2 className="text-[15px] font-bold text-black">{meet.title}</h2>
                  <p className="text-[12px] text-[#AEAEB2]">{meet.date ? meet.date : "날짜 미정"}</p>
                  <p className="text-[12px] text-[#AEAEB2]">{meet.place ? meet.place : "장소 미정"}</p>
                </div>
                <i className="fa-solid fa-chevron-right text-[20px] text-[#AEAEB2]"></i>
              </Link>
            ))
          ) : (
            <div>No meetings found.</div>
          )}
        </div>
      </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <FooterNav />
    </div>
  );
};

export default MeetList;
