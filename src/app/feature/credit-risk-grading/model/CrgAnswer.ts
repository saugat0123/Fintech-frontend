import {Status} from 'tslint/lib/runner';
import {CrgQuestion} from './CrgQuestion';

export class CrgAnswer {
    id: number;
    description: string;
    version: number;
    points: number;
    status;
    crgQuestion: CrgQuestion;
}
