import React from "react";

// 장소 정보 타입 정의
type Place = {
  id: string;
  place: string;
  editable: string;
  isVote: string;
  memberList: { id: string; name: string }[];
};

// 컴포넌트 props 타입 정의
type PlaceVoteAfterProps = {
  votedPlaces: Place[];
  setIsVoted: (value: boolean) => void;
  placeList: Place[];
};

const PlaceVoteAfter = ({
  votedPlaces,
  setIsVoted,
  placeList,
}: PlaceVoteAfterProps) => {
  // 다시 투표하기 버튼 클릭
  const handleVoteClick = () => {
    setIsVoted(false); // PlaceVoteBefore로 돌아감
  };

  return (
    <div className="space-y-4">
      {placeList.map((place) => (
        <div
          key={place.id}
          className="flex items-center justify-between p-2 rounded-lg bg-gray-200"
        >
          <span>{place.place}</span>
          <span className="ml-4">
            {votedPlaces.some((votedPlace) => votedPlace.id === place.id)
              ? "투표 완료"
              : ""}
          </span>
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
