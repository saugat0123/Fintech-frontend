
import { Branch } from './branch';

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
    role: [];
    fingerPrint: [];
    
}

