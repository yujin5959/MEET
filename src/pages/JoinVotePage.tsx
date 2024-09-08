import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JoinVoteBefore from "../components/JoinVoteBefore";
import JoinVoteAfter from "../components/JoinVoteAfter";
import alarm from '../assets/img/alarm.png';
import vote from '../assets/img/vote.png';
import FooterNav from "../components/FooterNav";
import { server } from "@/utils/axios";
import { voteItem } from "@/types/JoinVote";
import { ParticipationInfo } from "@/types/participationInfo";

const JoinVotePage = () => {
  const navigate = useNavigate();
  const {meetId} = useParams();
  const [meet, setMeet] = useState<ParticipationInfo>();
  const [itemList, setItemList] = useState<voteItem[]>([]);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [votedItem, setVotedItem] = useState<string>(""); //투표 여부 상태 저장을 위한

  // 페이지에 처음 로드될 때
  useEffect(() => {
    const fetchData = async () => {
      if (meetId) {
        await fetchMeet(); // 모임 정보
        await fetchMemberInfo();
      }
      else{
        navigate('/not-found');
      }
    };
    fetchData();
  }, [meetId]);

  // isVoted가 변경될 때
  useEffect(() => {
    const fetchData = async () => {
      await fetchItemList();
    };
  
    fetchData();
  }, [isVoted]);
  
  const fetchMemberInfo = () => {
    server
      .get(`/meet/participate/item/list?meetId=${meetId}`)
      .then((response) => {
        response.data.forEach((item: voteItem) => {
          if (item.isVote === "true") {
              setIsVoted(true);
              setVotedItem(item.id);
          }
        });
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });

  }

  // 모임 정보 조회
  const fetchMeet = () => {
    server
      .get(`/meet/participate?meetId=${meetId}`)
      .then((response) => {
        const data = response.data;

        const meetDateString = data.date || "날짜 미정";
        const formattedMeetDate = formatDate(meetDateString);

        const endDateString = data.endDate || "정보 없음";
        const formattedEndDate = formatDate(endDateString);

        setMeet({
          meetTitle: data.meetTitle || "제목 없음",
          date: formattedMeetDate,
          endDate: formattedEndDate,
          place: data.place || "장소 미정",
          isAuthor: data.isAuthor
        });
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };

  // 사용자가 이미 투표했는지 확인하는 함수
  const fetchItemList = () => {
    server.get(`/meet/participate/item/list?meetId=${meetId}`)
      .then((response) => {
        setItemList(response.data)
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };
  
  const formatDate = (dateString: string) => {
    const formattedString = dateString.replace(" ", "T");
    const date = new Date(formattedString);

    if (isNaN(date.getTime())) {
      return "날짜 미정";
    }

    return date.toLocaleString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };;

  // 수정 버튼 클릭 이벤트 함수
  const handleEdit = () => {
    navigate(`/meet/edit/${meetId}`); 
  };

  // 삭제 버튼 클릭 이벤트 함수
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
  
  return (
    <div className="overflow-y-auto w-full flex flex-col" style={{ backgroundColor: "#F2F2F7" , paddingBottom: "90px" }}>
      <div className="flex flex-col items-start m-6">
        <div className="flex justify-around item-center w-full mb-4">
          <h1 className="text-2xl font-bold pl-4">모임 정보</h1>

           {/* isAuthor가 true일 때만 수정, 삭제 버튼 표시 */}
           {meet?.isAuthor && (
              <div className="flex space-x-2 mt-1">
                <button
                  onClick={handleEdit} 
                  className="w-16 px-4 py-2 bg-[#FFE607] rounded-[24px] text-black text-sm font-bold"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete} 
                  className="w-16 px-4 py-2 bg-[#FF3B30] rounded-[24px] text-black text-sm font-bold"
                >
                  삭제
                </button>
              </div>
            )}
        </div>

        <div className="w-full bg-white p-6 rounded-[24px] space-y-2 flex items-center">
        
        <img src={alarm} alt="확성기 이미지" className="w-16 h-16 mr-4" />
        {/* 텍스트 부분 */}
        <div className="flex flex-col space-y-2">
          <p className="text-lg font-bold text-left">{meet?.meetTitle}</p>
          <p className="text-lg font-bold text-left">{meet?.date}</p>
          <p className="text-lg font-bold text-left">{meet?.place}</p>
        </div>
        </div>
        {/* 두 번째 블록 */}
        <div className="mt-5 w-full bg-[#E5E5EA] p-6 rounded-[24px] flex items-center">
          <div className="flex flex-col space-y-2 flex-grow pr-4">
            <h2 className="text-2xl font-bold text-left">모임에<br/>참여하시겠습니까?</h2>
            <p className="text-sm text-left text-[#8E8E93]">투표 마감: {meet?.endDate}</p>
          </div>
          <img src={vote} alt="확성기 이미지" className="w-16 h-16 ml-4" />
        </div>
        <div className="w-full mt-6">
          {isVoted ? (
            <JoinVoteAfter votedItemId={votedItem} setIsVoted={setIsVoted} itemList={itemList}/>
          ) : (
            <JoinVoteBefore meetId={meetId!} setIsVoted={setIsVoted} setVotedItem={setVotedItem} itemList={itemList}/>
            
          )}
        </div>
      </div>
      <FooterNav />
    </div>
  );
};
export default JoinVotePage;
