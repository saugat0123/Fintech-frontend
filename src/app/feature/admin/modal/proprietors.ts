import {Province} from './province';
import {District} from './district';
import {MunicipalityVdc} from './municipality_VDC';

export class Proprietors {
    name: string;
    contactNo: string;
    province: Province;
    district: District;
    municipalityVdc: MunicipalityVdc;
    share: number;
    type: string;
}
