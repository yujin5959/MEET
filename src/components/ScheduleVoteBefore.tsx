import React, { useState, useEffect } from "react";
import axios from "axios";

type Schedule = {
  id: string;
  date: string;
  userId: string;
};

type ScheduleVoteBeforeProps = {
  meetId: string;
  existingSchedules: Schedule[];
  isVoted: boolean;
  onVoteClick: (date: string) => Promise<void>;
  currentUserId: string;
};

const ScheduleVoteBefore = ({
  meetId,
  existingSchedules,
  onVoteClick,
  currentUserId,
}: ScheduleVoteBeforeProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>(existingSchedules); // 모임 일정 목록 상태 관리
  const [newSchedule, setNewSchedule] = useState<string>(""); // 새로 추가할 모임 일정의 상태 관리
  const [isAdding, setIsAdding] = useState<boolean>(false); // 새로운 모임 일정 추가 중인지 여부 관리
  const [selectedSchedules, setSelectedSchedules] = useState<boolean[]>(
    existingSchedules.map(() => false)
  ); // 선택된 모임 일정 체크 여부 관리하는 배열
  const [isVoteEnabled, setIsVoteEnabled] = useState<boolean>(false); // 투표 버튼 활성화 여부 관리

  useEffect(() => {
    // 하나 이상 선택해야 투표 가능
    const anySelected = selectedSchedules.some((isSelected) => isSelected);
    setIsVoteEnabled(anySelected);
  }, [selectedSchedules]);

  // 새로운 모임 일정 값이 변경될 때
  const handleScheduleChange = (value: string) => {
    setNewSchedule(value);
  };

  // 항목추가 버튼 클릭할 때
  const handleAddSchedule = async () => {
    if (newSchedule.trim()) {
      try {
        const response = await axios.post(
          `http://54.180.29.36/meet/schedule/item`,
          {
            meetId,
            date: newSchedule,
            userId: currentUserId,
          }
        );

        const newScheduleItem: Schedule = {
          id: `${schedules.length + 1}`,
          date: newSchedule,
          userId: currentUserId,
        };
        setSchedules([...schedules, newScheduleItem]);
        setSelectedSchedules([...selectedSchedules, false]);
        setNewSchedule("");
        setIsAdding(false);
        console.log("투표항목 추가 성공:", response.data);
      } catch (error) {
        console.error("투표항목 추가 실패:", error);
      }
    }
  };

  // 기존 모임 일정 삭제 버튼 클릭 시
  const handleRemoveSchedule = (index: number) => {
    if (schedules[index].userId === currentUserId) {
      // 현재 사용자가 생성한 일정만 삭제 가능
      setSchedules(schedules.filter((_, i) => i !== index));
    }
  };
  // 체크박스 상태 변경할 때
  const handleCheckboxChange = (index: number) => {
    setSelectedSchedules((prev) =>
      prev.map((selected, i) => (i === index ? !selected : selected))
    );
  };

  // 투표하기 버튼 클릭할 때
  const handleVoteClick = async () => {
    const selectedDates = schedules
      .map((schedule, index) =>
        selectedSchedules[index] ? schedule.date : null
      )
      .filter((date) => date !== null) as string[];

    const votePromises = selectedDates.map((date) => onVoteClick(date));

    try {
      await Promise.all(votePromises);
      console.log("투표 추가 성공");
      setSelectedSchedules(existingSchedules.map(() => false));
    } catch (error) {
      console.error("투표 추가 실패:", error);
    }
  };

  return (
    <div className="space-y-4">
      {schedules.map((schedule, index) => (
        <div key={schedule.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedSchedules[index]}
              onChange={() => handleCheckboxChange(index)}
            />
            <span>{schedule.date}</span>
          </div>

          {schedule.userId === currentUserId && (
            <button
              onClick={() => handleRemoveSchedule(index)}
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
              type="text"
              value={newSchedule}
              onChange={(e) => handleScheduleChange(e.target.value)}
              placeholder="항목 입력"
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
          disabled={!selectedSchedules.some((isSelected) => isSelected)}
          className="bg-gray-200 rounded-lg px-4 py-2 text-black w-full"
        >
          투표하기
        </button>
      </div>
    </div>
  );
};

export default ScheduleVoteBefore;
