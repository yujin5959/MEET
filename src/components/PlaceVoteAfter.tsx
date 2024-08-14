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
    <div className="space-y-4 flex flex-col h-full">
      <div className="overflow-y-auto flex-grow" style={{ maxHeight: "60vh" }}>
        {placeList.map((place) => (
        <div
          key={place.id}
          className={`flex items-center justify-between p-2 my-2 ${
            mostVotedPlaceIds.includes(place.id) ? "bg-yellow-200" : ""
          } rounded-lg`}
        >
          <span>{place.place}</span>
          <span className="ml-4">투표 수: {place.memberList.length}</span>
        </div>
        ))}
      </div>
      <button
        onClick={onVoteAgain}
        className="bg-gray-200 rounded-lg px-4 py-2 text-black w-full"
      >
        다시 투표하기
      </button>
    </div>
  );
};

export default PlaceVoteAfter;
