import React, { useEffect } from "react";
import { Place } from "@/types/PlaceVote";

// 컴포넌트 props 타입 정의
type PlaceVoteAfterProps = {
  placeList: Place[];
  setIsVoted: (value: boolean) => void;
  fetchPlaceVoteItems: () => Promise<void>;
};

const PlaceVoteAfter = ({
  placeList,
  setIsVoted,
  fetchPlaceVoteItems,
}: PlaceVoteAfterProps) => {
  // 컴포넌트가 처음 마운트될 때 장소 투표 항목을 가져옴
  useEffect(() => {
    fetchPlaceVoteItems();
  }, []);

  var mostVotedPlaceIds: string[] = [];

  // 가장 많은 투표를 받은 장소를 찾는 함수
  const findPlacesWithLongestMemberList = (places: Place[]): string[] => {
    if (places.length === 0) return [];

    const maxLength = places.reduce((max, place) => {
      return Math.max(max, place.memberList.length);
    }, 0);

    return places
      .filter((place) => place.memberList.length === maxLength)
      .map((place) => place.id);
  };

  // 다시 투표하기 버튼 클릭 시 호출되는 함수
  const handleVoteClick = () => {
    setIsVoted(false); // PlaceVoteBefore로 돌아감
  };

  mostVotedPlaceIds = findPlacesWithLongestMemberList(placeList);

  return (
    <div className="space-y-4">
      {placeList.map((place) => (
        <div
          key={place.id}
          className={`flex items-center justify-between p-2 ${
            mostVotedPlaceIds.includes(place.id) ? "bg-yellow-200" : ""
          } rounded-lg`}
        >
          <span>{place.place}</span>
          <span className="ml-4">투표 수: {place.memberList.length}</span>
        </div>
      ))}
      <button
        onClick={handleVoteClick}
        className="bg-gray-200 rounded-lg px-4 py-2 text-black w-full"
      >
        다시 투표하기
      </button>
    </div>
  );
};

export default PlaceVoteAfter;
