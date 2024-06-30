import React, { useState } from "react";

const ScheduleVoteBefore = ({ meetId }: { meetId: string }) => {
  const [schedules, setSchedules] = useState<string[]>([""]);

  const handleScheduleChange = (index: number, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index] = value;
    setSchedules(newSchedules);
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, ""]);
  };

  const handleRemoveSchedule = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
  };

  return (
    <div className="flex flex-col items-center">
      {schedules.map((schedule, index) => (
        <div key={index} className="flex items-center mb-4">
          <input
            type="text"
            value={schedule}
            onChange={(e) => handleScheduleChange(index, e.target.value)}
            className="p-2 border rounded bg-white"
            placeholder="항목 입력"
          />
          <button
            onClick={() => handleRemoveSchedule(index)}
            className=" bg-transparent border-none"
          >
            <i className="fa-solid fa-trash text-red-500"></i>
          </button>
        </div>
      ))}
      <button
        onClick={handleAddSchedule}
        className="p-2 border bg-white text-gray-400 px-4 rounded"
      >
        항목 추가
      </button>
    </div>
  );
};

export default ScheduleVoteBefore;
