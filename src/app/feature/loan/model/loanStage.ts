import {User} from '../../admin/modal/user';
import {Role} from '../../admin/modal/role';
import {DocAction} from './docAction';

export class LoanStage {
  createdAt: Date;
  lastModifiedAt: Date;
  fromUser: User;
  toUser: User;
  fromRole: Role;
  toRole: Role;
  comment: string;
  docAction: DocAction;
  notify: boolean;

}
