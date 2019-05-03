import {Scheme} from './scheme';
import {Answer} from './answer';

export class Questions {
    id: number;
    description: string;
    maximumPoints: number;
    scheme: Scheme;
    answers: Array<Answer>;
}
