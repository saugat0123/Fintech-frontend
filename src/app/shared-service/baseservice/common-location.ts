import {Injectable} from '@angular/core';
import {CommonService} from './common-baseservice';
import {Province} from '../../module/admin/modal/province';
import {District} from '../../module/admin/modal/district';
import {MunicipalityVdc} from '../../module/admin/modal/municipality_VDC';

@Injectable({
    providedIn: 'root'
})
export class Location {
    provinceList: Array<Province>;
    districtList: Array<District>;
    municipalityVdc: Array<MunicipalityVdc>;

    constructor(private commonService: CommonService) {
    }

    getProvinece() {
        this.commonService.getByAll('v1/address/province').subscribe((response: any) => {
            console.log(response.detail);
            return this.provinceList = response.detail;
        });
    }

    getDistrictByProvince(province: Province) {
        this.commonService.getByPost('/v1/address/districtByProvince', province).subscribe((response: any) => {
            return this.districtList = response.detail;
        });
    }

    getMunicipalityVDCByDistrict(district: District) {
        this.commonService.getByPost('/v1/address/districtByProvince', district).subscribe((response: any) => {
            return this.municipalityVdc = response.detail;
        });
    }

}
