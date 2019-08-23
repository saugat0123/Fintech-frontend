import {User} from '../../admin/modal/user';

export class MemoStage {
    id: number;
    note: string;
    createdAt: string;
    createdBy: number;
    lastModifiedAt: string;
    lastModifiedBy: number;
    stage: string;
    sentBy: User;
    sentTo: User;
    version: number;
}
