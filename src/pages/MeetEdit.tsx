import React, { useState, useEffect } from "react";
import { useLocation , useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";
import { MeetInfo } from "@/types/MeetInfo";


const MeetEdit: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("");

  const [meetInfo, setMeetInfo] = useState<MeetInfo | null>(null);
  const [meetId, setMeetId] = useState<string | null>(queryParams.get('meetId'));
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [content, setContent] = useState<string>("");
  
  useEffect(() => {
    // meetId 확인
    if (meetId) {
      //meet 조회
      server.get(`/meet?meetId=${meetId}`)
      .then((response) => {
        setMeetInfo(response.data);
        setTitle(response.data.title);
        setDate(response.data.date.value);
        setPlace(response.data.place.value);
        setContent(response.data.content);

        if(response.data.date.editable === 'false'){
          const inputElement = document.getElementById('dateInput')! as HTMLInputElement;
          inputElement.readOnly = true;
        }

        if(response.data.place.editable === 'false'){
          const inputElement = document.getElementById('placeInput')! as HTMLInputElement;
          inputElement.readOnly = true;
        }
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
    }
    else{// meet Id 존재 x
      navigate("/not-found");
    }
  }, [meetId]);

  const handleTabClick = (tab: string, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };

  const handleSubmit = (e: React.FormEvent) => {
    server.put(`/meet?meetId=${meetId}` , {
        data: {
          title: title,
          content: content,
          date: date,
          place: place,
        }
      })
      .then((response) => {
        // 저장 후 이전 페이지로 이동
        navigate(`/meet?meetId=${meetId}`);
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });

    
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#F2F2F7" }}
      >
        <div className="flex flex-col items-start m-6">
        <div className="flex pt-6 pb-6">
          {/* 뒤로가기 버튼 */}
            <i 
              className="fa-solid fa-chevron-left text-[25px] text-[#AEAEB2]"
              onClick={() => navigate("/meet")}
            ></i>
        </div>
        <h1 className="text-2xl font-bold pl-4 mb-4">모임 정보 수정</h1>
        <form 
          className="w-full bg-white p-6 rounded-[24px] space-y-2" 
          onSubmit={handleSubmit}
        >
          {/* 제목 입력 필드 */}
          <div>
          <label className="block text-[13px] text-[#8E8E93] text-left">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 block w-full text-[18px] font-bold bg-transparent"
          />
          </div>

          {/* 날짜 입력 필드 */}
          <div>
          <label className="block text-[13px] text-[#8E8E93] text-left">날짜</label>
          <input
            id='dateInput'
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 block w-full text-[18px] font-bold bg-transparent"
          />
          </div>

          {/* 장소 입력 필드 */}
          <div>
          <label className="block text-[13px] text-[#8E8E93] text-left">장소</label>
          <input
            id='placeInput'
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="mt-2 block w-full text-[18px] font-bold bg-transparent"
          />
          </div>

          {/* 내용 입력 필드 */}
          <div>
          <label className="block text-[13px] text-[#8E8E93] text-left">내용</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2 block w-full text-[18px] font-bold bg-transparent"
          />
          </div>
        </form>
        {/* 저장하기 버튼 */}
        <button
          type="submit"
          className="w-full h-[55px] bg-[#FFE607] p-2 mt-6 rounded-[24px] text-black text-[16px] font-bold"
          onClick={handleSubmit}  
        >
          저장하기
        </button>
      </div>
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
            activeTab === "my" ? "text-black" : "text-[#AEAEB2]"
          }`}
          onClick={() => setActiveTab("my")}
        >
          <i className="fa-solid fa-user text-[24px] mb-1"></i>
          <span className="text-[10px]">MY</span>
        </div>
      </footer>
    </div>
  );
};

export default MeetEdit;

