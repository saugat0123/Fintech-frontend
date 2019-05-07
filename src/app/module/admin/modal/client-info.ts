import {ClientDocument} from './client-document';

export class ClientInfo{
    id: number;
    name: string;
    citizenshipNumber: number;
    contactNumber: number;
    interestRate: number;
    securities: string;
    documents: ClientDocument[];
}