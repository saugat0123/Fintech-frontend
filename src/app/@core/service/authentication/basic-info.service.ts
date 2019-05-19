import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ApiUtils} from '../../utils/api/ApiUtils';

@Injectable()
export class BasicInfoService {
    role: any;

    constructor(private http: HttpClient) {
    }

    getBasicInfo() {
        const basicInfo = ApiUtils.getRequest('v1/user/authenticated');
        return this.http.get(basicInfo.url, {headers: basicInfo.header});
    }


    getUsrRole() {
        const basicInfo = ApiUtils.getRequest('v1/user/role');
        return this.http.get(basicInfo.url, {headers: basicInfo.header});

    }

    logout() {
        localStorage.removeItem('at');
        localStorage.clear();

    }
}
