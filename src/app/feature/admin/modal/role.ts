import {RoleType} from './roleType';

export class Role {
    id?: number;
    roleName?: string;
    status?: string;
    roleType?: RoleType;
    roleAccess?: string;
    version?: number;
    name?: string;
    authorityLabel?: string;
    signApprovalSheet?: boolean;
}
