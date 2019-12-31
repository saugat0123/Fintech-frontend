import {District} from './district';
import {Province} from './province';
import {MunicipalityVdc} from './municipality_VDC';


export class Branch {
    id: number;
    name: string;
    branchCode: string;
    address: string;
    created: string;
    lastModified: string;
    district: District;
    province: Province;
    municipalityVdc: MunicipalityVdc;
    streetName: string;
    wardNumber: number;
    status: string;
    landlineNumber: string;
    email: string;
    locationPreview: string;
}
