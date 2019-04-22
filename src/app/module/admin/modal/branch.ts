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
    district:District;
    province:Province;
    streetName: string;
    wardNumber: string;
    municipalityVdc:MunicipalityVdc;

}