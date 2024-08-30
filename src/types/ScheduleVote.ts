import { Member } from "./Member"

export type Schedule = {
    id : string;
    date : string;
    time : string;
    editable : string;
    isVote: string;
    memberList : Member[];
}