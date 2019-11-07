import {User} from '../../admin/modal/user';
import {Role} from '../../admin/modal/role';
import {DocAction} from './docAction';
import {BaseEntity} from '../../../@core/model/base-entity';

export class Stage extends BaseEntity {
    fromUser: User;
    toUser: User;
    fromRole: Role;
    toRole: Role;
    comment: string;
    docAction: DocAction;

}
