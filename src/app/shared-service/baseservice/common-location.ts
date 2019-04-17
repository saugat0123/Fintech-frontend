import {Injectable} from '@angular/core';
import {Province} from '../../module/admin/modal/province';
import {District} from '../../module/admin/modal/district';
import {MunicipalityVdc} from '../../module/admin/modal/municipality_VDC';
import {HttpClient} from '@angular/common/http';
import {RestApiService} from '../authentication/rest-api.service';

@Injectable({
    providedIn: 'root'
})
export class CommonLocation {

    constructor(private http: HttpClient,
                private restApiService: RestApiService) {
    }

    getProvince() {
        const url = 'v1/address/province';
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.get(getUrl.url);
    }


    getDistrictByProvince(province: Province) {
        const url = 'v1/address/districtByProvince';
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, province);
    }

    getMunicipalityVDCByDistrict(district: District) {
        const url = 'v1/address/municipalityVdcByDistrict';
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, district);
    }
}
