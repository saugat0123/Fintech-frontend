import {Guarantor} from "./guarantor";


export class Security {
    id: number;
    version: number;
    data: string;
    valuatorId: number;
    guarantor: Array<Guarantor>;

}
