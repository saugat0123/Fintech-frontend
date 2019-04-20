import {MemoType} from "./memoType";
import {User} from "../../../modal/user";

export class Memo {
    id: number;
    subject: string;
    // sentBy: User;
    sentBy: any;
    // sentTo: User;
    sentTo: any;
    cc: Array<User>;
    // cc: any;
    bcc: Array<User>;
    // bcc: any;
    content: string;
    status: any;
    // stage: Stage
    stage: any;
    type: MemoType;
    // stages: Set<MemoStage>;
    stages: any;
}