import {Injectable} from '@angular/core';
import {Province} from '../../../pages/admin/modal/province';
import {District} from '../../../pages/admin/modal/district';
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
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }


    getDistrictByProvince(province: Province) {
        console.log(province);
        const url = 'v1/address/districtByProvince';
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, province, {headers: getUrl.header});
    }

    getMunicipalityVDCByDistrict(district: District) {
        const url = 'v1/address/municipalityVdcByDistrict';
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, district, {headers: getUrl.header});
    }
}
