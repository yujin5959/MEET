import React, { useState, useEffect } from "react";
import { Place } from "@/types/PlaceVote";

// 컴포넌트 props 타입 정의
type PlaceVoteBeforeProps = {
  meetId: string;
  placeList: Place[];
  setIsVoted: (value: boolean) => void;
  setVotedPlaces: (places: Place[]) => void;
  updatePlaceList: (places: Place[]) => void;
};

const PlaceVoteBefore = ({
  meetId,
  placeList,
  setIsVoted,
  setVotedPlaces,
  updatePlaceList,
}: PlaceVoteBeforeProps) => {
  const [places, setPlaces] = useState<Place[]>(placeList);
  const [newPlace, setNewPlace] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedItemIdList, setSelectedItemIdList] = useState<string[]>([]);

  // 초기 선택된 장소 선택
  useEffect(() => {
    const updatedSelectedItemIdList = places
      .filter((place) => place.isVote === "true")
      .map((place) => place.id);
    setSelectedItemIdList(updatedSelectedItemIdList);
  }, [places]);

  // 새로운 장소 추가
  const handleAddPlace = () => {
    const newPlaceItem: Place = {
      id: Math.random().toString(36).substring(2), // 임시 ID 생성
      place: newPlace,
      editable: "true",
      isVote: "false",
      memberList: [],
    };

    const updatedPlaces = [...places, newPlaceItem];
    setPlaces(updatedPlaces);
    updatePlaceList(updatedPlaces);
    setNewPlace("");
    setIsAdding(false);
  };

  // 장소 삭제
  const handleRemovePlace = (id: string) => {
    const updatedPlaces = places.filter((place) => place.id !== id);
    setPlaces(updatedPlaces);
    updatePlaceList(updatedPlaces);
  };

  // 체크박스 변경
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItemIdList((prevList) => [...prevList, id]);
    } else {
      setSelectedItemIdList((prevList) =>
        prevList.filter((itemId) => itemId !== id)
      );
    }
  };

  // 투표하기 버튼 클릭할 때
  const handleVoteClick = () => {
    const votedPlaces = places.filter((place) =>
      selectedItemIdList.includes(place.id)
    );
    setVotedPlaces(votedPlaces);
    setIsVoted(true);
  };

  return (
    <div className="space-y-4">
      {places.map((place) => (
        <div key={place.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedItemIdList.includes(place.id)}
              onChange={() =>
                handleCheckboxChange(
                  place.id,
                  !selectedItemIdList.includes(place.id)
                )
              }
            />
            <span>{place.place}</span>
          </div>
          {place.editable === "true" && (
            <button
              onClick={() => handleRemovePlace(place.id)}
              className="bg-gray-200 rounded-lg px-4 py-2 text-black"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          )}
        </div>
      ))}
      <div className="flex justify-end">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-gray-200 rounded-lg px-4 py-2 text-black"
          >
            장소 추가
          </button>
        ) : (
          <div className="space-y-2 w-full">
            <input
              type="text"
              placeholder="장소"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 w-full"
            />

            <div className="flex space-x-2">
              <button
                onClick={() => setIsAdding(false)}
                className="bg-gray-200 rounded-lg px-4 py-2 text-black w-1/2"
              >
                취소
              </button>

              <button
                onClick={handleAddPlace}
                className="bg-gray-200 rounded-lg px-4 py-2 text-black w-1/2"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <button
          onClick={handleVoteClick}
          disabled={selectedItemIdList.length === 0}
          className="bg-gray-200 rounded-lg px-4 py-2 text-black w-full"
        >
          투표하기
        </button>
      </div>
    </div>
  );
};

export default PlaceVoteBefore;
