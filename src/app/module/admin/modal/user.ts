
import { Branch } from './branch';
import {Role} from './role';

export class User {
    id: number;
    created: Date;
    lastModified: Date;
    accountNo: string;
    branch: Branch;
    email: string;
    name: string;
    password: string;
    profilePicture: string;
    signatureImage: string;
    status: string;
    userName: string;
    role: Role;
    fingerPrint: [];
    
}

