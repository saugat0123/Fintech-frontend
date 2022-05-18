import {BaseEntity} from '../../../@core/model/base-entity';
import {Province} from '../../admin/modal/province';
import {District} from '../../admin/modal/district';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';
import {Valuator} from '../../admin/modal/valuator';

export class LandBuilding extends BaseEntity {
    governmentRate: number;
    marketRate: number;
    fairMarketValue: number;
    distressValue: number;
    considerValue: number;
    sheetNo: number;
    plotNumber: number;
    province: Province;
    district: District;
    municipalityVdc: MunicipalityVdc;
    geoLocation: string;
    buildingValuator: Valuator;
    addressLine1: string;
    addressLine2: string;
    registerOffice: string;
    data: string;
    freeLimit: number;
    usedAmount: number;
    coverage: number;

}
