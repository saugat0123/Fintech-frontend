import {Guarantors} from './guarantors';

export class Security {
    id: number;
    version: number;
    data: string;
    valuatorId: number;
    guarantor: Array<Guarantors>;

}
