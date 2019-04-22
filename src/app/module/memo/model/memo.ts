import {MemoType} from './memoType';
import {User} from '../../../modal/user';

export class Memo {
    id: number;
    subject: string;
    referenceNo: string;
    sentBy: User;
    sentTo: User;
    cc: Array<User>;
    bcc: Array<User>;
    content: string;
    status: any;
    // stage: Stage
    stage: any;
    type: MemoType;
    // stages: Set<MemoStage>;
    stages: any;
}
