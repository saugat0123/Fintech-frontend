import {MemoType} from './memoType';
import {User} from '../../admin/modal/user';
import {MemoStage} from './MemoStage';

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
    stages: Array<MemoStage>;
    type: MemoType;
    // stages: Set<MemoStage>;
    createdAt: string;
    lastModifiedAt: string;
    version: number;
    proposalData: string;

}
