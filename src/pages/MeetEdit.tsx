import React, { useState, useEffect } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";
import { MeetInfo } from "@/types/MeetInfo";
import FooterNav from "../components/FooterNav";


const MeetEdit: React.FC = () => {
  const navigate = useNavigate();

  const [meetInfo, setMeetInfo] = useState<MeetInfo | null>(null);
  const {meetId} = useParams();
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
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
        setTime(response.data.date.time);
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

  const handleSubmit = (e: React.FormEvent) => {
    server.put(`/meet?meetId=${meetId}` , {
        data: {
          title: title,
          content: content,
          date: date,
          time: time,
          place: place,
        }
      })
      .then((response) => {
        // 저장 후 이전 페이지로 이동
        navigate(`/meet/${meetId}`);
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
        <div className="flex flex-col items-start m-8">
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

      {/* 하단 네비게이션 바 */}
      <FooterNav />
    </div>
  );
};

export default MeetEdit;

