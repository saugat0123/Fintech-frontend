import {Branch} from './branch';
import {Role} from './role';

export class User {
    id: number;
    createdAt: Date;
    lastModifiedAt: Date;
    branch: Array<Branch>;
    email: string;
    name: string;
    password: string;
    profilePicture: string;
    signatureImage: string;
    status: string;
    username: string;
    role: Role;
    fingerPrint: [];
    resetPasswordToken: string;
    resetPasswordTokenExpiry: Date;
}
