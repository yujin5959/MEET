import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";
import { Schedule } from "@/types/ScheduleVote";

type ScheduleVoteBeforeProps = {
  meetId: string;
  scheduleList: Schedule[];
  setIsVoted: (value: boolean) => void;
  fetchScheduleVoteItems: () => Promise<void>;
};

const ScheduleVoteBefore = ({
  meetId,
  scheduleList,
  setIsVoted,
}: ScheduleVoteBeforeProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>(scheduleList);
  const [newDate, setNewDate] = useState<string>(""); // 새로 추가할 모임 일정의 상태 관리
  const [isAdding, setIsAdding] = useState<boolean>(false); // 새로운 모임 일정 추가 중인지 여부 관리
  const [selectedItemIdList, setSelectedItemIdList] = useState<string[]>([]);
  const [selectedSchedules, setSelectedSchedules] = useState<boolean[]>(
    scheduleList.map(() => false)
  ); // 선택된 모임 일정 체크 여부 관리하는 배열
  const [isVoteEnabled, setIsVoteEnabled] = useState<boolean>(false); // 투표 버튼 활성화 여부 관리
  const [isComposing, setIsComposing] = useState(false);

  const navigate = useNavigate();

  console.log(scheduleList);
  useEffect(() => {
    const updatedSelectedItemIdList = schedules
      .filter((schedule) => schedule.isVote === "true")
      .map((schedule) => schedule.id);
    setSelectedItemIdList(updatedSelectedItemIdList);
  }, [schedules]);

  //날짜 입력 상태 관리 함수
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDate(event.target.value);
  };

  // 항목추가 버튼 클릭할 때
  const handleAddSchedule = async () => {
    server.post(
      `/meet/schedule/item`,
      {
        data: {
          meetId: meetId,
          date: newDate,
        }
      }
    )
    .then((response) => {
      const newSchedule: Schedule = {
        id: response.data.id,
        date: response.data.date,
        editable: response.data.editable,
        isVote: response.data.isVote,
        memberList: response.data.memberList,
      };

      setSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
      setNewDate("");
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

  // 기존 모임 일정 삭제 버튼 클릭 시
  const handleRemoveSchedule = (id: string) => {
    server
      .delete(`/meet/schedule/item?scheduleVoteItemId=${id}`)
      .then((response) => {
        setSchedules((prevList) =>
          prevList.filter((schedule) => schedule.id !== id)
        );
      })
      .catch((error) => {
        if (error.code === "403") {
          navigate("/Unauthorized");
        } else if (error.code === "404") {
          navigate("/not-found");
        }
      });
  };
  // 체크박스 상태 변경할 때
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedSchedules((prevSelectedSchedules) => {
      const newSelectedSchedules = [...prevSelectedSchedules];

      // Update selectedItemIdList
      if (checked) {
        if (!selectedItemIdList.includes(id)) {
          setSelectedItemIdList((prevList) => [...prevList, id]);
        }
      } else {
        if (selectedItemIdList.includes(id)) {
          setSelectedItemIdList((prevList) =>
            prevList.filter((itemId) => itemId !== id)
          );
        }
      }

      return newSelectedSchedules;
    });
  };

  // 투표하기 버튼 클릭할 때
  const handleVoteClick = async () => {
    server
      .put("/meet/schedule", {
        data: {
          meetId: meetId,
          scheduleVoteItemList: selectedItemIdList,
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
      {schedules.map((schedule) => (
        <div key={schedule.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedItemIdList.includes(schedule.id)}
              onChange={(e) =>
                handleCheckboxChange(schedule.id, e.target.checked)
              }
            />
            <span>{schedule.date}</span>
          </div>

          {schedule.editable === "true" && (
            <button
              onClick={() => handleRemoveSchedule(schedule.id)}
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
            항목 추가
          </button>
        ) : (
          <div className="space-y-2 w-full">
            <input
              type="date"
              value = {newDate}
              onChange={handleDateChange}
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
                onClick={handleAddSchedule}
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
          disabled={selectedItemIdList.length == 0}
          className="bg-gray-200 rounded-lg px-4 py-2 text-black w-full"
        >
          투표하기
        </button>
      </div>
    </div>
  );
};

export default ScheduleVoteBefore;
