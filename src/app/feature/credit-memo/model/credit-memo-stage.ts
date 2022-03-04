import {User} from '../../admin/modal/user';
import {Role} from '../../admin/modal/role';
import {DocAction} from '../../loan/model/docAction';

export class CreditMemoStage {
    id: number;
    docAction: DocAction;
    toUser: User;
    toRole: Role;
    fromUser: User;
    fromRole: Role;
    comment: string;
    version: number;
    createdAt: string;
    lastModifiedAt: string;
}
