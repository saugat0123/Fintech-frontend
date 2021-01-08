import {BaseEntity} from '../../../@core/model/base-entity';
import {User} from '../../admin/modal/user';
import {Role} from '../../admin/modal/role';

export class CadStage extends BaseEntity {
    fromUser: User;
    fromRole: Role;
    toUser: User;
    toRole: Role;
    docAction: any;
    comment: string;
}
