import {Province} from '../../admin/modal/province';
import {District} from '../../admin/modal/district';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';

export class Guarantor {
    id: number;
    version: number;
    name: string;
    province: Province;
    district: District;
    municipalities: MunicipalityVdc;
    citizenNumber: string;
    issuedYear: Date;
    issuedPlace: string;
    contactNumber: string;
    fatherName: string;
    grandFatherName: string;
    relationship: string;
    docPath: string;
    netWorth: number;
}
