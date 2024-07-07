import { Member } from "./Member"

export type Schedule = {
    id : string;
    date : string;
    editable : string;
    isVote: string;
    memberList : Member[];
}