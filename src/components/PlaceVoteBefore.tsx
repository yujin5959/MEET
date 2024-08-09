import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";
import { Place } from "@/types/PlaceVote";

// 컴포넌트 props 타입 정의
type PlaceVoteBeforeProps = {
  meetId: string;
  placeList: Place[];
  setIsVoted: (value: boolean) => void;
  fetchPlaceVoteItems: () => Promise<void>;
};

const PlaceVoteBefore = ({
  meetId,
  placeList,
  setIsVoted,
  fetchPlaceVoteItems,
}: PlaceVoteBeforeProps) => {
  const [places, setPlaces] = useState<Place[]>(placeList);
  const [newPlace, setNewPlace] = useState<string>(""); // 새로 추가할 모임 장소의 상태 관리
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedItemIdList, setSelectedItemIdList] = useState<string[]>([]);

  const navigate = useNavigate();

  // 장소가 변경될 때 선택된 장소 목록을 업데이트
  useEffect(() => {
    const updatedSelectedItemIdList = places
      .filter((place) => place.isVote === "true")
      .map((place) => place.id);
    setSelectedItemIdList(updatedSelectedItemIdList);
  }, [places]);

  // 장소 입력 상태 관리 함수
  const handlePlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlace(event.target.value);
  };

  // 새로운 장소 추가
  const handleAddPlace = async () => {
    console.log("Sending data to server:", { meetId, place: newPlace });
    server
      .post(`/meet/place/item`, {
        data: {
          meetId: meetId,
          place: newPlace,
        },
      })
      .then((response) => {
        const newPlace: Place = {
          id: response.data.id,
          place: response.data.place,
          editable: response.data.editable,
          isVote: response.data.isVote,
          memberList: response.data.memberList,
        };

        setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
        setNewPlace(""); // 입력 필드 초기화
        setIsAdding(false); // 장소 추가 입력창 숨기기
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };

  // 장소 삭제
  const handleRemovePlace = (id: string) => {
    server
      .delete(`/meet/place/item?placeVoteItemId=${id}`)
      .then((response) => {
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
    if (checked) {
      if (!selectedItemIdList.includes(id)) {
        setSelectedItemIdList((prevList) => [...prevList, id]);
      }
    } else {
      if (selectedItemIdList.includes(id)) {
        setSelectedItemIdList((prevList) =>
          prevList.filter((itemId) => itemId !== id)
        ); // 선택된 항목 목록에서 제거
      }
    }
  };

  // 투표하기 버튼 클릭할 때
  const handleVoteClick = async () => {
    server
      .put("/meet/place", {
        data: {
          meetId: meetId,
          placeVoteItemList: selectedItemIdList,
        },
      })
      .then((response) => {
        setIsVoted(true);
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };

  return (
    <div className="space-y-4">
      {places.map((place) => (
        <div key={place.id} className="flex items-center justify-between">
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
              onChange={handlePlaceChange}
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
