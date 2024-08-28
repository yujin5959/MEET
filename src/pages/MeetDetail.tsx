import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";

type MeetInfo = {
  id: string;
  title: string;
  content: string;
  type: string;
  date: {
    value: string;
    editable: string;
  } | null; // date를 null로 설정할 수 있도록 수정
  place: {
    value: string;
    editable: string;
  } | null; // place를 null로 설정할 수 있도록 수정
  isAuthor: string;
  participantsNum: string;
  participants: string[];
  editable: string; // editable 필드 추가
};

const MeetDetail: React.FC = () => {
  const { meetId } = useParams<{ meetId: string }>();
  const [meetInfo, setMeetInfo] = useState<MeetInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // useNavigate hook을 사용하여 페이지 이동 처리

  useEffect(() => {
    console.log("meetId:", meetId);
  
    const fetchMeetDetail = () => {
      if (meetId) {
        setLoading(true); // 로딩 상태 설정
        server
          .get(`/meet?meetId=${meetId}`)
          .then((response) => {
            // participants가 문자열로 넘어오는 경우 변환 처리
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
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setError("모임 ID가 제공되지 않았습니다.");
        setLoading(false);
      }
    };
  
    fetchMeetDetail();
  }, [meetId, navigate]); // navigate를 의존성 배열에 추가

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
          if(error.code === "403"){
            navigate("/Unauthorized");
          }
          else if(error.code === "404"){
            navigate("/not-found");
          }
        });
    }
  };  

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  if (!meetInfo) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // date.value를 Date 객체로 변환
  const meetingDate = meetInfo.date?.value ? new Date(meetInfo.date.value) : null;
  const formattedDate = meetingDate
    ? `${meetingDate.getFullYear()}-${('0' + (meetingDate.getMonth() + 1)).slice(-2)}-${('0' + meetingDate.getDate()).slice(-2)}`
    : "날짜 미정";

  return (
    <div className="flex flex-col items-start m-8 space-y-4">
      <h1 className="text-lg font-bold">{meetInfo.title || "모임 제목"}</h1>
      <p>
        <i className="fa-solid fa-calendar-days"></i> {formattedDate}
      </p>
      <hr className="w-full border-gray-300" />
      <p>
        <i className="fa-solid fa-location-dot"></i> {meetInfo.place?.value ? meetInfo.place.value : "장소 미정"}
      </p>
      <hr className="w-full border-gray-300" />
      <p>
        <i className="fa-solid fa-user-group"></i>
        {meetInfo.participants.length > 0 ? meetInfo.participants.join(", ") : " 참여자 없음"}
      </p>
      <hr className="w-full border-gray-300" />
      <p>
        <i className="fa-solid fa-pen"></i> {meetInfo.content}
      </p>
      {meetInfo.editable === "true" && (
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetDetail;