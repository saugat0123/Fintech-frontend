import {Province} from './province';
import {District} from './district';
import {MunicipalityVdc} from './municipality_VDC';

export class CustomerRelative {
    id: number;
    created: Date;
    lastModified: Date;
    customerRelation: string;
    customerRelativeName: string;
    citizenshipNumber: string;
    citizenshipIssuedDate: Date;
    citizenshipIssuedPlace: string;
    province: Province;
    district: District;
    municipalities: MunicipalityVdc;
}
