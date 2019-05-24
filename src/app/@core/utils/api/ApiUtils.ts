import {HttpHeaders} from '@angular/common/http';

import {ApiConfig} from './ApiConfig';

export class ApiUtils {

    public static getRequest(api: string) {
        const fullApi = `${ApiConfig.URL}/${api}`;
        const at = localStorage.getItem('at');

        return {
            url: fullApi,
            header: new HttpHeaders({
                'Authorization': 'Bearer ' + at,
                'Content-Type': 'application/json'
            })
        };
    }

    public static getRequestWithFileSupport(api: string) {
        const fullApi = `${ApiConfig.URL}/${api}`;
        const at = localStorage.getItem('at');
        return {
            url: fullApi,
            header: new HttpHeaders({
                'Authorization': 'Bearer ' + at,
                'enctype': 'multipart/form-data'
            })
        };
    }
}
