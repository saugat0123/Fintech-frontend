import {District} from './district';
import {Province} from './province';
import {MunicipalityVdc} from './municipality_VDC';


export class Branch {
    id: number;
    name: string;
    nepaliName: string;
    branchCode: string;
    address: string;
    created: string;
    lastModified: string;
    district: District;
    province: Province;
    streetName: string;
    wardNumber: number;
    municipalityVdc: MunicipalityVdc;
    status: string;
    landlineNumber: string;
    email: string;
    locationPreview: string;
    version: number;
}
