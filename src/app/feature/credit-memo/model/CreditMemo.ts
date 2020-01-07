import {User} from '../../admin/modal/user';
import {MemoStage} from '../../memo/model/MemoStage';
import {CreditMemoType} from './CreditMemoType';

export class CreditMemo {
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
    type: CreditMemoType;
    // stages: Set<MemoStage>;
    createdAt: string;
    lastModifiedAt: string;
    version: number;
}
