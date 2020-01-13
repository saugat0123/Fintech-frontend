import {District} from '../../admin/modal/district';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';

export class Address {
    districtList: Array<District>;
    municipalityVdcList: Array<MunicipalityVdc>;
    constructor(districtList: any = [], municipalityVdcList: any = []) {
        this.districtList = districtList;
        this.municipalityVdcList = municipalityVdcList;
    }
}
