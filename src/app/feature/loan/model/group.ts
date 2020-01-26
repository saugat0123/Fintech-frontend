import {Valuator} from '../../admin/modal/valuator';

export class Group {
    id: number;
    version: number;
    data: string;
    valuator: Array<Valuator>;
}
