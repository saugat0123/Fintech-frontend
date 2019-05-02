import {Scheme} from './scheme';
import {Answer} from './answer';

export class Question {
    id: number;
    description: string;
    maximumPoints: number;
    scheme: Scheme;
    answer: Array<Answer>;
}
