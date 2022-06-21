import {RelativeOccupations} from './crg/relativeOccupations';

export class CustomerRelative {
    id: number;
    created: Date;
    lastModified: Date;
    customerRelation: string;
    customerRelativeName: string;
    citizenshipNumber: string;
    citizenshipIssuedDate: Date;
    citizenshipIssuedPlace: string;
    age: number;
    dateOfBirth: Date;
    relativeOtherOccupation: string;
}
