import {Scheme} from './scheme';
import {Answer} from './answer';

export class Questions {
    id: number;
    description: string;
    maximumPoints: number;
    version: number;
    appearanceOrder: number;
    scheme: Scheme;
    answers: Array<Answer>;
}
