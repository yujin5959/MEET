import { Member } from "./Member";
import { Meet } from "./Meet";

export type PlaceMeet = Meet & {
  meetDate: string;
};

export type Place = {
  id: string;
  place: string;
  editable: string;
  isVote: string;
  memberList: Member[];
};
