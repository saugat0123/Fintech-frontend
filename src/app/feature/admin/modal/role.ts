import {RoleType} from './roleType';
import {RoleAccess} from './role-access';

export class Role {
    id: number;
    roleName: string;
    status: string;
    roleType: RoleType;
    roleAccess: RoleAccess;
}
