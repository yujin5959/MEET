import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScheduleVoteBefore from "@/components/ScheduleVoteBefore";
import ScheduleVoteAfter from "@/components/ScheduleVoteAfter";
import PlaceVoteBefore from "@/components/PlaceVoteBefore";
import PlaceVoteAfter from "@/components/PlaceVoteAfter";
import { server } from "@/utils/axios";
import { Schedule } from "@/types/ScheduleVote";
import { Place } from "@/types/PlaceVote";

type Meet = {
  meetTitle: string;
  endDate: string;
};

const VotePage = () => {
  const navigate = useNavigate();
  const { meetId } = useParams<{ meetId: string }>();
  const [meet, setMeet] = useState<Meet>({ meetTitle: '', endDate: '' });
  const [scheduleList, setScheduleList] = useState<Schedule[]>([]);
  const [placeList, setPlaceList] = useState<Place[]>([]);
  const [isScheduleVoted, setIsScheduleVoted] = useState<boolean>(false);
  const [isPlaceVoted, setIsPlaceVoted] = useState<boolean>(false);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  
  // 페이지에 처음 로드될 때
  useEffect(() => {
    const fetchVote = async () => {
      await fetchMeet();
      await fetchScheduleVoteItems();
      await fetchPlaceVoteItems();
      await checkUserVotedBefore();
    }
    fetchVote();
  }, [meetId]);
  
  // 투표 상태에 따라 투표 항목 다시 조회
  useEffect(() => {
    if (isScheduleVoted) {
      fetchScheduleVoteItems();
    }
    if (isPlaceVoted) {
      fetchPlaceVoteItems();
    }
  }, [isScheduleVoted, isPlaceVoted]);

  // 모임 정보 조회
  const fetchMeet = () => {
    const fetchSchedule = server.get(`/meet/schedule?meetId=${meetId}`);
    const fetchPlace = server.get(`/meet/place?meetId=${meetId}`);
  
    Promise.all([fetchSchedule, fetchPlace])
      .then(([scheduleResponse, placeResponse]) => {
        setMeet({
          meetTitle: scheduleResponse.data.meetTitle,
          endDate: placeResponse.data.endDate,
        });
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };
  

  // 일정 투표 항목 조회
  const fetchScheduleVoteItems = async () => {
    server
      .get(`/meet/schedule/item/list?meetId=${meetId}`)
      .then((response) => {
        setScheduleList(response.data);
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };

  // 장소 투표 항목 조회
  const fetchPlaceVoteItems = async () => {
    server
      .get(`/meet/place/item/list?meetId=${meetId}`)
      .then((response) => {
        setPlaceList(response.data);
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };

  // 사용자 투표 여부 확인 함수
  const checkUserVotedBefore = () => {
    server.get("/member")
      .then((response) => {
        const loginedUserId = response.data.id;
        const scheduleVoted = scheduleList.some(schedule => 
          schedule.memberList.some(member => member.id === loginedUserId)
        );
        const placeVoted = placeList.some(place => 
          place.memberList.some(member => member.id === loginedUserId)
        );
        setIsScheduleVoted(scheduleVoted);
        setIsPlaceVoted(placeVoted);
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
};

  // 투표하기 버튼 클릭 핸들러
  const handleVoteClick = () => {
    server
      .put("/meet/schedule", {
        data: {
          meetId: meetId,
          scheduleVoteItemList: selectedScheduleIds,
        },
      })
      .then(() => {
        setIsScheduleVoted(true);
  
        return server.put("/meet/place", {
          data: {
            meetId: meetId,
            placeVoteItemList: selectedPlaceIds,
          },
        });
      })
      .then(() => {
        setIsPlaceVoted(true);
  
        return Promise.all([fetchScheduleVoteItems(), fetchPlaceVoteItems()]);
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };  

  // 다시 투표하기 버튼 클릭 핸들러
  const handleVoteAgain = async () => {
    setIsScheduleVoted(false);
    setIsPlaceVoted(false); 
  };

  // 상태 업데이트를 위한 핸들러
  const handleScheduleChange = (scheduleIds: string[]) => {
    setSelectedScheduleIds(scheduleIds);
  };

  const handlePlaceChange = (placeIds: string[]) => {
    setSelectedPlaceIds(placeIds);
  };

  // 네비바 클릭 핸들러
  const handleTabClick = (tab: string, path: string) => {
     setActiveTab(tab);
     navigate(path);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#F2F2F7" }}
    >
      {/* 헤더 및 뒤로가기 버튼 */}
      <div className="flex flex-col items-start m-6 mb-3">
        <div className="flex pt-6 pb-6">
          <i 
            className="fa-solid fa-chevron-left text-[25px] text-[#AEAEB2]"
            onClick={() => navigate("/")}
          ></i>
        </div>
        <h1 className="text-2xl font-bold pl-4">
          {meet.meetTitle}
        </h1>
        <span className="text-[13px] text-[#8E8E93] mt-1 pl-4">
          투표 마감: {meet.endDate}
        </span>
      </div>
  
      {/* 일정 투표 섹션 */}
      <div className="bg-white rounded-[24px] space-y-2 p-6 m-6 mt-0">
        {isScheduleVoted ? (
          <ScheduleVoteAfter
            scheduleList={scheduleList}
            setIsVoted={setIsScheduleVoted}
            fetchScheduleVoteItems={fetchScheduleVoteItems}
          />
        ) : (
          <ScheduleVoteBefore
            meetId={meetId || ""}
            scheduleList={scheduleList}
            setIsVoted={setIsScheduleVoted}
            fetchScheduleVoteItems={fetchScheduleVoteItems}
            handleScheduleChange={handleScheduleChange}
          />
        )}
      </div>
  
      {/* 장소 투표 섹션 */}
      <div className="bg-white rounded-[24px] space-y-2 p-6 m-6 mt-0">
        {isPlaceVoted ? (
          <PlaceVoteAfter
            placeList={placeList}
            onVoteAgain={handleVoteAgain}
          />
        ) : (
          <PlaceVoteBefore
            meetId={meetId || ""}
            placeList={placeList} 
            setIsVoted={setIsPlaceVoted}
            fetchPlaceVoteItems={fetchScheduleVoteItems}
            handlePlaceChange={handlePlaceChange}
          />
        )}
      </div>
  
      {/* 투표하기 버튼/다시 투표하기 버튼 */}
      <button
        onClick={isScheduleVoted && isPlaceVoted ? handleVoteAgain : handleVoteClick}
        className="h-[55px] bg-[#FFE607] p-2 mx-6 rounded-[24px] text-black text-[16px] font-bold"
        style={{ outline: "none", border: "none" }}
      >
        {isScheduleVoted && isPlaceVoted ? "다시 투표하기" : "투표하기"}
      </button>

      {/* Footer */}
      <footer 
        className="w-full h-[73px] bg-white flex justify-around items-center border-t border-[#E5E5EA]"
        style={{ position: "fixed", bottom: 0 }}
      >
        <div 
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "list" ? "text-black" : "text-[#AEAEB2]"
          }`}
          onClick={() => handleTabClick("list", "/meet")}
        >
          <i className="fa-solid fa-bars text-[24px] mb-1"></i>
          <span className="text-[10px]">LIST</span>
        </div>
        <div 
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "home" ? "text-black" : "text-[#AEAEB2]"
          }`}
          onClick={() => handleTabClick("home", "/")}
        >
          <i className="fa-solid fa-house text-[24px] mb-1"></i>
          <span className="text-[10px]">HOME</span>
        </div>
        <div 
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === "admin" ? "text-black" : "text-[#AEAEB2]"
          }`}
          onClick={() => handleTabClick("admin", "/admin")}
        >
          <i className="fa-solid fa-user text-[24px] mb-1"></i>
          <span className="text-[10px]">ADMIN</span>
        </div>
      </footer>
    </div>
  );  
};

export default VotePage;