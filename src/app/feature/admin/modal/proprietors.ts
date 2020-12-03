import {Province} from './province';
import {District} from './district';
import {MunicipalityVdc} from './municipality_VDC';

export class Proprietors {
    id: number;
    name: string;
    contactNo: string;
    province: Province;
    district: District;
    municipalityVdc: MunicipalityVdc;
    share: number;
    version: string;
    type: string;
}
