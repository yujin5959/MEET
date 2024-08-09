import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlaceVoteBefore from "@/components/PlaceVoteBefore";
import PlaceVoteAfter from "@/components/PlaceVoteAfter";
import { server } from "@/utils/axios";
import { PlaceMeet, Place } from "@/types/PlaceVote";

const PlaceVotePage = () => {
  const navigate = useNavigate();
  const { meetId } = useParams<{ meetId: string }>();
  const [meet, setMeet] = useState<PlaceMeet>({
    meetTitle: "",
    meetDate: "",
    endDate: "",
  });
  const [placeList, setPlaceList] = useState<Place[]>([]);
  const [isVoted, setIsVoted] = useState<boolean>(false);

  // 컴포넌트가 처음 마운트될 때 모임과 장소 목록을 가져오는 함수 호출
  useEffect(() => {
    const fetchMeetPlace = async () => {
      await fetchMeet();
      await fetchPlaceVoteItems();
    };

    fetchMeetPlace();
  }, [meetId, navigate]);

  // 장소 목록이 변경될 때 사용자가 이미 투표했는지 확인하는 함수 호출
  useEffect(() => {
    const fetchIsVoted = async () => {
      await checkUserVotedBefore();
    };
    fetchIsVoted();
  }, [meet, placeList]);

  // 모임 정보 조회
  const fetchMeet = async () => {
    server
      .get(`/meet/place?meetId=${meetId}`)
      .then((response) => {
        setMeet(response.data);
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };

  // 장소 투표 목록 조회
  const fetchPlaceVoteItems = async () => {
    server
      .get(`/meet/place/item/list?meetId=${meetId}`)
      .then((response) => {
        console.log("Fetched place vote items:", response.data);
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

  // 사용자가 이미 투표했는지 확인하는 함수
  const checkUserVotedBefore = async () => {
    let loginedUserId;
    await server
      .get("/member")
      .then((response) => {
        loginedUserId = response.data.id; // 로그인한 사용자의 ID를 저장
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });

    // 장소 목록을 순회하며 사용자가 이미 투표했는지 확인
    for (const place of placeList) {
      for (const member of place.memberList) {
        if (member.id === loginedUserId) {
          setIsVoted(true);
          return;
        }
      }
    }
    return;
  };

  const updatePlaceList = (newPlaceList: Place[]) => {
    setPlaceList(newPlaceList);
  };

  return (
    <div className="bg-white p-8 md:p-8 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{meet.meetTitle}</h1>
        <div>
          <p className="text-sm">모임 날짜: {meet.meetDate}</p>
          <p className="text-sm">투표 마감: {meet.endDate.replace("T", " ")}</p>
        </div>
      </div>
      <div className="p-4">
        {isVoted ? (
          <PlaceVoteAfter
            placeList={placeList}
            setIsVoted={setIsVoted}
            fetchPlaceVoteItems={fetchPlaceVoteItems}
          />
        ) : (
          <PlaceVoteBefore
            meetId={meetId || ""}
            placeList={placeList}
            setIsVoted={setIsVoted}
            fetchPlaceVoteItems={fetchPlaceVoteItems}
          />
        )}
      </div>
    </div>
  );
};
export default PlaceVotePage;
