import React, { useEffect, useState } from "react";
import { Place } from "@/types/PlaceVote";

type PlaceVoteAfterProps = {
  placeList: Place[];
};

const PlaceVoteAfter = ({
  placeList,
}: PlaceVoteAfterProps) => {
  const [mostVotedPlaceIds, setMostVotedPlaceIds] = useState<string[]>([]);

 // 컴포넌트가 처음 마운트될 때와 placeList가 변경될 때 실행
  useEffect(() => {
    setMostVotedPlaceIds(findTopPlaceIds(placeList)); 
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
          <div className="flex items-center">
            {place.isVote === "true" && (
              <i className="fa-solid fa-check text-[black] mr-2"></i>
            )}
            <span>{place.place}</span>
          </div>
          <span className="text-[#8E8E93] text-[13px]">{place.memberList.length}명</span>
        </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceVoteAfter;
