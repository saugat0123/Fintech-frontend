import {District} from './district';
import {Province} from './province';
import {MunicipalityVdc} from './municipality_VDC';

export class Valuator {
    id: number;
    created: Date;
    lastModified: Date;
    name: string;
    contactNo: string;
    status: string;
    province: Province;
    district: District;
    municipalityVdc: MunicipalityVdc;
    streetName: string;
    wardNumber: string;
    siteProvince: Province;
    siteDistrict: District;
    siteMunicipalityVdc: MunicipalityVdc;
    siteStreetName: string;
    siteWardNumber: string;
}
