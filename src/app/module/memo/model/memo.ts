import {MemoType} from './memoType';
import {User} from '../../admin/modal/user';

export class Memo {
    id: number;
    subject: string;
    refNumber: string;
    sentBy: User;
    sentTo: User;
    cc: Array<User>;
    bcc: Array<User>;
    content: string;
    status: string;
    // stage: Stage
    stage: any;
    type: MemoType;
    // stages: Set<MemoStage>;
    stages: any;
    createdAt: string;
    lastModifiedAt: string;
    version: number;

}
