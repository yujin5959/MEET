import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

type MeetInfo = {
  id: string;
  title: string;
  date: string;
  place: string;
  content: string;
};

const MeetEdit: React.FC = () => {
  const { meetId } = useParams<{ meetId: string }>();
  const navigate = useNavigate();

  const [meetInfo, setMeetInfo] = useState<MeetInfo | null>(null);
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // meetId가 1일 때 예시
    if (meetId === "1") {
      const data: MeetInfo = {
        id: "1",
        title: "2024 3분기 정기모임",
        date: "2024-07-05",
        place: "강남역",
        content: "정기 모임 입니다.",
      };
      setMeetInfo(data);
      setTitle(data.title);
      setDate(data.date);
      setPlace(data.place);
      setContent(data.content);
    }
  }, [meetId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      date,
      place,
      content,
    });

    // 저장 후 이전 페이지로 이동
    navigate(`/meet/${meetId}`);
  };

  if (!meetInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#F2F2F7" }}
      >
        <div className="flex flex-col items-start m-6 space-y-6">
        <div className="flex pt-6 pb-6">
          {/* 뒤로가기 버튼 */}
            <i 
              className="fa-solid fa-chevron-left text-[25px] text-[#AEAEB2]"
              onClick={() => navigate("/meet")}
            ></i>
        </div>
        <h1 className="text-2xl font-bold pl-4">모임 정보 수정</h1>
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
        {/* 수정하기 버튼 */}
        <button
          type="submit"
          className="w-full h-[55px] bg-[#FFE607] p-2 rounded-[24px] text-black text-[16px] font-bold"
          onClick={handleSubmit}  
        >
          수정하기
        </button>
      </div>
    </div>
  );
};

export default MeetEdit;

