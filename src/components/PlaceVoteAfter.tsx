import React, { useEffect, useState } from "react";
import { Place } from "@/types/PlaceVote";

// 컴포넌트 props 타입 정의
type PlaceVoteAfterProps = {
  placeList: Place[];
  onVoteAgain: () => void;
};

const PlaceVoteAfter = ({
  placeList,
  onVoteAgain
}: PlaceVoteAfterProps) => {
  const [mostVotedPlaceIds, setMostVotedPlaceIds] = useState<string[]>([]);

 // 컴포넌트가 처음 마운트될 때와 placeList가 변경될 때 실행
  useEffect(() => {
    setMostVotedPlaceIds(findTopPlaceIds(placeList)); // 가장 많이 투표된 장소 id 업데이트
  }, [placeList]);

  // 가장 많은 투표를 받은 장소를 찾는 함수
  const findTopPlaceIds = (places: Place[]): string[] => {
    if (places.length === 0) return [];

    const maxLength = places.reduce((max, place) => {
      return Math.max(max, place.memberList.length);
    }, 0);

    return places
      .filter((place) => place.memberList.length === maxLength)
      .map((place) => place.id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-grow">
        {placeList.map((place) => (
        <div
          key={place.id}
          className={`flex items-center justify-between pr-2 my-2 ${
            mostVotedPlaceIds.includes(place.id) ? "border-b-[5px] border-[#FFE607] my-2" : ""
          }`}
        >
          <span>{place.place}</span>
          <span className="text-[#8E8E93] text-[13px]">{place.memberList.length}명</span>
        </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceVoteAfter;
