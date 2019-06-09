import {Province} from './province';
import {District} from './district';
import {MunicipalityVdc} from './municipality_VDC';

export class Proprietors {
    id: number;
    created: Date;
    lastModified: Date;
    name: string;
    contactNo: string;
    province: Province;
    district: District;
    municipalitiesOrVDC: MunicipalityVdc;
    share: string;
}
