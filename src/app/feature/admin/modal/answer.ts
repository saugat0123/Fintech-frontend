import {Questions} from './question';

export class Answer {
    id: number;
    description: string;
    version: number;
    points: number;
    status: string;
    question: Questions;
}
