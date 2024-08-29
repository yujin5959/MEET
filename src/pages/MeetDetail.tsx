import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FooterNav from "../components/FooterNav";
import { server } from "@/utils/axios";

type MeetInfo = {
  id: string;
  title: string;
  content: string;
  type: string;
  date: {
    value: string;
    editable: string;
  } | null;
  place: {
    value: string;
    editable: string;
  } | null;
  isAuthor: string;
  participantsNum: string;
  participants: string[];
  editable: string;
};

const MeetDetail: React.FC = () => {
  const { meetId } = useParams<{ meetId: string }>();
  const [meetInfo, setMeetInfo] = useState<MeetInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetDetail = () => {
      if (meetId) {
        server
          .get(`/meet?meetId=${meetId}`)
          .then((response) => {
            const data = response.data;
            if (typeof data.participants === "string") {
              try {
                data.participants = JSON.parse(data.participants.replace(/'/g, '"'));
              } catch (parseError) {
                console.error("참여자 데이터 파싱 오류:", parseError);
                data.participants = [];
              }
            }
            setMeetInfo(data);
          })
          .catch((error) => {
            if (error.code === "403") {
              navigate("/Unauthorized");
            } else if (error.code === "404") {
              navigate("/not-found");
            }
          });
      }
    };

    fetchMeetDetail();
  }, [meetId, navigate]);

  const handleEdit = () => {
    if (meetInfo) {
      navigate(`/meet/edit/${meetInfo.id}`);
    }
  };

  const handleDelete = () => {
    if (meetId) {
      server
        .delete(`/meet?meetId=${meetId}`)
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          if (error.code === "403") {
            navigate("/Unauthorized");
          } else if (error.code === "404") {
            navigate("/not-found");
          }
        });
    }
  };

  if (!meetInfo) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  // date.value를 Date 객체로 변환
  const meetingDate = meetInfo.date?.value ? new Date(meetInfo.date.value) : null;
  const formattedDate = meetingDate
    ? `${meetingDate.getFullYear()}-${('0' + (meetingDate.getMonth() + 1)).slice(-2)}-${('0' + meetingDate.getDate()).slice(-2)}`
    : "날짜 미정";

    return (
      <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: "#F2F2F7" }}>
        <div className="flex flex-col items-start m-8 space-y-4">
          <div className="flex items-center w-full mb-4">
            {/* 뒤로가기 버튼 */}
            <i
              className="fa-solid fa-chevron-left text-[25px] text-[#AEAEB2] cursor-pointer"
              onClick={() => navigate(-1)}
            ></i>
          </div>
          <h1 className="text-2xl font-bold pl-4 mb-4">모임 정보</h1>
          {/* <h1 className="text-lg font-bold">{meetInfo.title || "모임 제목"}</h1> */}
          <div className="w-full bg-white p-6 rounded-[24px] space-y-2 text-left">
          <p className="text-sm text-[#8E8E93]">제목</p>
          <p className="text-lg font-bold">{meetInfo.title}</p>
          <p className="text-sm text-[#8E8E93]">날짜</p>
          <p className="text-lg font-bold">{formattedDate}</p>
          <p className="text-sm text-[#8E8E93]">위치</p>
          <p className="text-lg font-bold">{meetInfo.place?.value ? meetInfo.place.value : "장소 미정"}</p>
          <p className="text-sm text-[#8E8E93]">내용</p>
          <p className="text-lg font-bold">{meetInfo.content ? meetInfo.content : "내용 없음"}</p>
          <p className="text-sm text-[#8E8E93]">참여자</p>
          <p className="text-lg font-bold">{meetInfo.participants.length > 0 ? meetInfo.participants.join(", ") : " 참여자 없음"}</p>

          </div>

          {meetInfo.isAuthor === "true" && (
          <div className="flex w-full mt-4">
          <button
            onClick={handleEdit}
            className="mr-2 flex-1 px-4 py-3 bg-[#FFE607] rounded-[24px] text-black font-bold"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-[#FF3B30] rounded-[24px] text-black font-bold"
          >
            삭제
          </button>
          </div>
          )}
        </div>
        <FooterNav />
      </div>
    );
  };
export default MeetDetail;
