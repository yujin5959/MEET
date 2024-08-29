import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";
import { Place } from "@/types/PlaceVote";

type PlaceVoteBeforeProps = {
  meetId: string;
  placeList: Place[];
  setIsVoted: (value: boolean) => void; // 투표 여부 상태 업데이트 함수
  fetchPlaceVoteItems: () => void; // 장소 목록을 새로 가져오는 함수 
  handlePlaceChange: (placeIds: string[]) => void; // 장소 변경 핸들러
};

const PlaceVoteBefore = ({
  meetId,
  placeList,
  handlePlaceChange,
}: PlaceVoteBeforeProps) => {
  const [places, setPlaces] = useState<Place[]>(placeList);
  const [newPlace, setNewPlace] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedItemIdList, setSelectedItemIdList] = useState<string[]>([]);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 초기 장소 목록 설정
  useEffect(() => {
    setPlaces(placeList);
  }, [placeList]);

  // 장소가 변경될 때 선택된 장소 목록을 업데이트
  useEffect(() => {
    const updatedSelectedItemIdList = places
      .filter((place) => place.isVote === "true")
      .map((place) => place.id);
    setSelectedItemIdList(updatedSelectedItemIdList);
  }, [places]);

  // 새로운 장소 입력 상태 관리 함수
  const handleNewPlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlace(event.target.value); // 입력된 장소 업데이트
  };

  // 장소 추가 함수
  const handleAddPlace = async () => {
    server
      .post(`/meet/place/item`, {
        data: {
          meetId: meetId,
          place: newPlace,
        },
      })
      .then((response) => {
        const newPlaceItem: Place = {
          id: response.data.id,
          place: response.data.place,
          editable: response.data.editable,
          isVote: response.data.isVote,
          memberList: response.data.memberList,
        };

        setPlaces((prevPlaces) => [...prevPlaces, newPlaceItem]);
        setNewPlace(""); 
        setIsAdding(false);
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };

  // 장소 삭제 함수
  const handleRemovePlace = (id: string) => {
    server
      .delete(`/meet/place/item?placeVoteItemId=${id}`)
      .then(() => {
        setPlaces((prevList) => prevList.filter((place) => place.id !== id));
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };

  // 체크박스 변경
  const handleCheckboxChange = (id: string, checked: boolean) => {
    const updatedList = checked
    ? [...selectedItemIdList, id]
    : selectedItemIdList.filter((itemId) => itemId !== id);

  setSelectedItemIdList(updatedList);
  handlePlaceChange(updatedList);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-grow">
      {places.map((place) => (
        <div key={place.id} className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedItemIdList.includes(place.id)}
              onChange={(e) => handleCheckboxChange(place.id, e.target.checked)}
            />
            <span>{place.place}</span> 
          </div>
          {place.editable === "true" && (
            <button
              onClick={() => handleRemovePlace(place.id)}
              className="text-[#8E8E93] bg-transparent p-0 mr-2"
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
          )}
        </div>
      ))}
      </div>
      <div className="flex justify-end">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="text-[13px] text-[#8E8E93] bg-transparent p-0 mt-1"
          >
            <i className="fa-solid fa-plus"></i> 장소 추가
          </button>
        ) : (
          <div className="space-y-2 w-full">
            <input
              type="text"
              placeholder="장소"
              value={newPlace}
              onChange={handleNewPlaceChange}
              className="border border-[#F2F2F7] rounded-lg px-2 py-1 w-full"
            />

            <div className="flex space-x-2">
              <button
                onClick={() => setIsAdding(false)}
                className="bg-[#F2F2F7] rounded-lg px-4 py-2 text-black w-1/2"
              >
                취소
              </button>

              <button
                onClick={handleAddPlace}
                className="bg-[#F2F2F7] rounded-lg px-4 py-2 text-black w-1/2"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceVoteBefore;
