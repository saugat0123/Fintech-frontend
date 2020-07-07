import {Injectable} from '@angular/core';
import {Province} from '../../../feature/admin/modal/province';
import {District} from '../../../feature/admin/modal/district';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    static API = 'v1/address';

    constructor(private http: HttpClient) {
    }

    getProvince() {
        const getUrl = ApiUtils.getRequest(`${AddressService.API}/province`);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }


    getDistrictByProvince(province: Province) {
        const getUrl = ApiUtils.getRequest(`${AddressService.API}/districtByProvince`);
        return this.http.post(getUrl.url, province, {headers: getUrl.header});
    }

    getMunicipalityVDCByDistrict(district: District) {
        const getUrl = ApiUtils.getRequest(`${AddressService.API}/municipalityVdcByDistrict`);
        return this.http.post(getUrl.url, district, {headers: getUrl.header});
    }

    getAllDistrict() {
        const getUrl = ApiUtils.getRequest(`${AddressService.API}/district`);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }
}
