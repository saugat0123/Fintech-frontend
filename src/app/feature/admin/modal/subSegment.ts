import {Segment} from './segment';
import {LoanConfig} from './loan-config';

export class SubSegment {
    id: number;
    created: Date;
    lastModified: Date;
    subSegmentName: string;
    segment: Segment;
    funded: boolean;
    loanConfig: Array<LoanConfig>;
}
