import {Guarantor} from './guarantor';


export class Security {
    id: number;
    version: number;
    data: string;
    valuatorId: number;
    share;
    guarantor: Array<Guarantor>;

}
