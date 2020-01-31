import {Role} from '../../admin/modal/role';

export class ApprovalRoleHierarchy {
    id: number;
    role: Role;
    version: number;
    roleOrder: number;
    approvalType: string;
    refId: number;
}
