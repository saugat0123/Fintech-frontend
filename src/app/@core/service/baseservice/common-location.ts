import {Injectable} from '@angular/core';
import {Province} from '../../../feature/admin/modal/province';
import {District} from '../../../feature/admin/modal/district';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class CommonLocation {

    constructor(private http: HttpClient) {
    }

    getProvince() {
        const url = 'v1/address/province';
        const getUrl = ApiUtils.getRequest(url);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }


    getDistrictByProvince(province: Province) {
        console.log(province);
        const url = 'v1/address/districtByProvince';
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, province, {headers: getUrl.header});
    }

    getMunicipalityVDCByDistrict(district: District) {
        const url = 'v1/address/municipalityVdcByDistrict';
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, district, {headers: getUrl.header});
    }
}
