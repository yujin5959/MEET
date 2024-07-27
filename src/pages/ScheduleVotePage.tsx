import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScheduleVoteBefore from "@/components/ScheduleVoteBefore";
import ScheduleVoteAfter from "@/components/ScheduleVoteAfter";
import { server } from "@/utils/axios";
import { Schedule } from "@/types/ScheduleVote";

//모임
type Meet = {
  meetTitle: string;
  endDate: string;
};

const ScheduleVotePage = () => {
  const navigate = useNavigate();

  const { meetId } = useParams<{ meetId: string }>();
  const [meet, setMeet] = useState<Meet>({ meetTitle: '', endDate: '' });
  const [scheduleList, setScheduleList] = useState<Schedule[]>([]);
  const [isVoted, setIsVoted] = useState<boolean>(false);

  useEffect(() => {
    const fetchMeetSchedule = async () => {
      // load meet data
      await fetchMeet();

      //load schedule vote items
      await fetchScheduleVoteItems();
    }

    fetchMeetSchedule();
  }, [meetId, navigate]);

  useEffect(() => {
    const fetchIsVoted = async () => {
      //투표한 기록이 있는지 확인
      await checkUserVotedBefore()
    }
    fetchIsVoted();
    
  }, [meet, scheduleList]);

  // load meet data
  const fetchMeet = async() => {
    server.get(
      `/meet/schedule?meetId=${meetId}`
    )
    .then((response) => {
      setMeet(response.data);
    })
    .catch((error) => {
      if(error.code === "403"){
        navigate("/Unauthorized");
      }
      else if(error.code === "404"){
        navigate("/not-found");
      }
    });
  };

  //load schedule vote items
  const fetchScheduleVoteItems = async() => {
    server.get(
      `/meet/schedule/item/list?meetId=${meetId}`
    )
    .then((response) => {
      setScheduleList(response.data);
    })
    .catch((error) => {
      if(error.code === "403"){
        navigate("/Unauthorized");
      }
      else if(error.code === "404"){
        navigate("/not-found");
      }
    });
  };

  // 투표한 기록이 있는지 확인하는 함수
  const checkUserVotedBefore = async () => {
    var loginedUserId;
    await server.get("/member")
      .then((response) => {
        loginedUserId = response.data.id;
      })
      .catch((error) => {
        if(error.code === "403"){
          navigate("/Unauthorized");
        }
        else if(error.code === "404"){
          navigate("/auth/login");
        }
      });

    for (const schedule of scheduleList) {
      for (const member of schedule.memberList) {
        if (member.id === loginedUserId) {
          setIsVoted(true);
          return;
        }
      }
    }
    return;
  }

  return (
    <div className="bg-white p-8 md:p-8 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">
          {meet ? meet.meetTitle : ""}
        </h1>
        <p className="text-sm">
          {meet ? `마감 기한: ${meet.endDate}` : "마감 기한: "}
        </p>
      </div>
      <div className="p-4">
        {isVoted ? (
          <ScheduleVoteAfter
            scheduleList={scheduleList}
            setIsVoted={setIsVoted}
            fetchScheduleVoteItems={fetchScheduleVoteItems}
          />
        ) : (
          <ScheduleVoteBefore
            meetId={meetId!}
            scheduleList={scheduleList}
            setIsVoted={setIsVoted}
            fetchScheduleVoteItems={fetchScheduleVoteItems}
          />
        )}
      </div>
    </div>
  );
};

export default ScheduleVotePage;
