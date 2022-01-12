import {Province} from '../../admin/modal/province';
import {District} from '../../admin/modal/district';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';

export class Collateral {
    id: number;
    version: number;
    name: string;
    province: Province;
    district: District;
    collateralName: string;
    collateralFatherName: string;
    collateralGrandFatherName: string;
    collateralDistrict: District;
    collateralMunVdc: MunicipalityVdc;
    collateralWardNo: string;
    collateralTemporaryDistrict: District;
    collateralTemporaryMunVdc: MunicipalityVdc;
    collateralTemporaryWardNo: string;
    plotNo: string;
    areaOfCollateral: string;
    seatNo: string;
    valuationDate: Date;
    valuatorName: string;
    fairMarketValue: string;
    distressValue: string;
}
