import {Branch} from './branch';
import {Role} from './role';

export class User {
    id: number;
    createdAt: Date;
    lastModifiedAt: Date;
    accountNo: string;
    branch: Branch;
    email: string;
    name: string;
    password: string;
    profilePicture: string;
    signatureImage: string;
    status: string;
    username: string;
    role: Role;
    fingerPrint: [];
}
