import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PlaceVoteBefore from "@/components/PlaceVoteBefore";
import PlaceVoteAfter from "@/components/PlaceVoteAfter";
import { PlaceMeet, Place } from "@/types/PlaceVote";

const PlaceVotePage = () => {
  const { meetId } = useParams<{ meetId: string }>();
  const [meet, setMeet] = useState<PlaceMeet>({
    meetTitle: "",
    meetDate: "2024-07-30",
    endDate: "2024-07-16",
  });
  const [placeList, setPlaceList] = useState<Place[]>([]);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [votedPlaces, setVotedPlaces] = useState<Place[]>([]);

  const updatePlaceList = (newPlaceList: Place[]) => {
    setPlaceList(newPlaceList);
  };

  return (
    <div className="bg-white p-8 md:p-8 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{meet.meetTitle}</h1>
        <div>
          <p className="text-sm">모임 날짜: {meet.meetDate}</p>
          <p className="text-sm">투표 마감: {meet.endDate}</p>
        </div>
      </div>
      <div className="p-4">
        {isVoted ? (
          <PlaceVoteAfter
            votedPlaces={votedPlaces}
            setIsVoted={setIsVoted}
            placeList={placeList}
          />
        ) : (
          <PlaceVoteBefore
            meetId={meetId!}
            placeList={placeList}
            setIsVoted={setIsVoted}
            setVotedPlaces={setVotedPlaces}
            updatePlaceList={updatePlaceList}
          />
        )}
      </div>
    </div>
  );
};
export default PlaceVotePage;
