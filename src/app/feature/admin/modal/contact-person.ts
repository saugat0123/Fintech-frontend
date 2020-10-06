import {Province} from './province';
import {District} from './district';
import {MunicipalityVdc} from './municipality_VDC';

export class ContactPerson {
    id: number;
    version: number;
    name: string;
    contactNumber: string;
    email: string;
    functionalPosition: string;
    province: Province;
    district: District;
    municipalityVdc: MunicipalityVdc;
}
