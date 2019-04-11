import {Segment} from './segment';

export class SubSegment {
    id: number;
    created: Date;
    lastModified: Date;
    subSegmentName: string;
    segment: Segment;
    funded: boolean;
}
